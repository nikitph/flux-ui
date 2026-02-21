import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
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

        // Cache previous position for rotation calc to avoid .get() calls
        const prevPos = useRef({ x: 0, y: 0 });

        const updatePosition = useCallback((clientX: number, clientY: number) => {
            let posX = clientX + offset.x;
            let posY = clientY + offset.y;

            if (containTo === "parent" && internalRef.current?.parentElement) {
                const parentRect = internalRef.current.parentElement.getBoundingClientRect();
                posX = clientX - parentRect.left + offset.x;
                posY = clientY - parentRect.top + offset.y;
            }

            if (rotate) {
                const dx = posX - prevPos.current.x;
                const dy = posY - prevPos.current.y;
                if (dx !== 0 || dy !== 0) {
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    r.set(angle);
                }
            }

            prevPos.current.x = posX;
            prevPos.current.y = posY;
            x.set(posX);
            y.set(posY);
        }, [x, y, r, rotate, offset, containTo]);

        // rAF-throttled mousemove
        const rafId = useRef<number>(0);
        const latestMouse = useRef<{ x: number; y: number } | null>(null);

        const processMouseMove = useCallback(() => {
            rafId.current = 0;
            const e = latestMouse.current;
            if (!e) return;
            updatePosition(e.x, e.y);
        }, [updatePosition]);

        useEffect(() => {
            if (disabled || isReducedMotion) return;

            const target = containTo === "viewport" ? window : (internalRef.current?.parentElement || window);

            const handleMouseMove = (e: MouseEvent) => {
                latestMouse.current = { x: e.clientX, y: e.clientY };
                if (!rafId.current) {
                    rafId.current = requestAnimationFrame(processMouseMove);
                }
                if (hideOnLeave && !isVisible) setIsVisible(visible);
            };

            const handleMouseEnter = () => {
                if (hideOnLeave) setIsVisible(visible);
            };

            const handleMouseLeave = () => {
                if (hideOnLeave) setIsVisible(false);
            };

            target.addEventListener("mousemove", handleMouseMove as any, { passive: true });
            target.addEventListener("mouseenter", handleMouseEnter as any, { passive: true });
            target.addEventListener("mouseleave", handleMouseLeave as any, { passive: true });

            return () => {
                target.removeEventListener("mousemove", handleMouseMove as any);
                target.removeEventListener("mouseenter", handleMouseEnter as any);
                target.removeEventListener("mouseleave", handleMouseLeave as any);
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };
        }, [disabled, isReducedMotion, containTo, processMouseMove, hideOnLeave, visible, isVisible]);

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
                    pointerEvents: "none",
                    zIndex: 50,
                    willChange: "transform",
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
