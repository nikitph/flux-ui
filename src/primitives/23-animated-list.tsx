import React, { forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhysicsPreset, motionScale } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface AnimatedListProps<T> {
    items: T[];
    keyExtractor: (item: T) => string;
    renderItem: (item: T, index: number) => React.ReactNode;
    enterFrom?: "below" | "above" | "left" | "right" | "scale";
    enterDistance?: number;
    stagger?: number;
    layout?: boolean;
    maxRendered?: number;
    reversed?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

function AnimatedListComponent<T>(
    {
        items,
        keyExtractor,
        renderItem,
        enterFrom = "below",
        enterDistance = motionScale.distance.md,
        stagger = motionScale.stagger.fast,
        layout = true,
        maxRendered = Infinity,
        reversed = false,
        physics = "gentle",
        className,
        style,
        disabled = false,
    }: AnimatedListProps<T>,
    ref: React.Ref<HTMLUListElement>
) {
    const isReducedMotion = useReducedMotion();
    const internalRef = React.useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRef(ref, internalRef);
    const springConfig = resolveMotion(physics, undefined, isReducedMotion);

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);

    if (disabled) {
        const renderedItems = reversed ? [...items].reverse() : items;
        return (
            <ul ref={mergedRef} className={className} style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
                {renderedItems.slice(0, maxRendered).map((item, index) => (
                    <li key={keyExtractor(item)} style={{ listStyle: "none" }}>{renderItem(item, index)}</li>
                ))}
            </ul>
        );
    }

    const getVariant = (direction: typeof enterFrom) => {
        switch (direction) {
            case "below": return { y: enterDistance, opacity: 0 };
            case "above": return { y: -enterDistance, opacity: 0 };
            case "left": return { x: -enterDistance, opacity: 0 };
            case "right": return { x: enterDistance, opacity: 0 };
            case "scale": return { scale: 0.8, opacity: 0 };
        }
    };

    const initialVariant = getVariant(enterFrom);

    const renderedItems = reversed ? [...items].reverse() : items;
    const visibleItems = renderedItems.slice(0, maxRendered);

    return (
        <motion.ul
            ref={mergedRef as any}
            className={className}
            style={{ display: "flex", flexDirection: "column", listStyle: "none", margin: 0, padding: 0, ...style }}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {visibleItems.map((item, i) => {
                    const key = keyExtractor(item);
                    return (
                        <motion.li
                            key={key}
                            layout={layout && !isReducedMotion}
                            initial={isReducedMotion ? { opacity: 0 } : initialVariant}
                            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                            exit={isReducedMotion ? { opacity: 0 } : { ...initialVariant, opacity: 0, transition: { duration: 0.2 } }}
                            transition={{
                                ...springConfig,
                                delay: isReducedMotion || hasMounted ? 0 : i * stagger,
                            } as any}
                        >
                            {renderItem(item, i)}
                        </motion.li>
                    );
                })}
            </AnimatePresence>
        </motion.ul>
    );
}

export const AnimatedList = forwardRef(AnimatedListComponent) as <T>(
    props: AnimatedListProps<T> & { ref?: React.Ref<HTMLUListElement> }
) => React.ReactElement;
