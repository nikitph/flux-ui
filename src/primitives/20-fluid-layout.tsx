import React, { forwardRef, useRef } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface FluidLayoutProps {
    children: React.ReactNode;
    axis?: "width" | "height" | "both";
    overflow?: "hidden" | "visible";
    tag?: any;
    debounce?: number;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const FluidLayout = forwardRef<HTMLElement, FluidLayoutProps>(
    (
        {
            children,
            axis = "both",
            overflow = "hidden",
            tag: Tag = "div",
            debounce = 0,
            physics = "smooth",
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        if (disabled || isReducedMotion) {
            const Comp = Tag as any;
            return (
                <Comp ref={mergedRef} className={className} style={{ ...style, overflow: overflow === "hidden" ? "hidden" : "visible" }} {...props}>
                    {children}
                </Comp>
            );
        }

        const layoutProp = axis === "both" ? true : axis === "width" ? "position" : "size"; // Approximation for directional layout in framer motion
        const MotionComponent = motion[Tag as keyof typeof motion] as any;

        return (
            <MotionComponent
                ref={mergedRef}
                layout={layoutProp}
                transition={springConfig as any}
                className={className}
                style={{ ...style, overflow }}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
FluidLayout.displayName = "FluidLayout";
