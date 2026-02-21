import React, { forwardRef, useEffect, useRef } from "react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
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
        const internalRef = useRef<HTMLSpanElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const textNodeRef = useRef<Text | null>(null);
        const cursorRef = useRef<HTMLSpanElement | null>(null);
        const onCompleteRef = useRef(onComplete);
        onCompleteRef.current = onComplete;

        useEffect(() => {
            const el = internalRef.current;
            if (!el) return;

            if (disabled || isReducedMotion) {
                // Show full text immediately — direct DOM manipulation, no re-render
                if (!textNodeRef.current) {
                    textNodeRef.current = document.createTextNode(text);
                    el.insertBefore(textNodeRef.current, el.firstChild);
                } else {
                    textNodeRef.current.textContent = text;
                }
                if (cursorRef.current) {
                    cursorRef.current.style.display = "none";
                }
                onCompleteRef.current?.();
                return;
            }

            // Initialize text node if needed
            if (!textNodeRef.current) {
                textNodeRef.current = document.createTextNode("");
                el.insertBefore(textNodeRef.current, el.firstChild);
            } else {
                textNodeRef.current.textContent = "";
            }

            // Show cursor
            if (cursorRef.current) {
                cursorRef.current.style.display = "inline-block";
            }

            let i = 0;
            const intervalId = setInterval(() => {
                if (textNodeRef.current) {
                    textNodeRef.current.textContent = text.slice(0, i + 1);
                }
                i++;
                if (i >= text.length) {
                    clearInterval(intervalId);
                    // Hide cursor when complete
                    if (cursorRef.current) {
                        cursorRef.current.style.display = "none";
                    }
                    onCompleteRef.current?.();
                }
            }, speed);

            return () => clearInterval(intervalId);
        }, [text, speed, disabled, isReducedMotion]);

        return (
            <span ref={mergedRef} className={className} style={{ whiteSpace: "pre-wrap", ...style }} {...props}>
                {/* Text node is inserted via DOM manipulation — no React state updates */}
                {cursor && (
                    <span
                        ref={cursorRef}
                        style={{
                            display: "inline-block",
                            marginLeft: "2px",
                            fontWeight: "bold",
                            animation: "flux-cursor-blink 0.8s step-end infinite",
                        }}
                    >
                        {cursorChar}
                    </span>
                )}
                <style>
                    {`@keyframes flux-cursor-blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }`}
                </style>
            </span>
        );
    }
);
StreamingText.displayName = "StreamingText";
