import React, { forwardRef, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface LongPressProps {
    children: React.ReactNode;
    duration?: number;
    onLongPress?: () => void;
    onPressStart?: () => void;
    onPressEnd?: () => void;
    feedback?: "ring" | "fill" | "scale" | "none";
    feedbackColor?: string;
    cancelOnMove?: boolean;
    haptic?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const LongPress = forwardRef<HTMLDivElement, LongPressProps>(
    (
        {
            children,
            duration = 0.8,
            onLongPress,
            onPressStart,
            onPressEnd,
            feedback = "ring",
            feedbackColor = "currentColor",
            cancelOnMove = true,
            haptic = false,
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
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);
        const controls = useAnimation();

        const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const [isPressed, setIsPressed] = useState(false);

        if (disabled) {
            return (
                <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                    {children}
                </div>
            );
        }

        const handlePointerDown = () => {
            setIsPressed(true);
            onPressStart?.();

            if (feedback === "scale" && !isReducedMotion) {
                controls.start({ scale: 0.95 }, { duration });
            } else if (feedback === "ring" && !isReducedMotion) {
                controls.start({ strokeDashoffset: 0 }, { duration, ease: "linear" });
            } else if (feedback === "fill" && !isReducedMotion) {
                controls.start({ scaleX: 1 }, { duration, ease: "linear" });
            }

            timerRef.current = setTimeout(() => {
                setIsPressed(false);
                onLongPress?.();
                if (haptic && typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }, duration * 1000);
        };

        const handlePointerUp = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setIsPressed(false);
            onPressEnd?.();

            // Revert animations
            if (!isReducedMotion) {
                if (feedback === "scale") controls.start({ scale: 1 }, springConfig as any);
                if (feedback === "ring") controls.start({ strokeDashoffset: 100 }, springConfig as any);
                if (feedback === "fill") controls.start({ scaleX: 0 }, springConfig as any);
            }
        };

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{ position: "relative", userSelect: "none", ...style }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerMove={cancelOnMove ? () => {
                    if (isPressed) handlePointerUp();
                } : undefined}
                {...props}
            >
                <motion.div animate={controls} style={feedback === "scale" ? { originX: 0.5, originY: 0.5 } : {}}>
                    {children}
                </motion.div>

                {feedback === "ring" && (
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                        <motion.rect
                            width="100%"
                            height="100%"
                            fill="none"
                            stroke={feedbackColor}
                            strokeWidth="4"
                            rx="8" // Match standard button radius roughly
                            strokeDasharray="100 100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={controls}
                        />
                    </svg>
                )}

                {feedback === "fill" && (
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: feedbackColor,
                            opacity: 0.2,
                            originX: 0,
                            pointerEvents: "none",
                        }}
                        initial={{ scaleX: 0 }}
                        animate={controls}
                    />
                )}
            </div>
        );
    }
);
LongPress.displayName = "LongPress";
