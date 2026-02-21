import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useMergedRef } from "../hooks/useMergedRef";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { Slot } from "../utils/slot";

export interface MagneticProps {
    children: React.ReactNode;
    strength?: number;
    radius?: number;
    maxDisplacement?: number;
    spring?: PhysicsPreset;
    disableOnTouch?: boolean;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
}

export const Magnetic = forwardRef<HTMLElement, MagneticProps>(
    (
        {
            children,
            strength = 0.3,
            radius = 150,
            maxDisplacement = 20,
            spring = "snappy",
            disableOnTouch = true,
            className,
            style,
            asChild = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(spring, undefined, isReducedMotion);

        const [isTouchDevice, setIsTouchDevice] = React.useState(false);

        useEffect(() => {
            setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
        }, []);

        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const springX = useSpring(x, isReducedMotion ? { duration: 0 } : springConfig as any);
        const springY = useSpring(y, isReducedMotion ? { duration: 0 } : springConfig as any);

        // Cache rect to avoid layout thrashing — update on scroll/resize
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

        // Throttle mousemove to one rAF per frame
        const rafId = useRef<number>(0);
        const latestEvent = useRef<MouseEvent | null>(null);

        const processMouseMove = useCallback(() => {
            const e = latestEvent.current;
            rafId.current = 0;
            if (!e) return;

            if (isReducedMotion || (disableOnTouch && isTouchDevice)) return;
            const rect = rectRef.current;
            if (!rect) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance <= radius) {
                const moveX = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaX * strength));
                const moveY = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaY * strength));
                x.set(moveX);
                y.set(moveY);
            } else {
                x.set(0);
                y.set(0);
            }
        }, [x, y, radius, maxDisplacement, strength, isTouchDevice, disableOnTouch, isReducedMotion]);

        const handleMouseMove = useCallback((e: MouseEvent) => {
            latestEvent.current = e;
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(processMouseMove);
            }
        }, [processMouseMove]);

        const handleMouseLeave = useCallback(() => {
            x.set(0);
            y.set(0);
        }, [x, y]);

        useEffect(() => {
            window.addEventListener("mousemove", handleMouseMove, { passive: true });
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };
        }, [handleMouseMove]);

        const MotionComponent = asChild ? motion.create(Slot) : motion.div;

        return (
            <MotionComponent
                ref={mergedRef as any}
                className={className}
                style={{ ...style, x: springX, y: springY, willChange: "transform" }}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
Magnetic.displayName = "Magnetic";
