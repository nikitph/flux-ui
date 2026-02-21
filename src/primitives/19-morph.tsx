import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { Slot } from "../utils/slot";

export interface MorphProps {
    children: React.ReactNode;
    layoutId: string;
    tag?: any;
    mode?: "position" | "size" | "both";
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    disabled?: boolean;
}

export const Morph = forwardRef<HTMLElement, MorphProps>(
    (
        {
            children,
            layoutId,
            tag: Tag = "div",
            mode = "both",
            physics = "smooth",
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

        if (disabled || isReducedMotion) {
            if (asChild) return <Slot ref={mergedRef} className={className} style={style} {...props}>{children}</Slot>;
            const Comp = Tag as any;
            return <Comp ref={mergedRef} className={className} style={style} {...props}>{children}</Comp>;
        }

        const layoutProp = mode === "both" ? true : mode;
        const MotionComponent = asChild ? motion.create(Slot) : ((Tag ? motion(Tag as any) : motion.div) as any);

        return (
            <MotionComponent
                ref={mergedRef as any}
                layoutId={layoutId}
                layout={layoutProp}
                transition={springConfig as any}
                className={className}
                style={style}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
Morph.displayName = "Morph";
