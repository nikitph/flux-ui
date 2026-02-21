import { physics, PhysicsPreset } from "../config/flux.config";

export function usePhysics(preset: PhysicsPreset = "smooth") {
    return physics[preset] || physics.smooth;
}
