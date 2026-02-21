import React, { forwardRef } from "react";

export interface NoiseProps {
    opacity?: number;
    blendMode?: React.CSSProperties["mixBlendMode"];
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Noise = forwardRef<HTMLDivElement, NoiseProps>(
    (
        {
            opacity = 0.05,
            blendMode = "overlay",
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        if (disabled) return null;

        // A simple SVG noise pattern encoded as a data URI
        const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

        return (
            <div
                ref={ref}
                className={className}
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 50, // Usually noise sits on top of everything to texture the whole component
                    opacity,
                    mixBlendMode: blendMode,
                    backgroundImage: `url("${noiseSvg}")`,
                    ...style,
                }}
                {...props}
            />
        );
    }
);
Noise.displayName = "Noise";
