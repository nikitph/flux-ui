import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface SpotlightProps {
    children: React.ReactNode;
    size?: number;
    color?: string;
    borderColor?: string;
    opacity?: number;
    blur?: number;
    mode?: "glow" | "reveal" | "border";
    disableOnTouch?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>(
    (
        {
            children,
            size = 200,
            color = "rgba(255,255,255,0.1)",
            borderColor,
            opacity = 0.15,
            blur = 40,
            mode = "glow",
            disableOnTouch = true,
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

        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        const x = useSpring(mouseX, isReducedMotion ? { duration: 0 } : springConfig as any);
        const y = useSpring(mouseY, isReducedMotion ? { duration: 0 } : springConfig as any);

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
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        }, [mouseX, mouseY]);

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (disabled || isReducedMotion || (disableOnTouch && isTouchDevice)) return;
            // Update rect on first move (handles initial render before scroll/resize)
            if (!rectRef.current && internalRef.current) {
                rectRef.current = internalRef.current.getBoundingClientRect();
            }
            latestEvent.current = e;
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(processMouseMove);
            }
        }, [disabled, isReducedMotion, disableOnTouch, isTouchDevice, processMouseMove]);

        // Cleanup rAF on unmount
        useEffect(() => {
            return () => {
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };
        }, []);

        // Cap blur to avoid expensive compositing
        const cappedBlur = Math.min(blur, 20);

        const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 100%)`;
        const borderBackground = borderColor
            ? useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${borderColor}, transparent 100%)`
            : background;

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{ position: "relative", ...style }}
                onMouseMove={handleMouseMove}
                {...props}
            >
                {mode === "border" && (
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: -1,
                            background: borderBackground,
                            opacity,
                            zIndex: 0,
                            pointerEvents: "none",
                            borderRadius: "inherit",
                            maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "exclude",
                            willChange: "background",
                        }}
                    />
                )}

                <div style={{ position: "relative", zIndex: 1 }}>{children}</div>

                {(mode === "glow" || mode === "reveal") && (
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background,
                            opacity,
                            zIndex: 2,
                            pointerEvents: "none",
                            borderRadius: "inherit",
                            mixBlendMode: mode === "reveal" ? "overlay" : "normal",
                            filter: `blur(${cappedBlur}px)`,
                            willChange: "background",
                        }}
                    />
                )}
            </div>
        );
    }
);
Spotlight.displayName = "Spotlight";
