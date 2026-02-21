import React, { forwardRef } from "react";

export interface GridPatternProps {
    size?: number;
    color?: string;
    fade?: boolean;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const GridPattern = forwardRef<HTMLDivElement, GridPatternProps>(
    (
        {
            size = 24,
            color = "currentColor",
            fade = true,
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        if (disabled) return null;

        const baseStyle: React.CSSProperties = {
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M${size} 0H0V${size}' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundSize: `${size}px ${size}px`,
            maskImage: fade ? "radial-gradient(ellipse at center, black 40%, transparent 80%)" : undefined,
            WebkitMaskImage: fade ? "radial-gradient(ellipse at center, black 40%, transparent 80%)" : undefined,
        };

        return (
            <div
                ref={ref}
                className={className}
                style={{ ...baseStyle, ...style }}
                {...props}
            />
        );
    }
);
GridPattern.displayName = "GridPattern";
