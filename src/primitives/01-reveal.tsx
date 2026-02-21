import React, { forwardRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { motionScale, PhysicsPreset } from "../config/flux.config";
import { resolveMotion } from "../utils/resolveMotion";
import { Slot } from "../utils/slot";

export interface RevealProps {
    children: React.ReactNode;
    physics?: PhysicsPreset;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    from?: "below" | "above" | "left" | "right" | "none";
    distance?: number;
    fade?: boolean;
    scale?: number | false;
    rotate?: number | false;
    trigger?: "mount" | "viewport" | "manual";
    threshold?: number;
    once?: boolean;
    delay?: number;
    show?: boolean;
    onReveal?: () => void;
}

export const Reveal = forwardRef<HTMLElement, RevealProps>(
    (
        {
            children,
            physics = "gentle",
            disabled = false,
            className,
            style,
            asChild = false,
            from = "below",
            distance = motionScale.distance.md,
            fade = true,
            scale = false,
            rotate = false,
            trigger = "viewport",
            threshold = 0.2,
            once = true,
            delay = 0,
            show = true,
            onReveal,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const inView = useInView(internalRef, { amount: threshold, once });
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        const [hasRevealed, setHasRevealed] = useState(false);

        if (disabled) {
            if (asChild) return <Slot ref={mergedRef} className={className} style={style} {...props}>{children}</Slot>;
            return <div ref={mergedRef as any} className={className} style={style} {...props}>{children}</div>;
        }

        const initial = {
            opacity: fade ? (isReducedMotion ? 0 : 0) : 1,
            x: isReducedMotion ? 0 : from === "left" ? -distance : from === "right" ? distance : 0,
            y: isReducedMotion ? 0 : from === "below" ? distance : from === "above" ? -distance : 0,
            scale: isReducedMotion ? 1 : scale !== false ? scale : 1,
            rotate: isReducedMotion ? 0 : rotate !== false ? rotate : 0,
        };

        const target = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

        let shouldAnimate = false;
        if (trigger === "mount") shouldAnimate = true;
        else if (trigger === "viewport") shouldAnimate = inView;
        else if (trigger === "manual") shouldAnimate = show;

        useEffect(() => {
            if (shouldAnimate && !hasRevealed) {
                setHasRevealed(true);
                onReveal?.();
            }
        }, [shouldAnimate, hasRevealed, onReveal]);

        const MotionComponent = asChild ? motion.create(Slot) : motion.div;

        return (
            <MotionComponent
                ref={mergedRef as any}
                initial={initial}
                animate={shouldAnimate ? target : initial}
                transition={{ ...springConfig, delay: isReducedMotion ? 0 : delay }}
                className={className}
                style={{ ...style, willChange: "transform, opacity" }}
                {...props}
            >
                {children}
            </MotionComponent>
        );
    }
);
Reveal.displayName = "Reveal";
