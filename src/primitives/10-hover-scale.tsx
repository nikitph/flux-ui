import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { resolveMotion } from "../utils/resolveMotion";
import { Slot } from "../utils/slot";

export interface HoverScaleProps {
    children: React.ReactNode;
    hoverScale?: number;
    pressScale?: number;
    hoverRotate?: number;
    liftShadow?: boolean;
    shadowColor?: string;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    disabled?: boolean;
}

export const HoverScale = forwardRef<HTMLElement, HoverScaleProps>(
    (
        {
            children,
            hoverScale = 1.03,
            pressScale = 0.97,
            hoverRotate = 0,
            liftShadow = false,
            shadowColor = "rgba(0,0,0,0.15)",
            physics = "snappy",
            className,
            style,
            asChild = false,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        if (disabled) {
            if (asChild) return <Slot ref={mergedRef} className={className} style={style} {...props}>{children}</Slot>;
            return <div ref={mergedRef as any} className={className} style={style} {...props}>{children}</div>;
        }

        const whileHover = isReducedMotion
            ? { opacity: 0.8 }
            : {
                scale: hoverScale,
                rotate: hoverRotate,
                boxShadow: liftShadow ? `0 10px 30px ${shadowColor}` : undefined
            };

        const whileTap = isReducedMotion
            ? { opacity: 0.6 }
            : { scale: pressScale };

        const MotionComponent = asChild ? motion.create(Slot) : motion.div;

        return (
            <MotionComponent
                ref={mergedRef as any}
                className={className}
                style={style}
                whileHover={whileHover}
                whileTap={whileTap}
                transition={springConfig as any}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
HoverScale.displayName = "HoverScale";
