import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface PageTransitionProps {
    children: React.ReactNode;
    mode?: "fade" | "slide" | "morph" | "crossfade" | "none";
    direction?: "left" | "right" | "up" | "down" | "auto";
    physics?: PhysicsPreset;
    exitBeforeEnter?: boolean;
    onTransitionStart?: () => void;
    onTransitionComplete?: () => void;
    className?: string;
    style?: React.CSSProperties;
    layoutId?: string;
    disabled?: boolean;
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
    (
        {
            children,
            mode = "fade",
            direction = "auto",
            physics = "smooth",
            exitBeforeEnter = true,
            onTransitionStart,
            onTransitionComplete,
            className,
            style,
            layoutId,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        if (disabled || isReducedMotion || mode === "none") {
            return (
                <div ref={mergedRef} className={className} style={style} {...props}>
                    {children}
                </div>
            );
        }

        const getVariants = () => {
            const distance = 40;
            switch (mode) {
                case "fade":
                case "crossfade":
                    return {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                    };
                case "slide":
                    const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;
                    const yOffset = direction === "up" ? distance : direction === "down" ? -distance : direction === "auto" ? distance : 0;
                    return {
                        initial: { opacity: 0, x: xOffset, y: yOffset },
                        animate: { opacity: 1, x: 0, y: 0 },
                        exit: { opacity: 0, x: -xOffset, y: -yOffset },
                    };
                case "morph":
                    return {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                    };
            }
        };

        return (
            <AnimatePresence mode={exitBeforeEnter ? "wait" : "popLayout"} onExitComplete={onTransitionComplete}>
                <motion.div
                    key={layoutId || (React.isValidElement(children) ? children.key : "page")}
                    ref={mergedRef}
                    variants={getVariants()}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={springConfig as any}
                    onAnimationStart={onTransitionStart}
                    className={className}
                    style={style}
                    {...props}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    }
);
PageTransition.displayName = "PageTransition";
