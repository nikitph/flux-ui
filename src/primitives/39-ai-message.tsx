import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface AIMessageProps {
    children: React.ReactNode;
    role?: "user" | "assistant" | "system";
    avatar?: React.ReactNode;
    delay?: number;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const AIMessage = forwardRef<HTMLDivElement, AIMessageProps>(
    (
        {
            children,
            role = "assistant",
            avatar,
            delay = 0,
            physics = "gentle",
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
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        if (disabled) {
            return (
                <div ref={mergedRef} className={className} style={{ display: "flex", gap: 12, ...style }} {...props}>
                    {avatar && <div>{avatar}</div>}
                    <div style={{ flex: 1 }}>{children}</div>
                </div>
            );
        }

        const alignment = role === "user" ? "flex-end" : "flex-start";
        const origin = role === "user" ? "bottom right" : "bottom left";

        return (
            <motion.div
                ref={mergedRef as any}
                className={className}
                initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...springConfig, delay } as any}
                style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: alignment,
                    transformOrigin: origin,
                    ...style,
                }}
                {...props}
            >
                {role !== "user" && avatar && (
                    <motion.div
                        initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springConfig, delay: delay + 0.1 } as any}
                    >
                        {avatar}
                    </motion.div>
                )}
                <div style={{ flex: 1, maxWidth: "80%" }}>
                    {children}
                </div>
                {role === "user" && avatar && (
                    <motion.div
                        initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springConfig, delay: delay + 0.1 } as any}
                    >
                        {avatar}
                    </motion.div>
                )}
            </motion.div>
        );
    }
);
AIMessage.displayName = "AIMessage";
