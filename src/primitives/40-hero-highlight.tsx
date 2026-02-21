import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface HeroHighlightProps {
    children: React.ReactNode;
    containerClassName?: string;
    className?: string;
    color?: string;
    disabled?: boolean;
}

export const HeroHighlight = forwardRef<HTMLDivElement, HeroHighlightProps>(
    (
        {
            children,
            containerClassName,
            className,
            color = "45, 212, 191",
            disabled = false,
            ...props
        },
        ref
    ) => {
        const isReducedMotion = useReducedMotion();
        const internalRef = React.useRef<HTMLDivElement>(null);
        const mergedRef = useMergedRef(ref, internalRef);

        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        // Cache rect to avoid layout thrashing on every mousemove
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
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        }, [mouseX, mouseY]);

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            latestEvent.current = e;
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(processMouseMove);
            }
        }, [processMouseMove]);

        useEffect(() => {
            return () => {
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };
        }, []);

        const maskTemplate = useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `;

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={`relative flex items-center justify-center w-full group ${containerClassName || ""}`} {...props}>
                    <div className="absolute inset-0 bg-dot-thick-neutral-300 pointer-events-none" />
                    <div className={className}>{children}</div>
                </div>
            );
        }

        return (
            <div
                ref={mergedRef}
                className={`relative flex items-center justify-center w-full group ${containerClassName || ""}`}
                onMouseMove={handleMouseMove}
                {...props}
            >
                <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none" />
                <motion.div
                    className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 pointer-events-none bg-dot-thick-teal-500"
                    style={{
                        WebkitMaskImage: maskTemplate,
                        maskImage: maskTemplate,
                    }}
                />
                <div className={className}>{children}</div>
            </div>
        );
    }
);
HeroHighlight.displayName = "HeroHighlight";

export const Highlight = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const isReducedMotion = useReducedMotion();
    return (
        <motion.span
            initial={{
                backgroundSize: "0% 100%",
            }}
            animate={{
                backgroundSize: "100% 100%",
            }}
            transition={isReducedMotion ? { duration: 0 } : {
                duration: 2,
                ease: "linear",
                delay: 0.5,
            }}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                display: "inline",
            }}
            className={`relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-teal-300 to-purple-300 ${className || ""}`}
        >
            {children}
        </motion.span>
    );
};
