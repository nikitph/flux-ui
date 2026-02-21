import { physics, PhysicsPreset } from "../config/flux.config";

export function resolveMotion(
    preset: PhysicsPreset | undefined,
    overrideSpring: any,
    isReducedMotion: boolean
) {
    if (isReducedMotion) {
        // Return a linear transition for reduced motion (mostly opacity based fallback)
        return { type: "tween", duration: 0.15, ease: "linear" };
    }

    if (overrideSpring) {
        return overrideSpring;
    }

    const physicsKey = preset || "smooth";
    return physics[physicsKey] || physics.smooth;
}
