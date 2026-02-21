import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
// resolveMotion unused
import { useMergedRef } from "../hooks/useMergedRef";

const DockContext = React.createContext<{
    mouseX: ReturnType<typeof useMotionValue<number>>;
    mouseY: ReturnType<typeof useMotionValue<number>>;
    distance: number;
    magnification: number;
    direction: "horizontal" | "vertical";
    isReducedMotion: boolean | undefined;
}>({
    mouseX: null as any,
    mouseY: null as any,
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

        const mouseX = useMotionValue(Infinity);
        const mouseY = useMotionValue(Infinity);

        // rAF-throttled mousemove
        const rafId = useRef<number>(0);
        const latestEvent = useRef<{ clientX: number; clientY: number } | null>(null);

        const processMouseMove = useCallback(() => {
            rafId.current = 0;
            const e = latestEvent.current;
            if (!e) return;
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        }, [mouseX, mouseY]);

        const handleMouseMove = useCallback((e: React.MouseEvent) => {
            latestEvent.current = { clientX: e.clientX, clientY: e.clientY };
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(processMouseMove);
            }
        }, [processMouseMove]);

        const handleMouseLeave = useCallback(() => {
            mouseX.set(Infinity);
            mouseY.set(Infinity);
        }, [mouseX, mouseY]);

        // Memoize context value
        const contextValue = useMemo(() => ({
            mouseX,
            mouseY,
            distance,
            magnification,
            direction,
            isReducedMotion: false as boolean | undefined,
        }), [mouseX, mouseY, distance, magnification, direction]);

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={{ display: "flex", flexDirection: direction === "horizontal" ? "row" : "column", gap, ...style }} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <DockContext.Provider value={contextValue}>
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
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
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

        // Cache rect in a ref, update via ResizeObserver for accuracy
        const rectRef = useRef<DOMRect | null>(null);
        React.useEffect(() => {
            const el = itemRef.current;
            if (!el) return;
            const updateRect = () => { rectRef.current = el.getBoundingClientRect(); };
            updateRect();
            const ro = new ResizeObserver(updateRect);
            ro.observe(el);
            window.addEventListener("scroll", updateRect, { passive: true });
            return () => {
                ro.disconnect();
                window.removeEventListener("scroll", updateRect);
            };
        }, []);

        const distanceCalc = useTransform(distVar, (val) => {
            if (val === Infinity) return distance;
            const bounds = rectRef.current;
            if (!bounds) return distance;
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
                    transformOrigin: direction === "horizontal" ? "bottom" : "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    willChange: "transform",
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
