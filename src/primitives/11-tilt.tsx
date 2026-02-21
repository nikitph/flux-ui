import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface TiltProps {
    children: React.ReactNode;
    maxTilt?: number;
    perspective?: number;
    scale?: number;
    glare?: boolean;
    glareOpacity?: number;
    glareColor?: string;
    reverse?: boolean;
    resetOnLeave?: boolean;
    disableOnTouch?: boolean;
    axis?: "both" | "x" | "y";
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Tilt = forwardRef<HTMLDivElement, TiltProps>(
    (
        {
            children,
            maxTilt = 15,
            perspective = 1000,
            scale = 1.02,
            glare = false,
            glareOpacity = 0.15,
            glareColor = "white",
            reverse = false,
            resetOnLeave = true,
            disableOnTouch = true,
            axis = "both",
            physics = "snappy",
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

        const [isTouchDevice, setIsTouchDevice] = React.useState(false);
        useEffect(() => setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches), []);

        const x = useMotionValue(0);
        const y = useMotionValue(0);
        const glareX = useMotionValue(50);
        const glareY = useMotionValue(50);
        const s = useMotionValue(1);

        const rotateX = useSpring(x, isReducedMotion ? { duration: 0 } : springConfig as any);
        const rotateY = useSpring(y, isReducedMotion ? { duration: 0 } : springConfig as any);
        const scaleVal = useSpring(s, isReducedMotion ? { duration: 0 } : springConfig as any);
        const gX = useSpring(glareX, isReducedMotion ? { duration: 0 } : springConfig as any);
        const gY = useSpring(glareY, isReducedMotion ? { duration: 0 } : springConfig as any);

        // Cache rect to avoid layout thrashing
        const rectRef = useRef<DOMRect | null>(null);
        const updateRect = useCallback(() => {
            if (internalRef.current) {
                rectRef.current = internalRef.current.getBoundingClientRect();
            }
        }, []);

        useEffect(() => {
            updateRect();
            window.addEventListener("scroll", updateRect, { passive: true });
            window.addEventListener("resize", updateRect, { passive: true });
            return () => {
                window.removeEventListener("scroll", updateRect);
                window.removeEventListener("resize", updateRect);
            };
        }, [updateRect]);

        // rAF-throttled mousemove
        const rafId = useRef<number>(0);
        const latestEvent = useRef<React.MouseEvent<HTMLDivElement> | null>(null);

        const processMouseMove = useCallback(() => {
            rafId.current = 0;
            const e = latestEvent.current;
            if (!e) return;

            const rect = rectRef.current;
            if (!rect) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = (e.clientX - centerX) / rect.width;
            const mouseY = (e.clientY - centerY) / rect.height;
            const multiplier = reverse ? -1 : 1;

            if (axis === "both" || axis === "y") {
                x.set(-mouseY * maxTilt * 2 * multiplier);
            }
            if (axis === "both" || axis === "x") {
                y.set(mouseX * maxTilt * 2 * multiplier);
            }
            s.set(scale);

            if (glare) {
                glareX.set((e.clientX - rect.left) / rect.width * 100);
                glareY.set((e.clientY - rect.top) / rect.height * 100);
            }
        }, [x, y, s, glareX, glareY, maxTilt, reverse, axis, scale, glare]);

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (disabled || isReducedMotion || (disableOnTouch && isTouchDevice)) return;
            latestEvent.current = e;
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(processMouseMove);
            }
        }, [disabled, isReducedMotion, disableOnTouch, isTouchDevice, processMouseMove]);

        const handleMouseLeave = useCallback(() => {
            if (disabled || isReducedMotion) return;
            if (resetOnLeave) {
                x.set(0);
                y.set(0);
            }
            s.set(1);
        }, [x, y, s, resetOnLeave, disabled, isReducedMotion]);

        // Cleanup rAF on unmount
        useEffect(() => {
            return () => {
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };
        }, []);

        const glareBackground = useMotionTemplate`radial-gradient(circle at ${gX}% ${gY}%, ${glareColor} 0%, transparent 80%)`;

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={style} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{ perspective: `${perspective}px`, transformStyle: "preserve-3d", position: "relative", ...style }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        scale: scaleVal,
                        transformStyle: "preserve-3d",
                        width: "100%",
                        height: "100%",
                        willChange: "transform",
                    }}
                >
                    {children}
                    {glare && (
                        <motion.div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: glareBackground,
                                opacity: glareOpacity,
                                pointerEvents: "none",
                                borderRadius: "inherit",
                            }}
                        />
                    )}
                </motion.div>
            </div>
        );
    }
);
Tilt.displayName = "Tilt";
