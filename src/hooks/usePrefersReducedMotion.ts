import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQueryList.matches);

        const listener = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQueryList.addEventListener("change", listener);
        return () => mediaQueryList.removeEventListener("change", listener);
    }, []);

    return prefersReducedMotion;
}
