import { useScroll, UseScrollOptions } from "motion/react";

export function useScrollProgress(options?: UseScrollOptions) {
    const { scrollYProgress } = useScroll(options);
    return scrollYProgress;
}
