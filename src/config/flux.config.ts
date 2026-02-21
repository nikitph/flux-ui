export type PhysicsPreset = "snappy" | "smooth" | "gentle" | "dramatic" | "bouncy" | "cinematic" | "instant";

export const physics: Record<PhysicsPreset, { type: "spring"; stiffness: number; damping: number; mass: number }> = {
    snappy: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
    smooth: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
    gentle: { type: "spring", stiffness: 120, damping: 14, mass: 1 },
    dramatic: { type: "spring", stiffness: 80, damping: 10, mass: 1.5 },
    bouncy: { type: "spring", stiffness: 400, damping: 15, mass: 1 },
    cinematic: { type: "spring", stiffness: 50, damping: 12, mass: 2 },
    instant: { type: "spring", stiffness: 800, damping: 40, mass: 0.3 },
};

export const motionScale = {
    distance: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64, "2xl": 128 },
    rotation: { xs: 1, sm: 3, md: 6, lg: 12, xl: 24 },
    scale: { xs: 0.98, sm: 0.95, md: 0.90, lg: 0.80 },
    stagger: { fast: 0.03, normal: 0.06, slow: 0.12, cascade: 0.08 },
};
