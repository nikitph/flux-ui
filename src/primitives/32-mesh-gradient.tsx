import React, { forwardRef, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface MeshGradientProps {
    colors?: [string, string, string, string];
    speed?: number;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const MeshGradient = forwardRef<HTMLDivElement, MeshGradientProps>(
    (
        {
            colors = ["#99f6e4", "#fbcfe8", "#fef08a", "#a7f3d0"],
            speed = 15,
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

        const baseStyle: React.CSSProperties = {
            position: "absolute",
            inset: -50, // bleed edge to avoid seeing bounds during rotation
            opacity: 0.8,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
            background: `
        radial-gradient(circle at 100% 0%, ${colors[0]} 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, ${colors[1]} 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, ${colors[2]} 0%, transparent 50%),
        radial-gradient(circle at 0% 0%, ${colors[3]} 0%, transparent 50%)
      `,
            backgroundSize: "200% 200%",
        };

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
                        ...baseStyle,
                        animation: isReducedMotion ? "none" : `flux-mesh ${speed}s ease-in-out infinite alternate`,
                    }}
                />
                <style>
                    {`
            @keyframes flux-mesh {
              0% { background-position: 0% 0%; transform: scale(1) rotate(0deg); }
              50% { background-position: 100% 100%; transform: scale(1.1) rotate(5deg); }
              100% { background-position: 0% 0%; transform: scale(1) rotate(-5deg); }
            }
          `}
                </style>
            </div>
        );
    }
);
MeshGradient.displayName = "MeshGradient";
