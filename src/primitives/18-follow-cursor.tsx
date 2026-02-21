import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { Slot } from "../utils/slot";

export interface FollowCursorProps {
    children: React.ReactNode;
    offset?: { x: number; y: number };
    lag?: number;
    rotate?: boolean;
    hideOnLeave?: boolean;
    containTo?: "parent" | "viewport" | "none";
    visible?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    disabled?: boolean;
}

export const FollowCursor = forwardRef<HTMLDivElement, FollowCursorProps>(
    (
        {
            children,
            offset = { x: 16, y: 16 },
            lag = 0.2,
            rotate = false,
            hideOnLeave = true,
            containTo = "parent",
            visible = true,
            physics = "smooth",
            className,
            style,
            asChild = false,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);

        // Adjust physics based on lag directly 
        const customPhysics: PhysicsPreset | any = {
            type: "spring",
            stiffness: 400 * (1 - lag),
            damping: 30 * (1 - lag),
        };
        const springConfig = resolveMotion(undefined, customPhysics, isReducedMotion);

        const x = useMotionValue(0);
        const y = useMotionValue(0);
        const r = useMotionValue(0);

        const smoothX = useSpring(x, isReducedMotion ? { duration: 0 } : springConfig as any);
        const smoothY = useSpring(y, isReducedMotion ? { duration: 0 } : springConfig as any);
        const smoothR = useSpring(r, isReducedMotion ? { duration: 0 } : springConfig as any);

        const [isVisible, setIsVisible] = useState(visible && !hideOnLeave);

        const updatePosition = useCallback((clientX: number, clientY: number) => {
            let posX = clientX + offset.x;
            let posY = clientY + offset.y;

            if (containTo === "parent" && internalRef.current?.parentElement) {
                const parentRect = internalRef.current.parentElement.getBoundingClientRect();
                // Assuming position absolute
                posX = clientX - parentRect.left + offset.x;
                posY = clientY - parentRect.top + offset.y;
            }

            if (rotate) {
                const dx = posX - x.get();
                const dy = posY - y.get();
                if (dx !== 0 || dy !== 0) {
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    r.set(angle);
                }
            }

            x.set(posX);
            y.set(posY);
        }, [x, y, r, rotate, offset, containTo]);

        useEffect(() => {
            if (disabled || isReducedMotion) return;

            const target = containTo === "viewport" ? window : (internalRef.current?.parentElement || window);

            const handleMouseMove = (e: MouseEvent) => {
                updatePosition(e.clientX, e.clientY);
                if (hideOnLeave && !isVisible) setIsVisible(visible);
            };

            const handleMouseEnter = () => {
                if (hideOnLeave) setIsVisible(visible);
            };

            const handleMouseLeave = () => {
                if (hideOnLeave) setIsVisible(false);
            };

            target.addEventListener("mousemove", handleMouseMove as any);
            target.addEventListener("mouseenter", handleMouseEnter as any);
            target.addEventListener("mouseleave", handleMouseLeave as any);

            return () => {
                target.removeEventListener("mousemove", handleMouseMove as any);
                target.removeEventListener("mouseenter", handleMouseEnter as any);
                target.removeEventListener("mouseleave", handleMouseLeave as any);
            };
        }, [disabled, isReducedMotion, containTo, updatePosition, hideOnLeave, visible, isVisible]);

        useEffect(() => {
            setIsVisible(visible);
        }, [visible]);

        if (disabled) {
            if (asChild) return <Slot ref={mergedRef} className={className} style={style} {...props}>{children}</Slot>;
            return <div ref={mergedRef as any} className={className} style={style} {...props}>{children}</div>;
        }

        const MotionComponent = asChild ? motion.create(Slot) : motion.div;
        const positionStyle = containTo === "viewport" ? "fixed" : "absolute";

        return (
            <MotionComponent
                ref={mergedRef as any}
                className={className}
                style={{
                    position: positionStyle,
                    top: 0,
                    left: 0,
                    x: smoothX,
                    y: smoothY,
                    rotate: smoothR,
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: "none", // Cursor followers typically shouldn't block events
                    zIndex: 50, // Usually want cursor follow to be high up
                    ...style,
                }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ opacity: { duration: 0.2 } }}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
FollowCursor.displayName = "FollowCursor";
