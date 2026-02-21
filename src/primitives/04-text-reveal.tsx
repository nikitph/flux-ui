import React, { forwardRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { resolveMotion } from "../utils/resolveMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { PhysicsPreset } from "../config/flux.config";

export interface TextRevealProps {
    children: string;
    by?: "char" | "word" | "line";
    stagger?: number;
    from?: "below" | "above" | "left" | "right" | "none";
    distance?: number;
    fade?: boolean;
    blur?: number | false;
    trigger?: "mount" | "viewport" | "manual";
    threshold?: number;
    once?: boolean;
    show?: boolean;
    tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const TextReveal = forwardRef<HTMLElement, TextRevealProps>(
    (
        {
            children,
            by = "word",
            stagger,
            from = "below",
            distance,
            fade = true,
            blur = false,
            trigger = "viewport",
            threshold = 0.2,
            once = true,
            show = true,
            tag: Tag = "p",
            physics = "gentle",
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
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        const [hasRevealed, setHasRevealed] = useState(false);

        let shouldAnimate = false;
        if (trigger === "mount") shouldAnimate = true;
        else if (trigger === "viewport") shouldAnimate = inView;
        else if (trigger === "manual") shouldAnimate = show;

        useEffect(() => {
            if (shouldAnimate && !hasRevealed) setHasRevealed(true);
        }, [shouldAnimate, hasRevealed]);

        if (disabled || typeof children !== "string") {
            const Comp = motion[Tag as keyof typeof motion] as any;
            return <Comp ref={mergedRef} className={className} style={style} {...props}>{children}</Comp>;
        }

        const resolvedStagger = stagger ?? (by === "char" ? 0.02 : by === "word" ? 0.04 : 0.08);
        const resolvedDistance = distance ?? (by === "char" ? 8 : 16);

        const getInitial = () => {
            if (isReducedMotion) return { opacity: 0, filter: "blur(0px)" };
            return {
                opacity: fade ? 0 : 1,
                y: from === "below" ? resolvedDistance : from === "above" ? -resolvedDistance : 0,
                x: from === "left" ? -resolvedDistance : from === "right" ? resolvedDistance : 0,
                filter: blur !== false ? `blur(${blur}px)` : "blur(0px)",
            };
        };

        const initial = getInitial();
        const target = { opacity: 1, x: 0, y: 0, filter: "blur(0px)" };

        let tokens: string[] = [];
        if (by === "char") tokens = children.split("");
        else if (by === "word") tokens = children.split(/(\s+)/);
        else if (by === "line") tokens = children.split("\n");

        const MotionTag = motion[Tag as keyof typeof motion] as any;

        return (
            <MotionTag ref={mergedRef as any} className={className} style={style} {...props}>
                {tokens.map((token, i) => {
                    if (by === "char" && token === " ") {
                        return <span key={i}>&nbsp;</span>;
                    }
                    if (by === "word" && token.trim() === "") {
                        return <span key={i}>{token}</span>;
                    }
                    const displayStyle = by === "line" ? "block" : "inline-block";
                    return (
                        <motion.span
                            key={i}
                            style={{ display: displayStyle, whiteSpace: "pre-wrap" }}
                            initial={initial}
                            animate={shouldAnimate ? target : initial}
                            transition={isReducedMotion ? undefined : { ...springConfig, delay: i * resolvedStagger }}
                        >
                            {token}
                        </motion.span>
                    );
                })}
            </MotionTag>
        );
    }
);
TextReveal.displayName = "TextReveal";
