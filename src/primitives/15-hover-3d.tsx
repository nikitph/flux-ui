import React, { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { PhysicsPreset } from "../config/flux.config";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { resolveMotion } from "../utils/resolveMotion";
import { useMergedRef } from "../hooks/useMergedRef";

interface Hover3DContextType {
    mouseX: ReturnType<typeof useSpring> | null;
    mouseY: ReturnType<typeof useSpring> | null;
    maxMovement: number;
    isReducedMotion: boolean | undefined;
}

const Hover3DContext = createContext<Hover3DContextType>({
    mouseX: null,
    mouseY: null,
    maxMovement: 0,
    isReducedMotion: false,
});

export interface Hover3DProps {
    children: React.ReactNode;
    perspective?: number;
    maxMovement?: number;
    layers?: number;
    disableOnTouch?: boolean;
    physics?: PhysicsPreset;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const Hover3DRoot = forwardRef<HTMLDivElement, Hover3DProps>(
    (
        {
            children,
            perspective = 1200,
            maxMovement = 20,
            layers,
            disableOnTouch = true,
            physics = "snappy",
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
        const springConfig = resolveMotion(physics, undefined, isReducedMotion);

        const [isTouchDevice, setIsTouchDevice] = React.useState(false);
        useEffect(() => setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches), []);

        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const mouseX = useSpring(x, isReducedMotion ? { duration: 0 } : springConfig as any);
        const mouseY = useSpring(y, isReducedMotion ? { duration: 0 } : springConfig as any);

        // Cache rect to avoid layout thrashing
        const rectRef = useRef<DOMRect | null>(null);
        const updateRect = useCallback(() => {
            if (internalRef.current) {
                rectRef.current = internalRef.current.getBoundingClientRect();
            }
        }, []);

        useEffect(() => {
            updateRect();
            window.addEventListener("scroll", updateRect, { passive: true });
            window.addEventListener("resize", updateRect, { passive: true });
            return () => {
                window.removeEventListener("scroll", updateRect);
                window.removeEventListener("resize", updateRect);
            };
        }, [updateRect]);

        // rAF-throttled mousemove
        const rafId = useRef<number>(0);
        const latestEvent = useRef<React.MouseEvent<HTMLDivElement> | null>(null);

        const processMouseMove = useCallback(() => {
            rafId.current = 0;
            const e = latestEvent.current;
            if (!e) return;
            const rect = rectRef.current;
            if (!rect) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const offsetX = (e.clientX - centerX) / rect.width;
            const offsetY = (e.clientY - centerY) / rect.height;

            x.set(offsetX * 2);
            y.set(offsetY * 2);
        }, [x, y]);

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (disabled || isReducedMotion || (disableOnTouch && isTouchDevice)) return;
            latestEvent.current = e;
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(processMouseMove);
            }
        }, [disabled, isReducedMotion, disableOnTouch, isTouchDevice, processMouseMove]);

        const handleMouseLeave = useCallback(() => {
            x.set(0);
            y.set(0);
        }, [x, y]);

        // Cleanup rAF on unmount
        useEffect(() => {
            return () => {
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };
        }, []);

        if (disabled) {
            return (
                <div ref={mergedRef} className={className} style={{ position: "relative", ...style }} {...props}>
                    {children}
                </div>
            );
        }

        // Auto-assign depth if layers is not explicitly provided
        const childrenArray = React.Children.toArray(children);
        const numLayers = layers || childrenArray.length;

        const renderedChildren = React.Children.map(childrenArray, (child, index) => {
            if (!React.isValidElement(child)) return child;
            if (child.type === Hover3DLayer || (child.props && (child.props as any).depth !== undefined)) {
                const depth = (child.props as any).depth ?? (numLayers > 1 ? index / (numLayers - 1) : 0);
                return React.cloneElement(child, { depth } as any);
            }
            return child;
        });

        // Memoize context value to prevent unnecessary re-renders of layers
        const contextValue = useMemo(() => ({
            mouseX,
            mouseY,
            maxMovement,
            isReducedMotion,
        }), [mouseX, mouseY, maxMovement, isReducedMotion]);

        return (
            <Hover3DContext.Provider value={contextValue}>
                <div
                    ref={mergedRef}
                    className={className}
                    style={{ perspective: `${perspective}px`, position: "relative", transformStyle: "preserve-3d", ...style }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    {...props}
                >
                    {renderedChildren}
                </div>
            </Hover3DContext.Provider>
        );
    }
);
Hover3DRoot.displayName = "Hover3D";

export interface Hover3DLayerProps {
    children: React.ReactNode;
    depth?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const Hover3DLayer = forwardRef<HTMLDivElement, Hover3DLayerProps>(
    ({ children, depth = 0, className, style, ...props }, ref) => {
        const { mouseX, mouseY, maxMovement, isReducedMotion } = useContext(Hover3DContext);

        // Use useTransform for GPU-composited movement — no .get() calls, no re-renders
        const layerX = useTransform(mouseX ?? useMotionValue(0), (val: number) => val * maxMovement * depth);
        const layerY = useTransform(mouseY ?? useMotionValue(0), (val: number) => val * maxMovement * depth);

        if (isReducedMotion || mouseX === null) {
            return (
                <div ref={ref} className={className} style={{ position: "absolute", inset: 0, ...style }} {...props}>
                    {children}
                </div>
            );
        }

        return (
            <motion.div
                ref={ref}
                className={className}
                style={{
                    position: "absolute",
                    inset: 0,
                    x: layerX,
                    y: layerY,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    ...style,
                }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Hover3DLayer.displayName = "Hover3D.Layer";

export const Hover3D = Object.assign(Hover3DRoot, { Layer: Hover3DLayer });
