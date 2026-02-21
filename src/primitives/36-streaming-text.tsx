import React, { forwardRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
// resolveMotion unused
import { useMergedRef } from "../hooks/useMergedRef";

export interface StreamingTextProps {
    text: string;
    speed?: number; // ms per character roughly
    cursor?: boolean;
    cursorChar?: string;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    onComplete?: () => void;
    disabled?: boolean;
}

export const StreamingText = forwardRef<HTMLSpanElement, StreamingTextProps>(
    (
        {
            text,
            speed = 30,
            cursor = true,
            cursorChar = "▋",
            physics = "gentle",
            className,
            style,
            onComplete,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLSpanElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        // unused for now since streaming text uses simple intervals or tweens

        const [displayedText, setDisplayedText] = useState("");
        const [isComplete, setIsComplete] = useState(false);

        useEffect(() => {
            if (disabled || isReducedMotion) {
                setDisplayedText(text);
                setIsComplete(true);
                onComplete?.();
                return;
            }

            setDisplayedText("");
            setIsComplete(false);

            let i = 0;
            const intervalId = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(intervalId);
                    setIsComplete(true);
                    onComplete?.();
                }
            }, speed);

            return () => clearInterval(intervalId);
        }, [text, speed, disabled, isReducedMotion, onComplete]);

        return (
            <span ref={mergedRef as any} className={className} style={{ whiteSpace: "pre-wrap", ...style }} {...props}>
                {displayedText}
                {cursor && (!isComplete || isReducedMotion === false) && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                        style={{ display: "inline-block", marginLeft: "2px", fontWeight: "bold" }}
                    >
                        {cursorChar}
                    </motion.span>
                )}
            </span>
        );
    }
);
StreamingText.displayName = "StreamingText";
