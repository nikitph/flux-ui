import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface MarqueeProps {
    children: React.ReactNode;
    speed?: number;
    direction?: "left" | "right" | "up" | "down";
    pauseOnHover?: boolean;
    gap?: number;
    gradientWidth?: number;
    gradientColor?: string;
    reverse?: boolean;
    speedOnHover?: number;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
    (
        {
            children,
            speed = 50,
            direction = "left",
            pauseOnHover = true,
            gap = 16,
            gradientWidth = 40,
            gradientColor = "var(--bg, white)",
            reverse = false,
            speedOnHover,
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);

        const [contentSize, setContentSize] = useState(0);
        const [containerSize, setContainerSize] = useState(0);

        const isHorizontal = direction === "left" || direction === "right";
        const dirFactor = direction === "left" || direction === "up" ? -1 : 1;
        const revFactor = reverse ? -1 : 1;
        const calcDir = dirFactor * revFactor;

        useEffect(() => {
            if (disabled || isReducedMotion) return;

            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === containerRef.current) {
                        setContainerSize(isHorizontal ? entry.contentRect.width : entry.contentRect.height);
                    } else if (entry.target === contentRef.current) {
                        setContentSize(isHorizontal ? entry.contentRect.width : entry.contentRect.height);
                    }
                }
            });

            if (containerRef.current) observer.observe(containerRef.current);
            if (contentRef.current) observer.observe(contentRef.current);

            return () => observer.disconnect();
        }, [isHorizontal, disabled, isReducedMotion]);

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={{ display: "flex", flexWrap: "wrap", gap, ...style }} {...props}>
                    {children}
                </div>
            );
        }

        const repeatCount = Math.max(2, Math.ceil((containerSize * 2) / (contentSize + gap)) || 2);
        const duration = (contentSize + gap) / speed;

        const keyframesName = `flux-marquee-${calcDir < 0 ? "negative" : "positive"}-${isHorizontal ? "x" : "y"}`;
        const translateProp = isHorizontal ? "translateX" : "translateY";

        const cssString = `
      @keyframes ${keyframesName} {
        0% { transform: ${translateProp}(${calcDir < 0 ? "0" : `-${contentSize + gap}px`}); }
        100% { transform: ${translateProp}(${calcDir < 0 ? `-${contentSize + gap}px` : "0"}); }
      }
    `;

        const gradientMask = gradientWidth > 0 && isHorizontal
            ? `linear-gradient(to right, transparent, black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), transparent)`
            : gradientWidth > 0 && !isHorizontal
                ? `linear-gradient(to bottom, transparent, black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), transparent)`
                : undefined;

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{
                    ...style,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: isHorizontal ? "row" : "column",
                    maskImage: gradientMask,
                    WebkitMaskImage: gradientMask,
                }}
                {...props}
            >
                <style>{cssString}</style>
                <div
                    ref={containerRef}
                    style={{
                        display: "flex",
                        flexDirection: isHorizontal ? "row" : "column",
                        gap,
                        width: isHorizontal ? "fit-content" : "100%",
                        height: isHorizontal ? "100%" : "fit-content",
                        animation: `${keyframesName} ${duration}s linear infinite`,
                        animationPlayState: "inherit",
                    }}
                    onMouseEnter={(e) => {
                        if (pauseOnHover) e.currentTarget.style.animationPlayState = "paused";
                        else if (speedOnHover) e.currentTarget.style.animationDuration = `${(contentSize + gap) / speedOnHover}s`;
                    }}
                    onMouseLeave={(e) => {
                        if (pauseOnHover) e.currentTarget.style.animationPlayState = "running";
                        else if (speedOnHover) e.currentTarget.style.animationDuration = `${duration}s`;
                    }}
                >
                    {Array.from({ length: repeatCount }).map((_, i) => (
                        <div
                            key={i}
                            ref={i === 0 ? contentRef : null}
                            style={{
                                display: "flex",
                                flexDirection: isHorizontal ? "row" : "column",
                                gap,
                                flexShrink: 0,
                            }}
                        >
                            {children}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);
Marquee.displayName = "Marquee";
