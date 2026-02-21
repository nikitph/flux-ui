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

        // For disabling on touch
        const [isTouchDevice, setIsTouchDevice] = React.useState(false);

        useEffect(() => {
            setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
        }, []);

        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const springX = useSpring(x, isReducedMotion ? { duration: 0 } : springConfig as any);
        const springY = useSpring(y, isReducedMotion ? { duration: 0 } : springConfig as any);

        const handleMouseMove = useCallback((e: MouseEvent) => {
            if (isReducedMotion || (disableOnTouch && isTouchDevice)) return;
            if (!internalRef.current) return;

            const rect = internalRef.current.getBoundingClientRect();
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

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        useEffect(() => {
            window.addEventListener("mousemove", handleMouseMove);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }, [handleMouseMove]);

        const MotionComponent = asChild ? motion.create(Slot) : motion.div;

        return (
            <MotionComponent
                ref={mergedRef as any}
                className={className}
                style={{ ...style, x: springX, y: springY }}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
Magnetic.displayName = "Magnetic";
