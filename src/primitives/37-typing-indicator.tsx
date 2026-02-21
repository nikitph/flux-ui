import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface TypingIndicatorProps {
    color?: string;
    size?: number;
    speed?: number;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const TypingIndicator = forwardRef<HTMLDivElement, TypingIndicatorProps>(
    (
        {
            color = "currentColor",
            size = 6,
            speed = 0.6,
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);

        if (disabled) return null;

        const dotStyle = {
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
        };

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{ display: "inline-flex", alignItems: "center", gap: size / 2, ...style }}
                {...props}
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        style={dotStyle}
                        animate={isReducedMotion ? undefined : {
                            y: [0, -size, 0],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: speed,
                            repeat: Infinity,
                            delay: i * (speed / 3),
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        );
    }
);
TypingIndicator.displayName = "TypingIndicator";
