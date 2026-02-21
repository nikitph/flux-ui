import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { motionScale, PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { Slot } from "../utils/slot";

// Hoist motion.create(Slot) outside the component to avoid re-creating on every render
const MotionSlot = motion.create(Slot);

export interface PresenceProps {
    children: React.ReactNode;
    enterFrom?: "below" | "above" | "left" | "right" | "scale" | "none";
    exitTo?: "below" | "above" | "left" | "right" | "scale" | "none";
    distance?: number;
    fade?: boolean;
    physics?: PhysicsPreset;
    exitPhysics?: PhysicsPreset;
    mode?: "sync" | "wait" | "popLayout";
    onExitComplete?: () => void;
    disabled?: boolean;
}

export const Presence: React.FC<PresenceProps> = ({
    children,
    enterFrom = "below",
    exitTo,
    distance = motionScale.distance.md,
    fade = true,
    physics = "smooth",
    exitPhysics = "snappy",
    mode = "sync",
    onExitComplete,
    disabled = false,
}) => {
    const isReducedMotion = useReducedMotion();
    const enterSpring = resolveMotion(physics, undefined, isReducedMotion);
    const exitSpring = resolveMotion(exitPhysics, undefined, isReducedMotion);

    if (disabled) {
        return <>{children}</>;
    }

    const effectiveExitTo = exitTo ?? enterFrom;

    const getVariant = (direction: "below" | "above" | "left" | "right" | "scale" | "none", _directionExit = false) => {
        if (isReducedMotion) return { opacity: 0, x: 0, y: 0, scale: 1 };
        switch (direction) {
            case "below": return { opacity: fade ? 0 : 1, y: distance, x: 0, scale: 1 };
            case "above": return { opacity: fade ? 0 : 1, y: -distance, x: 0, scale: 1 };
            case "left": return { opacity: fade ? 0 : 1, y: 0, x: -distance, scale: 1 };
            case "right": return { opacity: fade ? 0 : 1, y: 0, x: distance, scale: 1 };
            case "scale": return { opacity: fade ? 0 : 1, y: 0, x: 0, scale: 0.9 };
            case "none": return { opacity: fade ? 0 : 1, y: 0, x: 0, scale: 1 };
            default: return { opacity: fade ? 0 : 1, y: 0, x: 0, scale: 1 };
        }
    };

    const initial = getVariant(enterFrom);
    const exit = getVariant(effectiveExitTo, true);
    const animate = { opacity: 1, x: 0, y: 0, scale: 1 };

    return (
        <AnimatePresence mode={mode} onExitComplete={onExitComplete}>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return (
                    <MotionSlot
                        key={child.key || Math.random().toString(36)}
                        initial={initial}
                        animate={animate}
                        exit={{ ...exit, transition: exitSpring as any }}
                        transition={enterSpring}
                        style={{ willChange: "transform, opacity" }}
                    >
                        {child}
                    </MotionSlot>
                );
            })}
        </AnimatePresence>
    );
};
