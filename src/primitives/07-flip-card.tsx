import React, { forwardRef, useState } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface FlipCardProps {
    front: React.ReactNode;
    back: React.ReactNode;
    flipped?: boolean;
    direction?: "horizontal" | "vertical";
    trigger?: "click" | "hover" | "manual";
    perspective?: number;
    height?: string | number;
    width?: string | number;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const FlipCard = forwardRef<HTMLDivElement, FlipCardProps>(
    (
        {
            front,
            back,
            flipped: controlledFlipped,
            direction = "horizontal",
            trigger = "click",
            perspective = 1000,
            height = "100%",
            width = "100%",
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

        const [isFlippedState, setFlipped] = useState(false);
        const isFlipped = controlledFlipped !== undefined ? controlledFlipped : isFlippedState;

        if (disabled) {
            return (
                <div ref={mergedRef} className={className} style={{ ...style, height, width }} {...props}>
                    {isFlipped ? back : front}
                </div>
            );
        }

        const handleInteraction = () => {
            if (trigger === "click") {
                setFlipped((prev) => !prev);
            }
        };

        const handleHoverStart = () => {
            if (trigger === "hover") setFlipped(true);
        };

        const handleHoverEnd = () => {
            if (trigger === "hover") setFlipped(false);
        };

        const rotateAxis = direction === "horizontal" ? "rotateY" : "rotateX";

        // Front face rotation: 0 -> 180. Back face: -180 -> 0 (or equivalent)
        const frontRotate = isFlipped ? 180 : 0;
        const backRotate = isFlipped ? 360 : 180;

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{
                    perspective: `${perspective}px`,
                    position: "relative",
                    height,
                    width,
                    ...style,
                }}
                onClick={handleInteraction}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                {...props}
            >
                <motion.div
                    animate={isReducedMotion ? undefined : { [rotateAxis]: frontRotate, opacity: isReducedMotion ? (isFlipped ? 0 : 1) : 1 }}
                    transition={springConfig as any}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                >
                    {front}
                </motion.div>

                <motion.div
                    animate={isReducedMotion ? undefined : { [rotateAxis]: backRotate, opacity: isReducedMotion ? (isFlipped ? 1 : 0) : 1 }}
                    transition={springConfig as any}
                    initial={{ [rotateAxis]: 180, opacity: isReducedMotion ? 0 : 1 }}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                >
                    {back}
                </motion.div>
            </div>
        );
    }
);
FlipCard.displayName = "FlipCard";
