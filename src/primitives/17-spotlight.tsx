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

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (disabled || isReducedMotion || (disableOnTouch && isTouchDevice)) return;
            if (!internalRef.current) return;

            const rect = internalRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        }, [mouseX, mouseY, disabled, isReducedMotion, disableOnTouch, isTouchDevice]);

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                    {children}
                </div>
            );
        }

        const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 100%)`;
        const borderBackground = borderColor
            ? useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${borderColor}, transparent 100%)`
            : background;

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
                            inset: -1, // Adjust based on desired border width
                            background: borderBackground,
                            opacity,
                            zIndex: 0,
                            pointerEvents: "none",
                            borderRadius: "inherit",
                            maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "exclude",
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
                            filter: `blur(${blur}px)`,
                        }}
                    />
                )}
            </div>
        );
    }
);
Spotlight.displayName = "Spotlight";
