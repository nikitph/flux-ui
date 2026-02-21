import React, { forwardRef, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface AuroraProps {
    colors?: string[];
    speed?: number;
    blur?: number;
    opacity?: number;
    blendMode?: React.CSSProperties["mixBlendMode"];
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Aurora = forwardRef<HTMLDivElement, AuroraProps>(
    (
        {
            colors = ["#99f6e4", "#34d399", "#2dd4bf"],
            speed = 10,
            blur = 60,
            opacity = 0.5,
            blendMode = "normal",
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);

        if (disabled) return null;

        const gradientString = `linear-gradient(-45deg, ${colors.join(", ")})`;

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                    ...style,
                }}
                {...props}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-50%",
                        left: "-50%",
                        width: "200%",
                        height: "200%",
                        opacity,
                        mixBlendMode: blendMode,
                        filter: `blur(${blur}px)`,
                        pointerEvents: "none",
                        zIndex: 0,
                        background: gradientString,
                        backgroundSize: "400% 400%",
                        willChange: "transform",
                        animation: isReducedMotion ? "none" : `flux-aurora ${speed}s ease infinite`,
                    }}
                />
                <style>
                    {`
            @keyframes flux-aurora {
              0% { transform: rotate(0deg) scale(1); background-position: 0% 50%; }
              50% { transform: rotate(180deg) scale(1.05); background-position: 100% 50%; }
              100% { transform: rotate(360deg) scale(1); background-position: 0% 50%; }
            }
          `}
                </style>
            </div>
        );
    }
);
Aurora.displayName = "Aurora";
