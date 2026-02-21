import React, { forwardRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { resolveMotion } from "../utils/resolveMotion";

export interface CountUpProps {
    from?: number;
    to: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    trigger?: "mount" | "viewport" | "manual";
    threshold?: number;
    once?: boolean;
    show?: boolean;
    tag?: "span" | "p" | "div" | "h1" | "h2" | "h3";
    formatFn?: (value: number) => string;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const CountUp = forwardRef<HTMLElement, CountUpProps>(
    (
        {
            from = 0,
            to,
            duration,
            decimals = 0,
            prefix = "",
            suffix = "",
            separator = ",",
            trigger = "viewport",
            threshold = 0.2,
            once = true,
            show = true,
            tag: Tag = "span",
            formatFn,
            physics = "smooth",
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const inView = useInView(internalRef, { amount: threshold, once });

        let shouldAnimate = false;
        if (trigger === "mount") shouldAnimate = true;
        else if (trigger === "viewport") shouldAnimate = inView;
        else if (trigger === "manual") shouldAnimate = show;

        const baseValue = useMotionValue(from);

        // Fall back to tween if specifically asked or reduced motion
        const springConfig = duration
            ? { duration }
            : resolveMotion(physics, undefined, isReducedMotion);

        const animatedValue = useSpring(baseValue, duration ? undefined : springConfig as any);

        useEffect(() => {
            if (shouldAnimate) {
                if (isReducedMotion || disabled) {
                    baseValue.jump(to);
                } else {
                    baseValue.set(to);
                }
            } else {
                baseValue.set(from);
            }
        }, [shouldAnimate, isReducedMotion, disabled, to, from, baseValue]);

        const display = useTransform(animatedValue, (val) => {
            if (formatFn) return formatFn(val);
            const parts = Number(val).toFixed(decimals).split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            return `${prefix}${parts.join(".")}${suffix}`;
        });

        const MotionTag = motion[Tag as keyof typeof motion] as any;

        return (
            <MotionTag ref={mergedRef as any} className={className} style={style} {...props}>
                {display}
            </MotionTag>
        );
    }
);
CountUp.displayName = "CountUp";
