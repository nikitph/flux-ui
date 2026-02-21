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
        // springConfig unused

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
        }); // Could use options.smoothing if customizing spring config

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

        const skewY = useTransform(smoothedVelocity, (v) => {
            if (effect !== "skew") return 0;
            const sign = Math.sign(v);
            const val = Math.min(Math.abs(v) * sensitivity * 0.1, maxEffectVal);
            return `${sign * val}deg`;
        });

        // Custom CSS variable for explicit speed pass-down
        useEffect(() => {
            if (effect === "speed" && internalRef.current) {
                return smoothedVelocity.on("change", (latest) => {
                    if (internalRef.current) {
                        internalRef.current.style.setProperty("--scroll-velocity", Math.min(Math.abs(latest * sensitivity), maxEffectVal).toString());
                    }
                });
            }
        }, [effect, smoothedVelocity, sensitivity, maxEffectVal]);

        const [currentVelocity, setCurrentVelocity] = React.useState(0);
        useEffect(() => {
            if (typeof children === "function") {
                return smoothedVelocity.on("change", setCurrentVelocity);
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
                    transformOrigin: direction === "y" ? "center" : "left",
                    // Framer doesn't cleanly map skewY string like this, using standard inline style is safer
                } as any}
                animate={effect === "skew" ? { skewY: skewY.get() as any } : undefined}
                {...props}
            >
                {typeof children === "function" ? children(currentVelocity) : children}
            </motion.div>
        );
    }
);
ScrollVelocity.displayName = "ScrollVelocity";
