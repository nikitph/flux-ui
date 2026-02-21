import React, { forwardRef } from "react";
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
            color = "45, 212, 191", // teal-400 equivalent typically
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

        function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
            if (!currentTarget) return;
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        }

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
                        WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
                        maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
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
