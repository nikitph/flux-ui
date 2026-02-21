import React, { forwardRef, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface ParallaxProps {
    children: React.ReactNode;
    offset?: number;
    direction?: "up" | "down" | "left" | "right";
    container?: React.RefObject<HTMLElement | null>;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Parallax = forwardRef<HTMLDivElement, ParallaxProps>(
    (
        {
            children,
            offset = 50,
            direction = "up",
            container,
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);

        const { scrollYProgress } = useScroll({
            target: internalRef,
            container: container?.current ? container : undefined,
            offset: ["start end", "end start"],
        });

        const transformStart = direction === "up" ? offset : direction === "down" ? -offset : direction === "left" ? offset : -offset;
        const transformEnd = direction === "up" ? -offset : direction === "down" ? offset : direction === "left" ? -offset : offset;

        const translate = useTransform(scrollYProgress, [0, 1], [transformStart, transformEnd]);

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={style} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <motion.div
                ref={mergedRef as any}
                className={className}
                style={{
                    ...style,
                    y: direction === "up" || direction === "down" ? translate : 0,
                    x: direction === "left" || direction === "right" ? translate : 0,
                    willChange: "transform",
                }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Parallax.displayName = "Parallax";
