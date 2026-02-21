import React, { forwardRef, useEffect, useRef } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
// resolveMotion unused
import { useMergedRef } from "../hooks/useMergedRef";

export interface ScrollVelocityProps {
    children?: React.ReactNode | ((velocity: number) => React.ReactNode);
    effect?: "speed" | "blur" | "stretch" | "skew" | "opacity";
    sensitivity?: number;
    maxEffect?: number;
    direction?: "x" | "y";
    smoothing?: number;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const ScrollVelocity = forwardRef<HTMLDivElement, ScrollVelocityProps>(
    (
        {
            children,
            effect = "speed",
            sensitivity = 1,
            maxEffect,
            direction = "y",
            smoothing = 0.5,
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

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={style} {...props}>
                    {typeof children === "function" ? children(0) : children}
                </div>
            );
        }

        const { scrollY, scrollX } = useScroll();
        const scrollValue = direction === "y" ? scrollY : scrollX;
        const velocity = useVelocity(scrollValue);

        // Smooth the velocity
        const smoothedVelocity = useSpring(velocity, {
            damping: 50,
            stiffness: 400,
        });

        const maxEffectVal = maxEffect ?? (
            effect === "blur" ? 10 :
                effect === "stretch" ? 1.5 :
                    effect === "skew" ? 15 :
                        effect === "speed" ? 100 : 1
        );

        const filter = useTransform(smoothedVelocity, (v) => {
            if (effect !== "blur") return "none";
            const val = Math.min(Math.abs(v) * sensitivity * 0.01, maxEffectVal);
            return `blur(${val}px)`;
        });

        const scaleY = useTransform(smoothedVelocity, (v) => {
            if (effect !== "stretch") return 1;
            const val = Math.min(1 + Math.abs(v) * sensitivity * 0.001, maxEffectVal);
            return val;
        });

        const skewDeg = useTransform(smoothedVelocity, (v) => {
            if (effect !== "skew") return 0;
            const sign = Math.sign(v);
            const val = Math.min(Math.abs(v) * sensitivity * 0.1, maxEffectVal);
            return sign * val;
        });

        // Custom CSS variable for explicit speed pass-down — direct DOM, no React state
        useEffect(() => {
            if (effect === "speed" && internalRef.current) {
                return smoothedVelocity.on("change", (latest) => {
                    if (internalRef.current) {
                        internalRef.current.style.setProperty("--scroll-velocity", Math.min(Math.abs(latest * sensitivity), maxEffectVal).toString());
                    }
                });
            }
        }, [effect, smoothedVelocity, sensitivity, maxEffectVal]);

        // For render-prop children, use direct DOM updates instead of React state
        useEffect(() => {
            if (typeof children === "function") {
                return smoothedVelocity.on("change", (latest) => {
                    // Update a data attribute for CSS-based consumers
                    if (internalRef.current) {
                        internalRef.current.dataset.velocity = latest.toString();
                    }
                });
            }
        }, [children, smoothedVelocity]);

        // For function children, we still need one state for initial render,
        // but we throttle updates to avoid per-frame re-renders
        const [currentVelocity, setCurrentVelocity] = React.useState(0);
        const lastUpdateRef = useRef(0);
        useEffect(() => {
            if (typeof children === "function") {
                return smoothedVelocity.on("change", (latest) => {
                    const now = performance.now();
                    // Throttle React state updates to ~30fps for render-prop pattern
                    if (now - lastUpdateRef.current > 33) {
                        lastUpdateRef.current = now;
                        setCurrentVelocity(latest);
                    }
                });
            }
        }, [children, smoothedVelocity]);

        return (
            <motion.div
                ref={mergedRef as any}
                className={className}
                style={{
                    ...style,
                    filter,
                    scaleY,
                    skewY: effect === "skew" ? skewDeg : undefined,
                    transformOrigin: direction === "y" ? "center" : "left",
                    willChange: "transform",
                } as any}
                {...props}
            >
                {typeof children === "function" ? children(currentVelocity) : children}
            </motion.div>
        );
    }
);
ScrollVelocity.displayName = "ScrollVelocity";
