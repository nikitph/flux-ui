import React, { forwardRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { motionScale, PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { Slot } from "../utils/slot";

export interface StaggerProps {
    children: React.ReactNode;
    interval?: number;
    from?: "first" | "last" | "center" | "random";
    reveal?: {
        from?: "below" | "above" | "left" | "right" | "none";
        distance?: number;
        fade?: boolean;
        scale?: number | false;
    };
    trigger?: "mount" | "viewport" | "manual";
    threshold?: number;
    once?: boolean;
    show?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    disabled?: boolean;
}

export const Stagger = forwardRef<HTMLElement, StaggerProps>(
    (
        {
            children,
            interval = motionScale.stagger.normal,
            from = "first",
            reveal = { from: "below", distance: motionScale.distance.md, fade: true, scale: false },
            trigger = "viewport",
            threshold = 0.1,
            once = true,
            show = true,
            physics = "gentle",
            className,
            style,
            asChild = false,
            disabled = false,
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

        let shouldAnimate = false;
        if (trigger === "mount") shouldAnimate = true;
        else if (trigger === "viewport") shouldAnimate = inView;
        else if (trigger === "manual") shouldAnimate = show;

        useEffect(() => {
            if (shouldAnimate && !hasRevealed) {
                setHasRevealed(true);
            }
        }, [shouldAnimate, hasRevealed]);

        const childrenArray = React.Children.toArray(children);
        const count = childrenArray.length;
        let randomSeed = 0.5; // for deterministic random

        const getInitial = () => {
            if (isReducedMotion) return { opacity: 0, x: 0, y: 0, scale: 1 };
            const rFrom = reveal.from || "below";
            const rDist = reveal.distance || motionScale.distance.md;
            const rFade = reveal.fade ?? true;
            const rScale = reveal.scale ?? false;

            return {
                opacity: rFade ? 0 : 1,
                y: rFrom === "below" ? rDist : rFrom === "above" ? -rDist : 0,
                x: rFrom === "left" ? -rDist : rFrom === "right" ? rDist : 0,
                scale: rScale !== false ? rScale : 1,
            };
        };

        const target = { opacity: 1, x: 0, y: 0, scale: 1 };
        const initial = getInitial();

        const renderChildren = childrenArray.map((child, i) => {
            if (!React.isValidElement(child)) return child;
            let delay = 0;
            if (!isReducedMotion) {
                if (from === "first") delay = i * interval;
                else if (from === "last") delay = (count - 1 - i) * interval;
                else if (from === "center") delay = Math.abs(i - Math.floor(count / 2)) * interval;
                else if (from === "random") {
                    randomSeed = (randomSeed * 9301 + 49297) % 233280;
                    delay = (randomSeed / 233280) * count * interval;
                }
            }

            const MotionChild = motion.create(Slot);
            return (
                <MotionChild
                    key={child.key || i}
                    initial={initial}
                    animate={shouldAnimate ? target : initial}
                    transition={{ ...springConfig, delay }}
                >
                    {child}
                </MotionChild>
            );
        });

        const Comp = asChild ? Slot : "div";

        return (
            <Comp ref={mergedRef as any} className={className} style={style} {...props}>
                {renderChildren}
            </Comp>
        );
    }
);
Stagger.displayName = "Stagger";
