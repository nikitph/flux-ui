import React, { forwardRef, useState } from "react";
import { motion, PanInfo, useAnimation } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface SwipeProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down" | "horizontal" | "vertical" | "any";
    threshold?: number;
    velocityThreshold?: number;
    rubberBand?: boolean;
    rubberBandFactor?: number;
    onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
    onSwipeStart?: (direction: "left" | "right" | "up" | "down") => void;
    renderBackground?: (direction: "left" | "right", progress: number) => React.ReactNode;
    snapBack?: boolean;
    exitAnimation?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Swipe = forwardRef<HTMLDivElement, SwipeProps>(
    (
        {
            children,
            direction = "horizontal",
            threshold = 0.4,
            velocityThreshold = 500,
            rubberBand = true,
            rubberBandFactor = 0.2,
            onSwipe,
            onSwipeStart,
            renderBackground,
            snapBack = true,
            exitAnimation = true,
            physics = "smooth",
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);
        const controls = useAnimation();

        const [swipeProgress, setSwipeProgress] = useState(0);
        const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

        if (disabled) {
            return (
                <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                    {children}
                </div>
            );
        }

        const dragProp = direction === "horizontal" ? "x" : direction === "vertical" ? "y" : true;

        const handleDrag = (_: any, info: PanInfo) => {
            if (!internalRef.current) return;
            const rect = internalRef.current.getBoundingClientRect();
            const progress = Math.min(Math.max(info.offset.x / rect.width, -1), 1);
            setSwipeProgress(Math.abs(progress));
            setSwipeDirection(progress > 0 ? "right" : progress < 0 ? "left" : null);
        };

        const handleDragEnd = async (_: any, info: PanInfo) => {
            if (!internalRef.current) return;
            const rect = internalRef.current.getBoundingClientRect();
            const offset = direction === "vertical" ? info.offset.y : info.offset.x;
            const velocity = direction === "vertical" ? info.velocity.y : info.velocity.x;
            const size = direction === "vertical" ? rect.height : rect.width;

            const isBeyondThreshold = Math.abs(offset) > size * threshold;
            const isFastEnough = Math.abs(velocity) > velocityThreshold;

            if (isBeyondThreshold || isFastEnough) {
                const swipedDir = offset > 0 ? (direction === "vertical" ? "down" : "right") : (direction === "vertical" ? "up" : "left");
                onSwipe?.(swipedDir);

                if (exitAnimation) {
                    const exitDistance = offset > 0 ? size : -size;
                    await controls.start(
                        isReducedMotion
                            ? { opacity: 0 }
                            : { [direction === "vertical" ? "y" : "x"]: exitDistance, opacity: 0 },
                        springConfig as any
                    );
                }
            } else if (snapBack) {
                controls.start({ x: 0, y: 0 }, springConfig as any);
            }
            setSwipeProgress(0);
        };

        return (
            <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                {renderBackground && swipeDirection && (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                        {renderBackground(swipeDirection, swipeProgress)}
                    </div>
                )}
                <motion.div
                    drag={dragProp}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={rubberBand ? rubberBandFactor : 0}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    style={{ zIndex: 1, position: "relative" }}
                >
                    {children}
                </motion.div>
            </div>
        );
    }
);
Swipe.displayName = "Swipe";
