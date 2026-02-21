import React, { forwardRef, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";
import { PhysicsPreset } from "../config/flux.config";

export interface ScrollSnapProps {
    children: React.ReactNode;
    axis?: "x" | "y" | "both";
    alignment?: "start" | "center" | "end";
    strictness?: "mandatory" | "proximity";
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const ScrollSnapContainer = forwardRef<HTMLDivElement, ScrollSnapProps>(
    (
        {
            children,
            axis = "y",
            alignment = "center",
            strictness = "mandatory",
            physics = "smooth",
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
        // springConfig unused here but physics passed for API consistency

        // Provide context for children
        return (
            <SnapContext.Provider value={{ alignment, disabled: disabled || isReducedMotion }}>
                <div
                    ref={mergedRef}
                    className={className}
                    style={{
                        ...style,
                        overflowX: axis === "x" || axis === "both" ? "auto" : "hidden",
                        overflowY: axis === "y" || axis === "both" ? "auto" : "hidden",
                        scrollSnapType: disabled || isReducedMotion ? "none" : `${axis} ${strictness}`,
                    }}
                    {...props}
                >
                    {children}
                </div>
            </SnapContext.Provider>
        );
    }
);
ScrollSnapContainer.displayName = "ScrollSnap";

const SnapContext = React.createContext<{ alignment: "start" | "center" | "end"; disabled: boolean }>({ alignment: "center", disabled: false });

export const ScrollSnapItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
    alignment?: "start" | "center" | "end";
    stopHandling?: "normal" | "always";
}>(
    ({ children, alignment: itemAlignment, stopHandling = "normal", className, style, ...props }, ref) => {
        const { alignment: containerAlignment, disabled } = React.useContext(SnapContext);
        const align = itemAlignment || containerAlignment;

        return (
            <div
                ref={ref}
                className={className}
                style={{
                    ...style,
                    scrollSnapAlign: disabled ? "none" : align,
                    scrollSnapStop: disabled ? "normal" : stopHandling,
                }}
                {...props}
            >
                {children}
            </div>
        );
    }
);
ScrollSnapItem.displayName = "ScrollSnap.Item";

export const ScrollSnap = Object.assign(ScrollSnapContainer, { Item: ScrollSnapItem });
