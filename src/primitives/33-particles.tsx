import React, { forwardRef, useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface ParticlesProps {
    color?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Particles = forwardRef<HTMLCanvasElement, ParticlesProps>(
    (
        {
            color = "#99f6e4",
            quantity = 100,
            staticity = 50,
            ease = 50,
            className,
            style,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = useRef<HTMLCanvasElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);
        const context = useRef<CanvasRenderingContext2D | null>(null);
        const circles = useRef<any[]>([]);
        const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
        const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
        const animationFrameId = useRef<number>(0);

        useEffect(() => {
            if (disabled || isReducedMotion || !internalRef.current) return;

            const canvas = internalRef.current;
            context.current = canvas.getContext("2d");

            const resizeCanvas = () => {
                if (!internalRef.current || !context.current) return;
                const rect = internalRef.current.parentElement?.getBoundingClientRect() || internalRef.current.getBoundingClientRect();
                canvasSize.current.w = rect.width;
                canvasSize.current.h = rect.height;
                internalRef.current.width = rect.width;
                internalRef.current.height = rect.height;
                initParticles();
            };

            const initParticles = () => {
                circles.current = [];
                for (let i = 0; i < quantity; i++) {
                    circles.current.push(circleParams());
                }
            };

            const circleParams = () => {
                const x = Math.floor(Math.random() * canvasSize.current.w);
                const y = Math.floor(Math.random() * canvasSize.current.h);
                const translateX = 0;
                const translateY = 0;
                const size = Math.floor(Math.random() * 2) + 0.1;
                const alpha = 0;
                const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
                const dx = (Math.random() - 0.5) * 0.2;
                const dy = (Math.random() - 0.5) * 0.2;
                const magnetism = 0.1 + Math.random() * 4;
                return { x, y, translateX, translateY, size, alpha, targetAlpha, dx, dy, magnetism };
            };

            const drawCircle = (circle: any, update = false) => {
                if (!context.current) return;
                const { x, y, translateX, translateY, size, alpha } = circle;
                context.current.translate(translateX, translateY);
                context.current.beginPath();
                context.current.arc(x, y, size, 0, 2 * Math.PI);
                context.current.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
                context.current.fill();
                context.current.setTransform(1, 0, 0, 1, 0, 0);

                if (!update) return;

                circle.alpha += (circle.targetAlpha - circle.alpha) * 0.02;
                circle.x += circle.dx;
                circle.y += circle.dy;
                circle.translateX += ((mouse.current.x / (staticity / circle.magnetism)) - circle.translateX) / ease;
                circle.translateY += ((mouse.current.y / (staticity / circle.magnetism)) - circle.translateY) / ease;

                // Reset if out of bounds (simple wrap)
                if (circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size ||
                    circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size) {
                    Object.assign(circle, circleParams(), { alpha: 0 });
                }
            };

            const animate = () => {
                if (!context.current || !internalRef.current) return;
                context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
                circles.current.forEach(circle => drawCircle(circle, true));
                animationFrameId.current = window.requestAnimationFrame(animate);
            };

            resizeCanvas();
            animate();

            // rAF-throttled mousemove to avoid flooding the mouse ref
            let mouseRafId = 0;
            let latestMouseEvent: MouseEvent | null = null;

            const processMouseMove = () => {
                mouseRafId = 0;
                const e = latestMouseEvent;
                if (!e || !internalRef.current) return;
                const rect = internalRef.current.getBoundingClientRect();
                mouse.current.x = e.clientX - rect.left - canvasSize.current.w / 2;
                mouse.current.y = e.clientY - rect.top - canvasSize.current.h / 2;
            };

            const handleMouseMove = (e: MouseEvent) => {
                latestMouseEvent = e;
                if (!mouseRafId) {
                    mouseRafId = requestAnimationFrame(processMouseMove);
                }
            };

            window.addEventListener("resize", resizeCanvas);
            window.addEventListener("mousemove", handleMouseMove, { passive: true });

            return () => {
                window.removeEventListener("resize", resizeCanvas);
                window.removeEventListener("mousemove", handleMouseMove);
                if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
                if (mouseRafId) cancelAnimationFrame(mouseRafId);
            };
        }, [color, quantity, staticity, ease, disabled, isReducedMotion]);

        if (disabled) return null;

        return (
            <canvas
                ref={mergedRef}
                className={className}
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    ...style,
                }}
                {...props}
            />
        );
    }
);
Particles.displayName = "Particles";
