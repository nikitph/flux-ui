import React, { forwardRef } from "react";
import { motion, PanInfo } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
// resolveMotion unused
import { useMergedRef } from "../hooks/useMergedRef";
import { Slot } from "../utils/slot";

export interface DragProps {
    children: React.ReactNode;
    axis?: "x" | "y" | "both";
    constraints?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    } | React.RefObject<HTMLElement>;
    snapBack?: boolean;
    snapPoints?: Array<{ x: number; y: number }>;
    snapThreshold?: number;
    dragElastic?: number;
    onDragStart?: (event: PointerEvent, info: PanInfo) => void;
    onDrag?: (event: PointerEvent, info: PanInfo) => void;
    onDragEnd?: (event: PointerEvent, info: PanInfo) => void;
    cursor?: "grab" | "move" | "default";
    handle?: React.RefObject<HTMLElement>;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    disabled?: boolean;
}

export const Drag = forwardRef<HTMLElement, DragProps>(
    (
        {
            children,
            axis = "both",
            constraints,
            snapBack = false,
            snapPoints,
            snapThreshold = 50,
            dragElastic = 0.2,
            onDragStart,
            onDrag,
            onDragEnd,
            cursor = "grab",
            handle,
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
        // springConfig unused

        if (disabled) {
            if (asChild) return <Slot ref={mergedRef} className={className} style={style} {...props}>{children}</Slot>;
            return <div ref={mergedRef as any} className={className} style={style} {...props}>{children}</div>;
        }

        const handleDragEnd = (e: any, info: PanInfo) => {
            onDragEnd?.(e, info);
            // Custom snap logic could go here by animating motion values imperatively,
            // but Framer Motion handles `dragSnapToOrigin` for the basic snapBack case automatically
        };

        const MotionComponent = asChild ? motion.create(Slot) : motion.div;

        return (
            <MotionComponent
                ref={mergedRef as any}
                drag={axis === "both" ? true : axis}
                dragConstraints={constraints as any}
                dragElastic={dragElastic}
                dragSnapToOrigin={snapBack}
                dragTransition={{ bounceStiffness: isReducedMotion ? 0 : 600, bounceDamping: 20 }}
                whileDrag={{ cursor: cursor === "grab" ? "grabbing" : cursor }}
                onDragStart={onDragStart as any}
                onDrag={onDrag as any}
                onDragEnd={handleDragEnd}
                dragControls={undefined}
                dragListener={!handle}
                className={className}
                style={{ cursor, ...style }}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
Drag.displayName = "Drag";
