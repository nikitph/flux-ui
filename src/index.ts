// Config & Context
export * from "./config/flux.config";
export * from "./context/FluxProvider";

// Hooks
export * from "./hooks/usePhysics";
export * from "./hooks/usePrefersReducedMotion";
export * from "./hooks/useReducedMotion";
export * from "./hooks/useIsClient";
export * from "./hooks/useMergedRef";
export * from "./hooks/useInView";
export * from "./hooks/useScrollProgress";
export * from "./hooks/useAnimationBudget";

// Utils
export * from "./utils/resolveMotion";
export * from "./utils/slot";
export * from "./utils/clamp";

// Category A: Entrance & Exit
export * from "./primitives/01-reveal";
export * from "./primitives/02-presence";
export * from "./primitives/03-stagger";
export * from "./primitives/04-text-reveal";
export * from "./primitives/05-count-up";
export * from "./primitives/06-morph-text";
export * from "./primitives/07-flip-card";
export * from "./primitives/08-collapse";

// Category B: Interaction & Gesture
export * from "./primitives/09-magnetic";
export * from "./primitives/10-hover-scale";
export * from "./primitives/11-tilt";
export * from "./primitives/12-drag";
export * from "./primitives/13-swipe";
export * from "./primitives/14-long-press";
export * from "./primitives/15-hover-3d";
export * from "./primitives/16-scroll-velocity";
export * from "./primitives/17-spotlight";
export * from "./primitives/18-follow-cursor";

// Category C: Layout & Transition
export * from "./primitives/19-morph";
export * from "./primitives/20-fluid-layout";
export * from "./primitives/21-reorder";
export * from "./primitives/22-page-transition";
export * from "./primitives/23-animated-list";
export * from "./primitives/24-marquee";
export * from "./primitives/25-dock";
export * from "./primitives/26-infinite-scroll";

// Category D: Scroll-Linked
export * from "./primitives/27-scroll-progress";
export * from "./primitives/28-parallax";
export * from "./primitives/29-sticky-scroll";
export * from "./primitives/30-scroll-snap";

// Category E: Background & Ambient
export * from "./primitives/31-aurora";
export * from "./primitives/32-mesh-gradient";
export * from "./primitives/33-particles";
export * from "./primitives/34-grid-pattern";
export * from "./primitives/35-noise";

// Category F: AI & Streaming
export * from "./primitives/36-streaming-text";
export * from "./primitives/37-typing-indicator";
export * from "./primitives/38-skeleton";
export * from "./primitives/39-ai-message";
export * from "./primitives/40-hero-highlight";
