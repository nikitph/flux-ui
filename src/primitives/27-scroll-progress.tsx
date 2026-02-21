import React, { forwardRef, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface ScrollProgressProps {
    children?: React.ReactNode;
    axis?: "x" | "y";
    container?: React.RefObject<HTMLElement | null>;
    color?: string;
    height?: number | string;
    position?: "top" | "bottom" | "left" | "right" | "none";
    smooth?: boolean;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
    (
        {
            children,
            axis = "x",
            container,
            color = "var(--flux-primary, #000)",
            height = 4,
            position = "top",
            smooth = true,
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

        const { scrollYProgress, scrollXProgress } = useScroll({
            container: container?.current ? container : undefined,
        });

        const progress = axis === "x" ? scrollYProgress : scrollXProgress; // Note: generally scrollY controls horizontal progress bar width

        const springProgress = useSpring(progress, {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001,
        });

        const scaleValue = (smooth && !isReducedMotion) ? springProgress : progress;

        if (disabled || isReducedMotion) {
            return children ? (
                <div ref={mergedRef} className={className} style={style} {...props}>
                    {children}
                </div>
            ) : null;
        }

        const posStyles: React.CSSProperties =
            position === "none"
                ? {}
                : position === "top"
                    ? { position: "fixed", top: 0, left: 0, right: 0, transformOrigin: "0% 50%" }
                    : position === "bottom"
                        ? { position: "fixed", bottom: 0, left: 0, right: 0, transformOrigin: "0% 50%" }
                        : position === "left"
                            ? { position: "fixed", top: 0, bottom: 0, left: 0, transformOrigin: "50% 0%" }
                            : { position: "fixed", top: 0, bottom: 0, right: 0, transformOrigin: "50% 0%" };

        const dimStyles: any =
            position === "top" || position === "bottom" || position === "none"
                ? { height, width: "100%", scaleX: scaleValue as any }
                : { width: height, height: "100%", scaleY: scaleValue as any };

        if (!children) {
            return (
                <motion.div
                    ref={mergedRef as any}
                    className={className}
                    style={{
                        ...posStyles,
                        ...dimStyles,
                        backgroundColor: color,
                        zIndex: 9999,
                        ...style,
                    }}
                    {...props}
                />
            );
        }

        // Wrap children, applying scroll progress to a transform
        return (
            <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                {children}
                <motion.div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        backgroundColor: color,
                        scaleX: axis === "x" ? (scaleValue as any) : undefined,
                        scaleY: axis === "y" ? (scaleValue as any) : undefined,
                        transformOrigin: "0% 0%",
                        zIndex: -1,
                    }}
                />
            </div>
        );
    }
);
ScrollProgress.displayName = "ScrollProgress";
