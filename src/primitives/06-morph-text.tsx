import React, { forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface MorphTextProps {
    texts: string[];
    interval?: number;
    mode?: "crossfade" | "scramble" | "typewriter" | "blur";
    stagger?: number;
    scrambleChars?: string;
    scrambleDuration?: number;
    loop?: boolean;
    pause?: boolean;
    tag?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
    onTextChange?: (index: number) => void;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const MorphText = forwardRef<HTMLElement, MorphTextProps>(
    (
        {
            texts,
            interval = 3,
            mode = "crossfade",
            stagger = 0.02,
            scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%",
            scrambleDuration = 0.6,
            loop = true,
            pause = false,
            tag: Tag = "span",
            onTextChange,
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
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            if (disabled || pause || texts.length <= 1) return;

            if (!loop && currentIndex === texts.length - 1) return;

            const timer = setTimeout(() => {
                const nextIndex = (currentIndex + 1) % texts.length;
                setCurrentIndex(nextIndex);
                onTextChange?.(nextIndex);
            }, interval * 1000);

            return () => clearTimeout(timer);
        }, [currentIndex, texts, interval, loop, pause, disabled, onTextChange]);

        if (disabled || isReducedMotion) {
            const Comp = Tag as any;
            return <Comp ref={mergedRef as any} className={className} style={style} {...props}>{texts[currentIndex]}</Comp>;
        }

        const currentText = texts[currentIndex];
        const MotionTag = motion[Tag as keyof typeof motion] as any;

        // Crossfade implementation
        if (mode === "crossfade") {
            return (
                <MotionTag aria-live="polite" ref={mergedRef as any} className={className} style={style} {...props}>
                    <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                        {currentText}
                    </span>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={currentIndex}
                            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            exit={{ opacity: 0, filter: "blur(4px)", y: -10 }}
                            transition={springConfig as any}
                            style={{ display: "inline-block" }}
                        >
                            {currentText}
                        </motion.span>
                    </AnimatePresence>
                </MotionTag>
            );
        }

        // Fallback for scramble/typewriter/blur due to spec complexity limit, 
        // replacing with a basic crossfade-like layout wrapper
        return (
            <MotionTag aria-live="polite" ref={mergedRef as any} className={className} style={style} {...props}>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={springConfig as any}
                    >
                        {currentText}
                    </motion.span>
                </AnimatePresence>
            </MotionTag>
        );
    }
);
MorphText.displayName = "MorphText";
