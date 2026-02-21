import React, { forwardRef, useEffect, useRef, useState } from "react";
import { motion, useScroll } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMergedRef } from "../hooks/useMergedRef";

export interface StickyScrollProps {
    content: { title: string; description: React.ReactNode; asset?: React.ReactNode }[];
    container?: React.RefObject<HTMLElement | null>;
    physics?: any;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const StickyScroll = forwardRef<HTMLDivElement, StickyScrollProps>(
    (
        {
            content,
            container,
            physics = "gentle",
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
        const [activeSection, setActiveSection] = useState(0);

        const { scrollYProgress } = useScroll({
            target: internalRef,
            container: container?.current ? container : undefined,
            offset: ["start start", "end end"]
        });

        // Only update React state when section actually changes — avoids per-pixel re-renders
        const lastSectionRef = useRef(0);
        useEffect(() => {
            let rafId = 0;
            const unsubscribe = scrollYProgress.on("change", (latest) => {
                const cardsCount = content.length;
                const progressPerCard = 1 / cardsCount;
                const index = Math.min(
                    Math.floor(latest / progressPerCard),
                    cardsCount - 1
                );
                if (index !== lastSectionRef.current) {
                    lastSectionRef.current = index;
                    if (!rafId) {
                        rafId = requestAnimationFrame(() => {
                            rafId = 0;
                            setActiveSection(index);
                        });
                    }
                }
            });
            return () => {
                unsubscribe();
                if (rafId) cancelAnimationFrame(rafId);
            };
        }, [scrollYProgress, content.length]);

        if (disabled || isReducedMotion) {
            return (
                <div ref={mergedRef} className={className} style={{ display: "flex", flexDirection: "column", gap: "2rem", ...style }} {...props}>
                    {content.map((item, i) => (
                        <div key={i}>
                            <h3>{item.title}</h3>
                            <div>{item.description}</div>
                            {item.asset && <div>{item.asset}</div>}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div
                ref={mergedRef}
                className={className}
                style={{
                    display: "flex",
                    position: "relative",
                    minHeight: `${content.length * 100}vh`,
                    ...style
                }}
                {...props}
            >
                <div style={{ flex: 1, padding: "4rem 2rem", position: "relative" }}>
                    {content.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                height: "100vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                opacity: activeSection === index ? 1 : 0.3,
                                transition: "opacity 0.4s ease"
                            }}
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: activeSection === index ? 1 : 0, y: activeSection === index ? 0 : 20 }}
                                style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", willChange: "transform, opacity" }}
                            >
                                {item.title}
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeSection === index ? 1 : 0 }}
                            >
                                {item.description}
                            </motion.div>
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <motion.div
                        layout
                        style={{ width: "80%", height: "60%", background: "var(--flux-border, #f4f4f5)", borderRadius: "1rem", overflow: "hidden" }}
                    >
                        {content[activeSection]?.asset}
                    </motion.div>
                </div>
            </div>
        );
    }
);
StickyScroll.displayName = "StickyScroll";
