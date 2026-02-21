import React, { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
// resolveMotion unused
import { useMergedRef } from "../hooks/useMergedRef";

const DockContext = React.createContext<{ mouseX: any; mouseY: any; distance: number; magnification: number; direction: "horizontal" | "vertical"; isReducedMotion: boolean | undefined }>({
    mouseX: null,
    mouseY: null,
    distance: 150,
    magnification: 1.6,
    direction: "horizontal",
    isReducedMotion: false,
});

export interface DockProps {
    children: React.ReactNode;
    magnification?: number;
    distance?: number;
    direction?: "horizontal" | "vertical";
    gap?: number;
    baseSize?: number;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const DockRoot = forwardRef<HTMLDivElement, DockProps>(
    (
        {
            children,
            magnification = 1.6,
            distance = 150,
            direction = "horizontal",
            gap = 8,
            baseSize = 48,
            physics = "bouncy",
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
        // springConfig unused

        const mouseX = useMotionValue(Infinity);
        const mouseY = useMotionValue(Infinity);

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={{ display: "flex", flexDirection: direction === "horizontal" ? "row" : "column", gap, ...style }} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <DockContext.Provider value={{ mouseX, mouseY, distance, magnification, direction, isReducedMotion: false }}>
                <motion.div
                    ref={mergedRef as any}
                    className={className}
                    style={{
                        display: "flex",
                        flexDirection: direction === "horizontal" ? "row" : "column",
                        gap,
                        alignItems: "center",
                        ...style,
                    }}
                    onMouseMove={(e) => {
                        mouseX.set(e.clientX);
                        mouseY.set(e.clientY);
                    }}
                    onMouseLeave={() => {
                        mouseX.set(Infinity);
                        mouseY.set(Infinity);
                    }}
                    {...props}
                >
                    {children}
                </motion.div>
            </DockContext.Provider>
        );
    }
);
DockRoot.displayName = "Dock";

export interface DockItemProps {
    children: React.ReactNode;
    label?: string;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const DockItem = forwardRef<HTMLButtonElement, DockItemProps>(
    ({ children, label, onClick, className, style, ...props }, ref) => {
        const { mouseX, mouseY, distance, magnification, direction, isReducedMotion } = React.useContext(DockContext);
        const itemRef = useRef<HTMLButtonElement>(null);
        const mergedRef = useMergedRef(ref, itemRef);

        const distVar = direction === "horizontal" ? mouseX : mouseY;

        const distanceCalc = useTransform(distVar, (val) => {
            if (val === Infinity || !itemRef.current) return distance; // Max distance if not hovering
            const bounds = itemRef.current.getBoundingClientRect();
            const center = direction === "horizontal" ? bounds.x + bounds.width / 2 : bounds.y + bounds.height / 2;
            return Math.abs((val as number) - center);
        });

        const scaleRaw = useTransform(distanceCalc, [0, distance], [magnification, 1]);
        const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 300, damping: 20 });

        const [isHovered, setIsHovered] = React.useState(false);

        if (isReducedMotion) {
            return (
                <button ref={mergedRef} onClick={onClick} className={className} style={{ ...style, position: "relative" }} {...props}>
                    {children}
                </button>
            );
        }

        return (
            <motion.button
                ref={mergedRef as any}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    scale,
                    transformOrigin: direction === "horizontal" ? "bottom" : "left", // Common dock origin
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    ...style,
                }}
                className={className}
                {...props}
            >
                {children}
                {label && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: direction === "horizontal" ? -10 : 0, x: direction === "horizontal" ? 0 : 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20, mass: 0.5 }}
                        style={{
                            position: "absolute",
                            [direction === "horizontal" ? "top" : "left"]: direction === "horizontal" ? "-120%" : "120%",
                            fontSize: "12px",
                            background: "rgba(0,0,0,0.8)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                        }}
                    >
                        {label}
                    </motion.div>
                )}
            </motion.button>
        );
    }
);
DockItem.displayName = "Dock.Item";

export const Dock = Object.assign(DockRoot, { Item: DockItem });
