import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number | string;
    baseColor?: string;
    highlightColor?: string;
    speed?: number;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    (
        {
            width = "100%",
            height = 20,
            borderRadius = 8,
            baseColor = "var(--flux-border, #e5e7eb)",
            highlightColor = "var(--flux-background, #f9fafb)",
            speed = 1.5,
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

        if (disabled) {
            return (
                <div
                    ref={mergedRef}
                    className={className}
                    style={{ width, height, borderRadius, backgroundColor: baseColor, ...style }}
                    {...props}
                />
            );
        }

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{
                    width,
                    height,
                    borderRadius,
                    backgroundColor: baseColor,
                    overflow: "hidden",
                    position: "relative",
                    ...style,
                }}
                {...props}
            >
                {!isReducedMotion && (
                    <motion.div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)`,
                        }}
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: speed,
                            ease: "linear",
                        }}
                    />
                )}
            </div>
        );
    }
);
Skeleton.displayName = "Skeleton";
