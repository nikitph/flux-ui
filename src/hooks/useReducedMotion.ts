import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useFluxContext } from "../context/FluxProvider";

export function useReducedMotion(): boolean {
    const { motionLevel } = useFluxContext();
    const prefersReduced = usePrefersReducedMotion();

    if (motionLevel === "none" || motionLevel === "reduced") {
        return true;
    }
    if (motionLevel === "full") {
        return false;
    }

    return prefersReduced;
}
