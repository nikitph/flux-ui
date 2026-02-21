import React, { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface CollapseProps {
    children: React.ReactNode;
    open: boolean;
    initialHeight?: number;
    fade?: boolean;
    overflow?: "hidden" | "visible";
    onOpenComplete?: () => void;
    onCloseComplete?: () => void;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
    (
        {
            children,
            open,
            initialHeight = 0,
            fade = true,
            overflow = "hidden",
            onOpenComplete,
            onCloseComplete,
            physics = "smooth",
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        const [contentHeight, setContentHeight] = useState<number | "auto">(initialHeight);

        useEffect(() => {
            if (!contentRef.current) return;

            if (open) {
                const height = contentRef.current.getBoundingClientRect().height;
                setContentHeight(height);
            } else {
                const height = contentRef.current.getBoundingClientRect().height;
                setContentHeight(height);

                // Immediately trigger the collapse animation starting from current height
                requestAnimationFrame(() => {
                    setContentHeight(initialHeight);
                });
            }
        }, [open, initialHeight]);

        const handleAnimationComplete = () => {
            if (open) {
                setContentHeight("auto");
                onOpenComplete?.();
            } else {
                onCloseComplete?.();
            }
        };

        if (disabled) {
            if (!open && initialHeight === 0) return null;
            return (
                <div ref={mergedRef} className={className} style={{ height: open ? "auto" : initialHeight, overflow: open ? overflow : "hidden", ...style }} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <motion.div
                ref={mergedRef}
                className={className}
                initial={{ height: initialHeight, opacity: fade ? 0 : 1 }}
                animate={{
                    height: contentHeight,
                    opacity: open ? 1 : (fade ? 0 : 1),
                }}
                transition={springConfig as any}
                onAnimationComplete={handleAnimationComplete}
                style={{ overflow, ...style }}
                {...props}
            >
                <div ref={contentRef}>
                    {children}
                </div>
            </motion.div>
        );
    }
);
Collapse.displayName = "Collapse";
