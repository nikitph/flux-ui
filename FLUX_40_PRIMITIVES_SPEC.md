# FLUX UI — 40 Motion Primitives: Implementation Specification

## For AI Agent Implementation

**Version:** 1.0.0
**Date:** February 20, 2026

---

## PREAMBLE: Instructions for AI Agent

You are implementing **40 motion primitives** for FLUX UI, a motion-first React component library. Every primitive must follow these rules exactly.

### Global Rules

1. **Framework:** React 19+, TypeScript 5.5+ strict mode.
2. **Animation Engine:** `motion` (Framer Motion v11+). Import from `"motion/react"`.
3. **Styling:** Tailwind CSS v4. All visual styling via className props. Primitives add NO visual styling themselves — they only add motion behavior.
4. **Accessibility:** Every primitive must respect `prefers-reduced-motion`. Use the shared `useReducedMotion()` hook. When reduced motion is active, replace spatial animations (translate, scale, rotate) with opacity-only crossfades (150ms linear). Never disable the primitive entirely — always provide a reduced alternative.
5. **Progressive Enhancement:** Every primitive must render its children even if JavaScript fails. Motion is enhancement, never a gate.
6. **SSR Safe:** No `window`, `document`, or `navigator` access during render. Guard all browser APIs inside `useEffect` or `useLayoutEffect`.
7. **Bundle Size:** Each primitive must be < 3KB gzipped (excluding the `motion` peer dependency).
8. **Ref Forwarding:** Every primitive must forward refs via `React.forwardRef`.
9. **Composition:** Primitives must compose. Wrapping `<Magnetic>` around `<Reveal>` around a `<button>` must work. Use `React.Children` sparingly; prefer render props or `asChild` pattern (Radix-style slot merging).
10. **Physics Config:** All spring animations consume physics presets from the shared `flux.config.ts` via the `usePhysics(presetName)` hook. Never hardcode stiffness/damping/mass values.

### Shared Infrastructure (Implement First)

Before building any primitive, implement these shared modules:

```
src/
├── config/
│   └── flux.config.ts          # Physics presets, motion scales, stagger intervals
├── hooks/
│   ├── usePhysics.ts           # Returns spring config by preset name
│   ├── useReducedMotion.ts     # Boolean hook for prefers-reduced-motion
│   ├── useInView.ts            # IntersectionObserver wrapper
│   ├── useScrollProgress.ts    # Scroll position as 0→1 for a target element
│   ├── usePrefersReducedMotion.ts  # Raw media query listener
│   ├── useIsClient.ts          # SSR guard (returns false on server)
│   ├── useMergedRef.ts         # Merge forwarded ref + internal ref
│   └── useAnimationBudget.ts   # Register/deregister active animations
├── utils/
│   ├── resolveMotion.ts        # Merges default + override + reduced motion
│   ├── slot.ts                 # asChild slot merging utility (Radix pattern)
│   └── clamp.ts                # Math utility
├── context/
│   └── FluxProvider.tsx        # Global context: physics config, motion level, budget
└── primitives/
    ├── 01-reveal.tsx
    ├── 02-presence.tsx
    ├── ...
    └── 40-motion-value-text.tsx
```

### flux.config.ts (Reference Implementation)

```typescript
export type PhysicsPreset = "snappy" | "smooth" | "gentle" | "dramatic" | "bouncy" | "cinematic" | "instant";

export const physics: Record<PhysicsPreset, { type: "spring"; stiffness: number; damping: number; mass: number }> = {
  snappy:    { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
  smooth:    { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  gentle:    { type: "spring", stiffness: 120, damping: 14, mass: 1 },
  dramatic:  { type: "spring", stiffness: 80,  damping: 10, mass: 1.5 },
  bouncy:    { type: "spring", stiffness: 400, damping: 15, mass: 1 },
  cinematic: { type: "spring", stiffness: 50,  damping: 12, mass: 2 },
  instant:   { type: "spring", stiffness: 800, damping: 40, mass: 0.3 },
};

export const motionScale = {
  distance: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64, "2xl": 128 },
  rotation: { xs: 1, sm: 3, md: 6, lg: 12, xl: 24 },
  scale:    { xs: 0.98, sm: 0.95, md: 0.90, lg: 0.80 },
  stagger:  { fast: 0.03, normal: 0.06, slow: 0.12, cascade: 0.08 },
};
```

### Prop Conventions

All primitives share these base props:

```typescript
interface FluxPrimitiveProps {
  children: React.ReactNode;
  physics?: PhysicsPreset;        // Default varies per primitive
  disabled?: boolean;              // Completely disables animation (renders children statically)
  className?: string;              // Applied to the wrapper motion.div
  style?: React.CSSProperties;
  asChild?: boolean;               // Merge motion props onto the direct child instead of wrapping in div
}
```

---

## THE 40 PRIMITIVES

---

### CATEGORY A: ENTRANCE & EXIT (Primitives 1–8)

---

#### Primitive 01: `<Reveal>`

**Purpose:** Animate children into view. The most commonly used primitive. Triggers on mount, viewport entry, or manual control.

**Default Physics:** `"gentle"`

**Props:**
```typescript
interface RevealProps extends FluxPrimitiveProps {
  from?: "below" | "above" | "left" | "right" | "none";  // Direction of entry. Default: "below"
  distance?: number;         // Pixels to travel. Default: motionScale.distance.md (16)
  fade?: boolean;            // Also animate opacity 0→1. Default: true
  scale?: number | false;    // Starting scale. false = no scale animation. Default: false
  rotate?: number | false;   // Starting rotation in degrees. Default: false
  trigger?: "mount" | "viewport" | "manual";  // Default: "viewport"
  threshold?: number;        // IntersectionObserver threshold (0-1). Default: 0.2
  once?: boolean;            // Only animate once. Default: true
  delay?: number;            // Seconds. Default: 0
  show?: boolean;            // For trigger="manual". Default: true
  onReveal?: () => void;     // Callback when animation starts
}
```

**Behavior:**
- `trigger="mount"`: Animate immediately on React mount.
- `trigger="viewport"`: Use IntersectionObserver. When element enters viewport by `threshold`, animate from initial state to final state.
- `trigger="manual"`: Controlled by `show` prop. When `show` transitions false→true, animate in. When true→false, animate out (reverse direction).
- `once=true`: After first reveal, remove observer and keep element visible.
- `once=false`: Element animates out when leaving viewport and re-animates on re-entry.

**Initial state (before reveal):**
```typescript
{
  opacity: fade ? 0 : 1,
  x: from === "left" ? -distance : from === "right" ? distance : 0,
  y: from === "below" ? distance : from === "above" ? -distance : 0,
  scale: scale !== false ? scale : 1,
  rotate: rotate !== false ? rotate : 0,
}
```

**Final state (after reveal):**
```typescript
{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
```

**Reduced Motion:** Instant opacity 0→1 over 150ms, no spatial movement.

**Implementation Notes:**
- Wrap children in `<motion.div>` (or merge via asChild).
- Use `useInView` hook for viewport trigger.
- Use `usePhysics(physics)` for spring config.
- Set `initial`, `animate`, and `transition` on the motion.div.
- For `trigger="viewport"`, set `initial` state and only set `animate` state when `inView` becomes true.

---

#### Primitive 02: `<Presence>`

**Purpose:** AnimatePresence wrapper that handles enter/exit animations for conditionally rendered elements. Ensures exit animations complete before unmount.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface PresenceProps {
  children: React.ReactNode;      // Must be conditionally rendered elements with `key`
  enterFrom?: "below" | "above" | "left" | "right" | "scale" | "none"; // Default: "below"
  exitTo?: "below" | "above" | "left" | "right" | "scale" | "none";   // Default: same as enterFrom
  distance?: number;              // Default: motionScale.distance.md
  fade?: boolean;                 // Default: true
  physics?: PhysicsPreset;
  exitPhysics?: PhysicsPreset;    // Separate spring for exit. Default: "snappy"
  mode?: "sync" | "wait" | "popLayout";  // AnimatePresence mode. Default: "sync"
  onExitComplete?: () => void;
}
```

**Behavior:**
- Wraps `motion`'s `AnimatePresence`.
- Children must have `key` props. When a keyed child is removed from the tree, it animates out before being unmounted.
- `mode="wait"`: New element waits for old to exit. `mode="sync"`: Both animate simultaneously. `mode="popLayout"`: Exiting element is popped from layout flow.
- Each child gets `initial`, `animate`, and `exit` props injected.

**Implementation Notes:**
- This is a wrapper, not a motion.div itself.
- It renders `<AnimatePresence mode={mode} onExitComplete={onExitComplete}>` and clones children to inject motion props.
- Each child should be wrapped in a `<motion.div>` with the enter/exit variants.

---

#### Primitive 03: `<Stagger>`

**Purpose:** Animate children sequentially with configurable delay between each.

**Default Physics:** `"gentle"`

**Props:**
```typescript
interface StaggerProps extends FluxPrimitiveProps {
  interval?: number;          // Seconds between each child. Default: motionScale.stagger.normal (0.06)
  from?: "first" | "last" | "center" | "random";  // Stagger origin. Default: "first"
  reveal?: {                  // Each child's individual animation
    from?: "below" | "above" | "left" | "right" | "none";
    distance?: number;
    fade?: boolean;
    scale?: number | false;
  };
  trigger?: "mount" | "viewport" | "manual";  // Default: "viewport"
  threshold?: number;         // Default: 0.1
  once?: boolean;             // Default: true
  show?: boolean;             // For manual trigger
}
```

**Behavior:**
- Iterates over `React.Children`. For each child at index `i`, calculates a delay based on `from` strategy:
  - `"first"`: delay = `i * interval`
  - `"last"`: delay = `(count - 1 - i) * interval`
  - `"center"`: delay = `Math.abs(i - Math.floor(count / 2)) * interval`
  - `"random"`: delay = `Math.random() * count * interval` (seeded per-render to avoid layout shift)
- Each child is wrapped in a `<motion.div>` with the reveal animation and computed delay.

**Reduced Motion:** All children appear simultaneously with opacity 0→1 over 150ms. No stagger.

**Implementation Notes:**
- Use `React.Children.map` to wrap each child.
- Each wrapper gets `transition={{ ...springConfig, delay: computedDelay }}`.
- For viewport trigger, use a single IntersectionObserver on the parent container. When parent enters viewport, trigger all children's animations (with stagger delays).

---

#### Primitive 04: `<TextReveal>`

**Purpose:** Split text into characters, words, or lines and animate each segment with staggered entrance.

**Default Physics:** `"gentle"`

**Props:**
```typescript
interface TextRevealProps extends FluxPrimitiveProps {
  by?: "char" | "word" | "line";   // Tokenization strategy. Default: "word"
  stagger?: number;                 // Seconds between tokens. Default: by === "char" ? 0.02 : by === "word" ? 0.04 : 0.08
  from?: "below" | "above" | "left" | "right" | "none"; // Default: "below"
  distance?: number;                // Default: by === "char" ? 8 : 16
  fade?: boolean;                   // Default: true
  blur?: number | false;            // Starting blur in pixels. Default: false
  trigger?: "mount" | "viewport" | "manual";
  threshold?: number;
  once?: boolean;
  show?: boolean;
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";  // Default: "p"
  children: string;                 // Must be a string
}
```

**Behavior:**
- Tokenizes the string `children` based on `by`:
  - `"char"`: Split into individual characters. Preserve spaces as non-animated spacer elements.
  - `"word"`: Split by whitespace. Each word is one animated unit.
  - `"line"`: Split by `\n`. Each line is one unit.
- Each token is rendered inside a `<motion.span>` with inline-block display.
- Stagger delay is applied per token.
- The container is the semantic `tag` element.

**Initial state per token:**
```typescript
{
  opacity: fade ? 0 : 1,
  y: from === "below" ? distance : from === "above" ? -distance : 0,
  x: from === "left" ? -distance : from === "right" ? distance : 0,
  filter: blur !== false ? `blur(${blur}px)` : undefined,
}
```

**Reduced Motion:** All text appears instantly. No tokenization or stagger.

**Implementation Notes:**
- Wrap the entire output in the chosen `tag` via `motion[tag]`.
- Each token: `<motion.span style={{ display: "inline-block" }}>`.
- For `by="char"`, spaces must be `<span>&nbsp;</span>` (non-animated) to preserve word spacing.
- For `by="line"`, each line is `<motion.span style={{ display: "block" }}>`.

---

#### Primitive 05: `<CountUp>`

**Purpose:** Animate a number from a start value to an end value with spring physics.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface CountUpProps extends FluxPrimitiveProps {
  from?: number;              // Default: 0
  to: number;                 // Required. Target number.
  duration?: number;          // Override spring with duration-based. Default: undefined (use spring)
  decimals?: number;          // Decimal places. Default: 0
  prefix?: string;            // E.g., "$". Default: ""
  suffix?: string;            // E.g., "%". Default: ""
  separator?: string;         // Thousands separator. Default: ","
  trigger?: "mount" | "viewport" | "manual";
  threshold?: number;
  once?: boolean;
  show?: boolean;
  tag?: "span" | "p" | "div" | "h1" | "h2" | "h3";  // Default: "span"
  formatFn?: (value: number) => string;  // Custom formatter. Overrides decimals/prefix/suffix/separator.
}
```

**Behavior:**
- Uses `motion`'s `useSpring` or `useMotionValue` + `useTransform` to animate a number.
- On trigger, animate the motion value from `from` to `to`.
- On each frame, format the current value and render it.
- Default formatting: `${prefix}${numberWithSeparator}${suffix}` with specified decimal places.

**Reduced Motion:** Instantly display the `to` value with no animation.

**Implementation Notes:**
- Create a `MotionValue` initialized to `from`.
- Use `useSpring(motionValue, springConfig)` for physics-based interpolation.
- Use `useMotionValueEvent` or `useTransform` to derive the display string.
- Render the string inside a `<motion[tag]>`.

---

#### Primitive 06: `<MorphText>`

**Purpose:** Morphs text from one string to another using character-level crossfade with optional scramble effect.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface MorphTextProps extends FluxPrimitiveProps {
  texts: string[];             // Array of strings to cycle through
  interval?: number;           // Seconds between text changes. Default: 3
  mode?: "crossfade" | "scramble" | "typewriter" | "blur";  // Default: "crossfade"
  stagger?: number;            // Delay between characters. Default: 0.02
  scrambleChars?: string;      // Characters used during scramble. Default: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
  scrambleDuration?: number;   // How long each char scrambles before settling. Default: 0.6 seconds
  loop?: boolean;              // Default: true
  pause?: boolean;             // Pause cycling. Default: false
  tag?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";  // Default: "span"
  onTextChange?: (index: number) => void;
}
```

**Behavior:**
- Cycles through `texts` array at `interval` pace.
- On change, animates character by character from old text to new text.
- `"crossfade"`: Old character fades out, new fades in. If texts are different lengths, extra characters fade in/out.
- `"scramble"`: Each character cycles through random `scrambleChars` before settling on the correct character. Characters settle left to right with stagger.
- `"typewriter"`: Old text deletes char by char (right to left), then new text types in (left to right).
- `"blur"`: Each character blurs out, changes, then blurs back in.

**Reduced Motion:** Instantly swap text. No character animation.

**Implementation Notes:**
- Maintain current and target text in state.
- For each character position, render a `<motion.span>` with `style={{ display: "inline-block", whiteSpace: "pre" }}`.
- For `"scramble"`: Use `requestAnimationFrame` loop to update display characters. After `scrambleDuration`, settle to the real character from left to right with stagger.
- For `"typewriter"`: Chain two animations — deletion then insertion.
- Container must have `aria-live="polite"` and a visually hidden `<span>` with the full current text for screen readers.

---

#### Primitive 07: `<FlipCard>`

**Purpose:** 3D card flip between front and back faces.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface FlipCardProps extends FluxPrimitiveProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped?: boolean;           // Controlled flip state. Default: false
  direction?: "horizontal" | "vertical";  // Flip axis. Default: "horizontal"
  trigger?: "click" | "hover" | "manual";  // Default: "click"
  perspective?: number;        // CSS perspective in px. Default: 1000
  height?: string | number;    // Container height. Required for proper 3D.
  width?: string | number;     // Container width. Default: "100%"
}
```

**Behavior:**
- Renders a container with `perspective` CSS, containing two absolutely positioned faces.
- Front face: `rotateY(0deg)` (or `rotateX` for vertical). Back face: `rotateY(180deg)`.
- On flip: front animates to `rotateY(180deg)`, back animates to `rotateY(360deg)`.
- Both faces have `backface-visibility: hidden`.

**Reduced Motion:** Instant crossfade (opacity) between front and back. No 3D rotation.

---

#### Primitive 08: `<Collapse>`

**Purpose:** Smooth height animation for expanding/collapsing content. Solves the classic "animate to auto height" problem.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface CollapseProps extends FluxPrimitiveProps {
  open: boolean;               // Controlled open state. Required.
  initialHeight?: number;      // Starting height when collapsed. Default: 0
  fade?: boolean;              // Also fade content. Default: true
  overflow?: "hidden" | "visible";  // During animation. Default: "hidden"
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
}
```

**Behavior:**
- When `open` transitions false→true: measure the content's natural height using a hidden measurement div, then animate `height` from `initialHeight` to measured height. After animation completes, set `height: "auto"` to allow dynamic content changes.
- When `open` transitions true→false: capture current height, then animate from current height to `initialHeight`.
- During animation, `overflow` is set to the configured value.

**Implementation Notes:**
- Use a `ResizeObserver` on the content to get the natural height.
- Use `motion.div` with `animate={{ height }}` and the spring config.
- Critical: after open animation completes, switch from animated pixel height to `height: "auto"` so content can grow/shrink naturally while open.
- On close, first capture `getBoundingClientRect().height`, set that as the initial value, then animate to `initialHeight`.

**Reduced Motion:** Instant show/hide. No height animation. Opacity toggle over 150ms.

---

### CATEGORY B: INTERACTION & GESTURE (Primitives 9–18)

---

#### Primitive 09: `<Magnetic>`

**Purpose:** Element subtly follows the cursor when the cursor is within a specified radius. Creates a "pull" effect.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface MagneticProps extends FluxPrimitiveProps {
  strength?: number;           // 0-1. How much the element follows the cursor. Default: 0.3
  radius?: number;             // Activation radius in pixels from element center. Default: 150
  maxDisplacement?: number;    // Max pixels the element can move. Default: 20
  spring?: PhysicsPreset;      // Override for the return-to-center spring. Default: "snappy"
  disableOnTouch?: boolean;    // Disable on touch devices. Default: true
}
```

**Behavior:**
- On `mousemove` within `radius` of the element's center:
  - Calculate distance from cursor to element center.
  - Calculate displacement: `(cursorPos - centerPos) * strength`, clamped to `maxDisplacement`.
  - Apply `transform: translate(dx, dy)` via motion values.
- On `mouseleave` or cursor exits radius: spring back to `(0, 0)`.
- On touch devices (detected via `pointer: coarse` media query or touch events): disable displacement if `disableOnTouch` is true.

**Implementation Notes:**
- Use two `MotionValue`s for x and y.
- Attach `onMouseMove` and `onMouseLeave` to the wrapper.
- Use `useSpring` on each motion value for the return animation.
- Calculate element center via `getBoundingClientRect()` on mount and on scroll (debounced).
- Throttle `mousemove` handler to every animation frame.

**Reduced Motion:** Disable entirely. Element is static.

---

#### Primitive 10: `<HoverScale>`

**Purpose:** Simple scale-on-hover with press feedback. The most common button/card interaction.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface HoverScaleProps extends FluxPrimitiveProps {
  hoverScale?: number;         // Default: 1.03
  pressScale?: number;         // Scale while mouse is held down. Default: 0.97
  hoverRotate?: number;        // Degrees of rotation on hover. Default: 0
  liftShadow?: boolean;        // Add elevation shadow on hover. Default: false
  shadowColor?: string;        // Default: "rgba(0,0,0,0.15)"
}
```

**Behavior:**
- `whileHover`: `{ scale: hoverScale, rotate: hoverRotate, boxShadow: liftShadow ? "0 10px 30px ..." : undefined }`
- `whileTap`: `{ scale: pressScale }`
- Both use the physics spring config.

**Reduced Motion:** No scale. Opacity change on hover (0.8→1 on hover). Press: opacity 0.6.

---

#### Primitive 11: `<Tilt>`

**Purpose:** 3D perspective tilt that follows cursor position over the element. Like the Apple TV card effect.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface TiltProps extends FluxPrimitiveProps {
  maxTilt?: number;            // Max tilt degrees. Default: 15
  perspective?: number;        // CSS perspective. Default: 1000
  scale?: number;              // Scale on hover. Default: 1.02
  glare?: boolean;             // Add a glare overlay that follows cursor. Default: false
  glareOpacity?: number;       // Max glare opacity. Default: 0.15
  glareColor?: string;         // Default: "white"
  reverse?: boolean;           // Invert tilt direction. Default: false
  resetOnLeave?: boolean;      // Spring back to flat on mouse leave. Default: true
  disableOnTouch?: boolean;    // Default: true
  axis?: "both" | "x" | "y";  // Constrain tilt axis. Default: "both"
}
```

**Behavior:**
- On `mousemove` over the element:
  - Calculate cursor position relative to element center as percentages (-0.5 to 0.5).
  - Convert to rotation: `rotateX = -(cursorY - 0.5) * maxTilt * 2`, `rotateY = (cursorX - 0.5) * maxTilt * 2`. (Negating Y creates natural "physical card" feel — cursor pushes the near edge down.)
  - If `reverse`, invert signs.
  - If `axis="x"`, rotateY = 0. If `axis="y"`, rotateX = 0.
  - Apply via spring-animated motion values.
- If `glare`: render an absolutely positioned gradient overlay. The gradient's center follows the cursor position.
- On `mouseleave` and `resetOnLeave`: spring all values back to 0.

**Implementation Notes:**
- Container needs `style={{ perspective }}` and `transformStyle: "preserve-3d"`.
- Use MotionValues for rotateX, rotateY, and glare position.
- Glare is a `<motion.div>` with `background: radial-gradient(circle at ${x}% ${y}%, ${glareColor}, transparent)`.

**Reduced Motion:** No tilt or glare. Optionally apply subtle opacity change on hover.

---

#### Primitive 12: `<Drag>`

**Purpose:** Make any element draggable with spring-back, axis locking, and constraints.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface DragProps extends FluxPrimitiveProps {
  axis?: "x" | "y" | "both";  // Default: "both"
  constraints?: {              // Pixel constraints relative to initial position
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  } | React.RefObject<HTMLElement>;  // Or a ref to a bounding element
  snapBack?: boolean;          // Spring back to origin on release. Default: false
  snapPoints?: Array<{ x: number; y: number }>;  // Snap to nearest point on release
  snapThreshold?: number;      // Distance in px to trigger snap. Default: 50
  dragElastic?: number;        // 0-1. Rubberband effect at constraints. Default: 0.2
  onDragStart?: (event: PointerEvent, info: PanInfo) => void;
  onDrag?: (event: PointerEvent, info: PanInfo) => void;
  onDragEnd?: (event: PointerEvent, info: PanInfo) => void;
  cursor?: "grab" | "move" | "default";  // Default: "grab"
  handle?: React.RefObject<HTMLElement>;  // Only this sub-element initiates drag
}
```

**Behavior:**
- Uses `motion.div` with `drag={axis === "both" ? true : axis}`.
- `dragConstraints`, `dragElastic`, `dragSnapToOrigin` map directly to motion props.
- `snapPoints`: On drag end, calculate the nearest snap point. If within `snapThreshold`, animate to that point. Otherwise, if `snapBack`, return to origin.
- Cursor changes to `grabbing` while actively dragging.
- If `handle` is provided, only pointer events starting on the handle initiate drag.

**Reduced Motion:** Dragging still works (it's user-initiated). But snap animations use instant transitions instead of springs.

---

#### Primitive 13: `<Swipe>`

**Purpose:** Swipe-to-dismiss or swipe-to-action. Commonly used for cards, notifications, list items.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface SwipeProps extends FluxPrimitiveProps {
  direction?: "left" | "right" | "up" | "down" | "horizontal" | "vertical" | "any"; // Default: "horizontal"
  threshold?: number;          // Percentage of element width/height to trigger dismiss. Default: 0.4
  velocityThreshold?: number;  // Px/s. If swipe velocity exceeds this, dismiss regardless of distance. Default: 500
  rubberBand?: boolean;        // Rubberband effect when swiping in non-dismissable direction. Default: true
  rubberBandFactor?: number;   // 0-1. Default: 0.2
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
  onSwipeStart?: (direction: "left" | "right" | "up" | "down") => void;
  renderBackground?: (direction: "left" | "right", progress: number) => React.ReactNode; // Revealed behind swiped element
  snapBack?: boolean;          // Return to origin if below threshold. Default: true
  exitAnimation?: boolean;     // Animate off-screen on dismiss. Default: true
}
```

**Behavior:**
- Element is draggable on the configured axis.
- While dragging, calculate swipe progress as percentage of element dimension.
- If `renderBackground`, render the background node behind the element, passing current direction and progress (0-1).
- On release: if distance > `threshold * elementDimension` OR velocity > `velocityThreshold`, fire `onSwipe` and (if `exitAnimation`) animate the element off-screen in the swipe direction.
- Otherwise, spring back to origin.

**Reduced Motion:** Swipe still functions (user-initiated), but exit uses opacity fade instead of spatial movement.

---

#### Primitive 14: `<LongPress>`

**Purpose:** Detect and visualize long-press interactions with a filling progress indicator.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface LongPressProps extends FluxPrimitiveProps {
  duration?: number;           // Seconds to hold. Default: 0.8
  onLongPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  feedback?: "ring" | "fill" | "scale" | "none";  // Visual feedback type. Default: "ring"
  feedbackColor?: string;      // Default: "currentColor"
  cancelOnMove?: boolean;      // Cancel if pointer moves > 10px. Default: true
  haptic?: boolean;            // Trigger navigator.vibrate on complete. Default: false
}
```

**Behavior:**
- On `pointerdown`: start a timer. Begin visual feedback animation.
- `"ring"`: An SVG circle stroke that fills clockwise over `duration` using a motion-animated `strokeDashoffset`.
- `"fill"`: A background color fill (left to right) using `scaleX` animation.
- `"scale"`: Element slowly scales to 0.95 over the duration.
- On timer complete: fire `onLongPress`. If `haptic` and `navigator.vibrate` exists, vibrate 50ms.
- On `pointerup` before complete: cancel. Spring feedback animation back to start.
- On pointer move > 10px (if `cancelOnMove`): cancel.

**Reduced Motion:** No visual feedback animation. Still fires `onLongPress` after duration.

---

#### Primitive 15: `<Hover3D>`

**Purpose:** Multi-layer parallax hover effect. Children at different "depths" move at different rates relative to cursor, creating 3D depth.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface Hover3DProps extends FluxPrimitiveProps {
  perspective?: number;        // Default: 1200
  maxMovement?: number;        // Max px movement for deepest layer. Default: 20
  layers?: number;             // How many depth layers. Default: auto-detected from children
  disableOnTouch?: boolean;    // Default: true
}

// Children use this wrapper to declare their depth
interface Hover3DLayerProps {
  children: React.ReactNode;
  depth?: number;              // 0 = no movement (background), 1 = max movement (foreground). Default: auto
}
```

**Usage Example:**
```tsx
<Hover3D maxMovement={20}>
  <Hover3D.Layer depth={0}><BackgroundImage /></Hover3D.Layer>
  <Hover3D.Layer depth={0.5}><ContentCard /></Hover3D.Layer>
  <Hover3D.Layer depth={1}><FloatingBadge /></Hover3D.Layer>
</Hover3D>
```

**Behavior:**
- Track cursor position relative to element center.
- Each layer moves by `(cursorOffset / elementDimension) * maxMovement * depth`.
- Depth 0 = static. Depth 1 = moves the most.
- If `layers` not specified, auto-assign depth evenly: first child = 0, last child = 1.

**Reduced Motion:** No movement. Static layout.

---

#### Primitive 16: `<ScrollVelocity>`

**Purpose:** Applies a visual effect that intensifies based on scroll speed. Commonly used for text marquees that speed up/slow down, or elements that stretch/blur during fast scroll.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface ScrollVelocityProps extends FluxPrimitiveProps {
  effect?: "speed" | "blur" | "stretch" | "skew" | "opacity";  // Default: "speed"
  sensitivity?: number;        // Multiplier for velocity effect. Default: 1
  maxEffect?: number;          // Clamp the max effect value. Default: varies by effect
  direction?: "x" | "y";      // Scroll axis to monitor. Default: "y"
  smoothing?: number;          // 0-1. How much to smooth velocity readings. Default: 0.5
}
```

**Behavior:**
- Use `useScroll` from motion to get scroll velocity.
- Smooth the velocity value using exponential moving average.
- Map velocity to the chosen effect:
  - `"speed"`: Pass velocity as a CSS custom property `--scroll-velocity` on the element (for user CSS consumption) and also as a child render prop.
  - `"blur"`: Apply `filter: blur(velocity * sensitivity px)`, clamped to maxEffect (default 10).
  - `"stretch"`: Apply `scaleY(1 + velocity * sensitivity * 0.001)`, clamped.
  - `"skew"`: Apply `skewY(velocity * sensitivity * 0.1 deg)`, clamped to maxEffect (default 15).
  - `"opacity"`: Reduce opacity as velocity increases.

**Reduced Motion:** No effect applied. Element renders normally.

---

#### Primitive 17: `<Spotlight>`

**Purpose:** A radial gradient "spotlight" that follows the cursor over an element, revealing content or creating a glow effect.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface SpotlightProps extends FluxPrimitiveProps {
  size?: number;               // Spotlight radius in px. Default: 200
  color?: string;              // Spotlight color. Default: "rgba(255,255,255,0.1)"
  borderColor?: string;        // Optional border glow color. Default: undefined
  opacity?: number;            // Max spotlight opacity. Default: 0.15
  blur?: number;               // Spotlight blur. Default: 40
  mode?: "glow" | "reveal" | "border";  // Default: "glow"
  disableOnTouch?: boolean;    // Default: true
}
```

**Behavior:**
- Track cursor position relative to the element.
- `"glow"`: Render a `radial-gradient` overlay centered at cursor position. The gradient is `color` at center, transparent at `size` radius.
- `"reveal"`: Element has a dark overlay by default. The spotlight "reveals" the content beneath by masking the overlay. Uses `mask-image: radial-gradient(circle at x y, black, transparent)`.
- `"border"`: Apply a gradient border using `background: radial-gradient(...)` on a pseudo-element behind the element's border, tracking cursor position.

**Implementation Notes:**
- Use MotionValues for x and y position. Apply via `useMotionTemplate` for the gradient string.
- The overlay is an absolutely positioned `<motion.div>` with `pointer-events: none`.

**Reduced Motion:** No spotlight. Static appearance.

---

#### Primitive 18: `<FollowCursor>`

**Purpose:** An element that tracks the cursor with configurable lag and constraints.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface FollowCursorProps extends FluxPrimitiveProps {
  offset?: { x: number; y: number };  // Offset from cursor. Default: { x: 16, y: 16 }
  lag?: number;                // 0-1. 0 = instant follow, 1 = heavy lag. Default: 0.2
  rotate?: boolean;            // Rotate to face movement direction. Default: false
  hideOnLeave?: boolean;       // Hide when cursor leaves the container. Default: true
  containTo?: "parent" | "viewport" | "none";  // Default: "parent"
  visible?: boolean;           // Controlled visibility. Default: true
}
```

**Behavior:**
- Track cursor position via `mousemove` on the parent (or `window` if `containTo="viewport"`).
- Apply position via spring-animated `x` and `y` MotionValues. The `lag` controls the spring's damping — lower lag = higher stiffness.
- If `rotate`: calculate movement angle via `Math.atan2(dy, dx)` and apply `rotate`.
- If `hideOnLeave`: fade out on `mouseleave`, fade in on `mouseenter`.
- The element is `position: fixed` (viewport) or `position: absolute` (parent).

**Reduced Motion:** Element follows cursor instantly (no spring lag). No rotation animation.

---

### CATEGORY C: LAYOUT & TRANSITION (Primitives 19–26)

---

#### Primitive 19: `<Morph>`

**Purpose:** Shared layout animation between two elements. An element with the same `layoutId` seamlessly morphs between positions/sizes when toggling between two states.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface MorphProps extends FluxPrimitiveProps {
  layoutId: string;            // Required. Unique ID shared between morph pairs.
  transition?: object;         // Override spring config for this morph.
  mode?: "position" | "size" | "both";  // What to animate. Default: "both"
  onLayoutAnimationStart?: () => void;
  onLayoutAnimationComplete?: () => void;
}
```

**Behavior:**
- Wraps children in `<motion.div layoutId={layoutId}>`.
- When a component with the same `layoutId` mounts in a different position/size, Framer Motion's layout animation system handles the FLIP transition automatically.
- `mode="position"`: Only animate x/y, instant size change. `mode="size"`: Only animate width/height. `mode="both"`: Animate all.

**Reduced Motion:** Instant swap. No morphing animation.

**Implementation Notes:**
- This primitive is thin — its main value is providing the FLUX physics config to Framer's `layoutId` and ensuring consistent spring behavior.
- Must be used within a `<LayoutGroup>` (from `motion`) at the app level. The `<FluxProvider>` should include this.

---

#### Primitive 20: `<FluidLayout>`

**Purpose:** Automatically animates size changes of its children. When content inside changes (text length, child count, etc.), the container smoothly resizes instead of snapping.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface FluidLayoutProps extends FluxPrimitiveProps {
  axis?: "width" | "height" | "both";  // Which dimensions to animate. Default: "both"
  overflow?: "hidden" | "visible";     // During animation. Default: "hidden"
  tag?: keyof JSX.IntrinsicElements;   // Container element type. Default: "div"
  debounce?: number;           // Debounce ResizeObserver (ms). Default: 0
}
```

**Behavior:**
- Uses `motion.div` with `layout` prop enabled.
- ResizeObserver monitors children for size changes.
- When size changes, the container smoothly animates to the new dimensions via spring physics.
- During animation, overflow is set to configured value to prevent content spill.

**Reduced Motion:** Instant resize. No animation.

**Implementation Notes:**
- The key insight is using `<motion.div layout>` which triggers Framer's layout animation on size changes.
- `overflow: hidden` during animation prevents content from visually overflowing the animating container.

---

#### Primitive 21: `<Reorder>`

**Purpose:** Drag-to-reorder list with spring-based snapping and smooth layout transitions.

**Default Physics:** `"bouncy"`

**Props:**
```typescript
interface ReorderProps<T> extends FluxPrimitiveProps {
  items: T[];                  // Required. Array of items.
  onReorder: (newOrder: T[]) => void;  // Required. Callback with reordered array.
  axis?: "x" | "y";           // Default: "y"
  gap?: number;                // Gap between items in px. Default: 8
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  dragHandle?: boolean;        // If true, items need a DragHandle child. Default: false
}

// Sub-component
interface ReorderDragHandleProps {
  children: React.ReactNode;
  className?: string;
}
```

**Behavior:**
- Renders a list using `Reorder.Group` and `Reorder.Item` from `motion`.
- Each item is draggable on the specified axis.
- While dragging, other items smoothly shift to make room (spring animation).
- On release, the dragged item snaps to its new position.
- `renderItem` receives `isDragging` boolean for styling the active item (e.g., shadow, scale).

**Reduced Motion:** Reordering still works but items move instantly to new positions. No spring.

---

#### Primitive 22: `<PageTransition>`

**Purpose:** Route-level transitions for Next.js App Router or React Router. Handles enter/exit orchestration between pages.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface PageTransitionProps extends FluxPrimitiveProps {
  mode?: "fade" | "slide" | "morph" | "crossfade" | "none";  // Default: "fade"
  direction?: "left" | "right" | "up" | "down" | "auto";     // For slide mode. "auto" infers from route depth. Default: "auto"
  duration?: number;           // Override spring with duration (seconds). Default: undefined
  exitBeforeEnter?: boolean;   // Wait for exit before entering. Default: true
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}
```

**Behavior:**
- Wraps the page content in `<AnimatePresence>`.
- Each page gets `initial`, `animate`, `exit` variants:
  - `"fade"`: opacity 0→1 / 1→0.
  - `"slide"`: translate from direction + opacity.
  - `"crossfade"`: both pages visible during transition, opacity crossfade.
  - `"morph"`: uses shared `layoutId` elements between pages for hero transitions.
- `direction="auto"`: If navigating "deeper" (e.g., `/products` → `/products/123`), slide left. If navigating "up", slide right.

**Reduced Motion:** Instant page swap. No transition animation.

**Implementation Notes:**
- For Next.js App Router: use the `<Template>` component pattern with AnimatePresence.
- For React Router: wrap `<Outlet>` with AnimatePresence and use `useLocation()` as key.
- The `mode="morph"` requires `<Morph>` primitives on shared elements (e.g., a product image that morphs from grid to detail view).

---

#### Primitive 23: `<AnimatedList>`

**Purpose:** A list where items animate in/out individually when added/removed, with layout shift animation for remaining items.

**Default Physics:** `"gentle"`

**Props:**
```typescript
interface AnimatedListProps<T> extends FluxPrimitiveProps {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  enterFrom?: "below" | "above" | "left" | "right" | "scale";  // Default: "below"
  enterDistance?: number;      // Default: motionScale.distance.md
  stagger?: number;            // Stagger for initial render. Default: motionScale.stagger.fast
  layout?: boolean;            // Animate layout shifts when items reorder. Default: true
  maxRendered?: number;        // Max items to show. Default: Infinity
  reversed?: boolean;          // Newest items at top. Default: false
}
```

**Behavior:**
- Uses `<AnimatePresence>` to handle item mount/unmount.
- Each item is wrapped in `<motion.div layout>` with `initial`, `animate`, `exit` variants.
- When an item is added, it animates in from the configured direction.
- When removed, it animates out (opacity 0 + reverse direction).
- Remaining items smoothly shift to fill the gap via layout animation.
- On initial mount, items stagger in sequentially.

**Reduced Motion:** Items appear/disappear instantly. Layout shifts are instant.

---

#### Primitive 24: `<Marquee>`

**Purpose:** Infinite scrolling content ribbon. Commonly used for logo strips, testimonials, or news tickers.

**Default Physics:** N/A (uses CSS animation or requestAnimationFrame)

**Props:**
```typescript
interface MarqueeProps extends FluxPrimitiveProps {
  speed?: number;              // Pixels per second. Default: 50
  direction?: "left" | "right" | "up" | "down";  // Default: "left"
  pauseOnHover?: boolean;      // Default: true
  gap?: number;                // Gap between cloned sets. Default: 16
  gradientWidth?: number;      // Fade-out gradient width on edges. Default: 40. 0 = no gradient.
  gradientColor?: string;      // Default: "white" (should match background)
  reverse?: boolean;           // Reverse direction. Default: false
  speedOnHover?: number;       // Slow down (not stop) on hover. Default: undefined (stops if pauseOnHover)
}
```

**Behavior:**
- Clones children enough times to fill 2x the container width (or height for vertical).
- Translates the entire strip via CSS `@keyframes` or `requestAnimationFrame`.
- On hover (if `pauseOnHover`): pause animation or slow to `speedOnHover`.
- Edge gradients use CSS `mask-image: linear-gradient(...)` to fade content at the edges.
- Must be seamless — no visible "jump" when the animation loops.

**Implementation Notes:**
- Measure children width with a ref. Clone children until total width > 2 * container width.
- Use CSS animation: `translateX(-${totalChildrenWidth}px)` over calculated duration.
- For hover pause, use `animation-play-state: paused`.
- For scroll-velocity integration, the marquee can accept an external velocity value to modulate speed.

**Reduced Motion:** Static display. No scrolling. Show all items in a wrapping flex layout.

---

#### Primitive 25: `<Dock>`

**Purpose:** macOS-style dock with magnification effect. Items scale up as the cursor approaches and neighboring items also scale proportionally.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface DockProps extends FluxPrimitiveProps {
  magnification?: number;      // Max scale factor. Default: 1.6
  distance?: number;           // Cursor distance for full magnification in px. Default: 150
  direction?: "horizontal" | "vertical";  // Default: "horizontal"
  gap?: number;                // Gap between items. Default: 8
  baseSize?: number;           // Base item size in px. Default: 48
}

interface DockItemProps {
  children: React.ReactNode;
  className?: string;
  label?: string;              // Tooltip label
  onClick?: () => void;
}
```

**Usage:**
```tsx
<Dock magnification={1.8} distance={200}>
  <Dock.Item label="Home"><HomeIcon /></Dock.Item>
  <Dock.Item label="Search"><SearchIcon /></Dock.Item>
  <Dock.Item label="Settings"><SettingsIcon /></Dock.Item>
</Dock>
```

**Behavior:**
- Track cursor position along the dock's axis.
- For each item, calculate distance from cursor to item center.
- Scale factor = `1 + (magnification - 1) * Math.max(0, 1 - Math.abs(cursorDist) / distance)`.
- This creates a bell-curve magnification centered on the nearest item.
- Spring-animate each item's scale.
- If `label`, show a tooltip above/beside the item on hover.

**Reduced Motion:** No magnification. Static sizes. Tooltip still appears on hover.

---

#### Primitive 26: `<InfiniteScroll>`

**Purpose:** Scroll-driven content loading with smooth item entrance animations.

**Default Physics:** `"gentle"`

**Props:**
```typescript
interface InfiniteScrollProps<T> extends FluxPrimitiveProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  threshold?: number;          // Px from bottom to trigger loadMore. Default: 200
  loader?: React.ReactNode;    // Loading indicator. Default: <LoadingDots />
  enterFrom?: "below" | "left" | "right" | "scale";  // Default: "below"
  stagger?: number;            // Default: motionScale.stagger.fast
  batchSize?: number;          // Expected items per load. Used for stagger calculation. Default: 10
}
```

**Behavior:**
- Renders items in a container with scroll listener.
- When scroll position is within `threshold` of the bottom, call `onLoadMore`.
- New items (detected by key comparison) animate in with stagger from the configured direction.
- Existing items don't re-animate.
- While loading, show `loader` at the bottom.

**Reduced Motion:** Items appear instantly. No entrance animation.

---

### CATEGORY D: SCROLL-LINKED (Primitives 27–32)

---

#### Primitive 27: `<ScrollProgress>`

**Purpose:** Map scroll position to any animatable property. The foundation for scroll-linked animations.

**Default Physics:** N/A (direct scroll mapping, no spring)

**Props:**
```typescript
interface ScrollProgressProps extends FluxPrimitiveProps {
  target?: React.RefObject<HTMLElement>;  // Element to track. Default: nearest scroll container.
  offset?: [string, string];   // Start/end offsets. Default: ["start end", "end start"]
  // Motion's offset strings: "start" = top of element, "end" = bottom. Second word = viewport edge.
  style?: {                    // Map scroll progress to CSS properties
    [property: string]: [any, any] | [any, any, any]; // [startValue, endValue] or [start, mid, end]
  };
  onProgress?: (progress: number) => void;  // Callback with 0→1 progress
}
```

**Usage:**
```tsx
<ScrollProgress
  offset={["start end", "end start"]}
  style={{
    opacity: [0, 1],
    scale: [0.8, 1],
    y: [100, 0],
    rotate: [0, 360],
  }}
>
  <Card />
</ScrollProgress>
```

**Behavior:**
- Uses `useScroll({ target, offset })` from motion to get a `scrollYProgress` MotionValue (0→1).
- Uses `useTransform` to map `scrollYProgress` to each CSS property's value range.
- Applies transformed values to the `motion.div` wrapper's `style`.

**Reduced Motion:** Render at the final value (progress = 1). No scroll linking.

---

#### Primitive 28: `<Parallax>`

**Purpose:** Element moves at a different speed than scroll, creating depth.

**Default Physics:** N/A (scroll-linked)

**Props:**
```typescript
interface ParallaxProps extends FluxPrimitiveProps {
  speed?: number;              // -1 to 1. 0 = normal scroll. Negative = opposite direction. Default: 0.5
  direction?: "vertical" | "horizontal";  // Default: "vertical"
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";  // Default: "linear"
  overflow?: boolean;          // Allow element to overflow container. Default: true
}
```

**Behavior:**
- Calculate scroll position relative to the element's position in the viewport.
- Apply `translateY(scrollDelta * speed)` (or translateX for horizontal).
- `speed > 0`: element moves slower than scroll (appears further away).
- `speed < 0`: element moves opposite to scroll direction.
- `speed = 0`: no parallax (normal scroll behavior).

**Reduced Motion:** No parallax. Element scrolls normally.

---

#### Primitive 29: `<ScrollSnap>`

**Purpose:** Scroll-snapping sections with animated transitions between snap points. Enhances native CSS scroll-snap with motion feedback.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface ScrollSnapProps extends FluxPrimitiveProps {
  direction?: "vertical" | "horizontal";  // Default: "vertical"
  type?: "mandatory" | "proximity";  // CSS scroll-snap-type. Default: "mandatory"
  onSnapChange?: (index: number) => void;
  activeIndex?: number;        // Controlled snap position
  indicators?: boolean;        // Show dot indicators. Default: false
  indicatorPosition?: "left" | "right" | "top" | "bottom";  // Default: "right" (vertical) or "bottom" (horizontal)
}

interface ScrollSnapItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;              // Auto-assigned if not provided
}
```

**Behavior:**
- Container has `scroll-snap-type: y mandatory` (or x).
- Each `ScrollSnap.Item` has `scroll-snap-align: start`.
- An IntersectionObserver on each item detects which is most visible, updating `onSnapChange`.
- If `indicators`, render animated dots. Active dot scales up and changes color (spring animated).
- If `activeIndex` is controlled, programmatically scroll to that section.

**Reduced Motion:** Scroll-snapping still works (it's CSS native). Indicators change instantly.

---

#### Primitive 30: `<StickyReveal>`

**Purpose:** Element sticks during scroll, and its content progressively reveals/changes as the user scrolls through a defined range.

**Default Physics:** N/A (scroll-linked)

**Props:**
```typescript
interface StickyRevealProps extends FluxPrimitiveProps {
  height?: string | number;    // Total scrollable height for the sticky section. Default: "300vh"
  stickyPosition?: "top" | "center";  // Where element sticks. Default: "top"
  offset?: number;             // Top offset when sticky. Default: 0
  onProgress?: (progress: number) => void;
}
```

**Usage:**
```tsx
<StickyReveal height="400vh">
  {(progress) => (
    <div>
      <h1 style={{ opacity: Math.min(progress * 3, 1) }}>Title</h1>
      <p style={{ opacity: Math.max(0, (progress - 0.3) * 3) }}>Subtitle</p>
      <img style={{ scale: 0.5 + progress * 0.5 }} />
    </div>
  )}
</StickyReveal>
```

**Behavior:**
- Outer container has the specified `height` (acts as scroll range).
- Inner container has `position: sticky; top: offset`.
- Calculate `progress` as `scrolledPastTop / (outerHeight - viewportHeight)`, clamped 0→1.
- Children receive `progress` as a render prop.

**Reduced Motion:** Still functions (scroll is user-initiated). Content appears at progress=1 state.

---

#### Primitive 31: `<ScrollTriggeredVideo>`

**Purpose:** Play/pause/scrub a video based on scroll position.

**Props:**
```typescript
interface ScrollTriggeredVideoProps extends FluxPrimitiveProps {
  src: string;                 // Video source URL
  mode?: "play-on-view" | "scrub";  // Default: "play-on-view"
  threshold?: number;          // Viewport threshold to start playing. Default: 0.5
  playbackRate?: number;       // Default: 1
  muted?: boolean;             // Default: true
  loop?: boolean;              // Default: false
  poster?: string;             // Poster image
  offset?: [string, string];   // For scrub mode. Default: ["start end", "end start"]
}
```

**Behavior:**
- `"play-on-view"`: Use IntersectionObserver. When visible, play video. When out of view, pause.
- `"scrub"`: Map scroll progress (0→1) to video `currentTime` (0→duration). User scrolls to control playback.

**Reduced Motion:** `"play-on-view"` still works. `"scrub"` shows poster image or first frame only.

---

#### Primitive 32: `<CountOnScroll>`

**Purpose:** Numbers that count up as they scroll into view. A specialized combination of `<Reveal>` + `<CountUp>`.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface CountOnScrollProps extends FluxPrimitiveProps {
  value: number;
  from?: number;               // Default: 0
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  threshold?: number;          // Default: 0.3
  once?: boolean;              // Default: true
  tag?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  formatFn?: (value: number) => string;
}
```

**Behavior:**
- Combines viewport detection with number animation.
- When element scrolls into view, animate number from `from` to `value`.

**Reduced Motion:** Show final `value` immediately. No counting animation.

---

### CATEGORY E: BACKGROUND & AMBIENT (Primitives 33–37)

---

#### Primitive 33: `<GradientMesh>`

**Purpose:** Animated multi-point mesh gradient background. Smoother and more organic than CSS linear/radial gradients.

**Props:**
```typescript
interface GradientMeshProps extends FluxPrimitiveProps {
  colors: string[];            // 3-6 colors. Required.
  speed?: number;              // Animation speed multiplier. Default: 1
  blur?: number;               // Blur amount. Default: 80
  opacity?: number;            // Default: 0.8
  interactive?: boolean;       // Color points react to cursor. Default: false
  fixed?: boolean;             // Fixed background. Default: false
  grain?: boolean;             // Add film grain overlay. Default: false
  grainOpacity?: number;       // Default: 0.05
}
```

**Behavior:**
- Render N circular gradient blobs (one per color), each absolutely positioned.
- Each blob slowly moves in a unique Lissajous pattern (different frequency ratios for x/y).
- All blobs have large `filter: blur(${blur}px)`.
- If `interactive`: the blob nearest to the cursor moves toward it slightly.
- If `grain`: overlay an SVG noise filter with `mix-blend-mode: overlay`.
- Use `requestAnimationFrame` for the animation loop, NOT motion springs (this is continuous ambient animation).

**Performance Notes:**
- Apply `will-change: transform` to each blob.
- Use only `transform: translate()` — never change `top`/`left`.
- Limit to 6 blobs max. More causes GPU issues on mobile.

**Reduced Motion:** Static gradient. Blobs at their initial positions. No animation.

---

#### Primitive 34: `<DotGrid>`

**Purpose:** Animated dot grid background. Dots can react to cursor proximity, pulse, or wave.

**Props:**
```typescript
interface DotGridProps extends FluxPrimitiveProps {
  spacing?: number;            // Distance between dots in px. Default: 24
  dotSize?: number;            // Dot radius. Default: 1.5
  color?: string;              // Default: "rgba(0,0,0,0.2)"
  activeColor?: string;        // Color when activated. Default: color
  effect?: "none" | "wave" | "ripple" | "proximity" | "pulse";  // Default: "none"
  waveSpeed?: number;          // Default: 1
  waveAmplitude?: number;      // Scale multiplier for wave. Default: 2
  proximityRadius?: number;    // For "proximity" effect. Default: 100
  proximityScale?: number;     // Max scale on proximity. Default: 3
}
```

**Behavior:**
- Render dots using a single `<canvas>` element for performance.
- `"wave"`: Sine wave passes through the grid, scaling dots. `sin(x * freq + time) * amplitude`.
- `"ripple"`: Click creates an expanding ring that scales dots as it passes.
- `"proximity"`: Dots near cursor scale up and change to `activeColor`. Uses distance-based falloff.
- `"pulse"`: All dots pulse in unison (scale 1→1.5→1) at a slow cadence.

**Performance Notes:**
- MUST use Canvas, not individual DOM elements (a 50x50 grid = 2500 divs = unacceptable).
- Use `requestAnimationFrame` loop.
- Only redraw dots that changed since last frame (dirty rect optimization).

**Reduced Motion:** Static dot grid. No animation or interactivity.

---

#### Primitive 35: `<Particles>`

**Purpose:** Floating particle system for backgrounds. Particles drift, connect with lines, and optionally react to cursor.

**Props:**
```typescript
interface ParticlesProps extends FluxPrimitiveProps {
  count?: number;              // Number of particles. Default: 50
  color?: string;              // Default: "rgba(0,0,0,0.3)"
  size?: { min: number; max: number };  // Default: { min: 1, max: 3 }
  speed?: { min: number; max: number };  // Default: { min: 0.1, max: 0.5 }
  connections?: boolean;       // Draw lines between nearby particles. Default: true
  connectionDistance?: number; // Max distance for connections. Default: 120
  connectionColor?: string;    // Default: same as color
  interactive?: boolean;       // Particles repel from cursor. Default: false
  interactionRadius?: number;  // Default: 100
}
```

**Behavior:**
- Canvas-based particle system.
- Each particle has random position, velocity, and size (within configured ranges).
- Particles wrap around edges (appear on opposite side when exiting).
- If `connections`: for each particle pair within `connectionDistance`, draw a line with opacity proportional to `1 - (distance / connectionDistance)`.
- If `interactive`: particles within `interactionRadius` of cursor are pushed away.

**Performance Notes:**
- Canvas rendering. Use spatial hashing for connection distance checks (avoid O(n²) on large counts).
- Cap at 200 particles max. Warn in dev mode if count > 100.

**Reduced Motion:** Static particles at initial positions. No movement. Connections drawn statically.

---

#### Primitive 36: `<Aurora>`

**Purpose:** Northern lights / aurora borealis background effect.

**Props:**
```typescript
interface AuroraProps extends FluxPrimitiveProps {
  colors?: string[];           // Default: ["#00ff87", "#60efff", "#0061ff", "#ff00e5"]
  speed?: number;              // Default: 1
  blur?: number;               // Default: 100
  opacity?: number;            // Default: 0.3
  intensity?: number;          // 0-1. Controls wave amplitude. Default: 0.5
}
```

**Behavior:**
- Render 3-4 overlapping gradient bands.
- Each band undulates vertically using a sine-based animation with different frequencies and phases.
- Bands are heavily blurred and semi-transparent.
- Use CSS `@keyframes` for the undulation (translateY + scaleY + slight rotation).
- Bands use `mix-blend-mode: screen` (on dark backgrounds) or `mix-blend-mode: multiply` (on light).

**Reduced Motion:** Static gradient. No undulation.

---

#### Primitive 37: `<Noise>`

**Purpose:** Animated film grain / noise texture overlay.

**Props:**
```typescript
interface NoiseProps extends FluxPrimitiveProps {
  opacity?: number;            // Default: 0.05
  speed?: number;              // Frame rate of noise. Default: 8 (fps)
  blendMode?: string;          // CSS mix-blend-mode. Default: "overlay"
  color?: boolean;             // Color noise vs monochrome. Default: false
  size?: number;               // Grain size multiplier. Default: 1
}
```

**Behavior:**
- Render an SVG `<filter>` with `<feTurbulence>` for noise generation.
- Animate the `seed` attribute at `speed` fps to create the grain effect.
- Apply as a full-size overlay with `pointer-events: none`.
- Use `requestAnimationFrame` with frame skipping to hit target fps.

**Reduced Motion:** Static noise (single frame). No animation.

---

### CATEGORY F: AI & STREAMING (Primitives 38–40)

---

#### Primitive 38: `<StreamingText>`

**Purpose:** Renders text that arrives character-by-character (like LLM streaming output) with natural-feeling motion.

**Default Physics:** `"snappy"`

**Props:**
```typescript
interface StreamingTextProps extends FluxPrimitiveProps {
  text: string;                // The current text value (grows over time as tokens arrive)
  cursor?: boolean;            // Show blinking cursor at end. Default: true
  cursorChar?: string;         // Default: "▋"
  cursorBlinkSpeed?: number;   // Seconds per blink cycle. Default: 0.8
  charAnimation?: "fade" | "slide" | "none";  // How new characters appear. Default: "fade"
  smoothCaret?: boolean;       // Cursor position animates smoothly. Default: true
  tag?: "p" | "div" | "span" | "pre";  // Default: "div"
  className?: string;
  onComplete?: () => void;     // Fires when text stops changing for > 1s
}
```

**Behavior:**
- Track the previous `text` length. When `text` grows, animate only the NEW characters.
- `"fade"`: New characters animate `opacity: 0→1` over 100ms with 20ms stagger.
- `"slide"`: New characters slide in from below (4px) + fade.
- Cursor is a `<motion.span>` that blinks (opacity 0↔1) and smoothly translates to the end of text if `smoothCaret`.
- When `text` stops growing for 1 second, fire `onComplete` and optionally hide cursor.

**Implementation Notes:**
- Use a ref to track `prevText.length`. On each render where `text.length > prevLength`, identify new chars.
- Split the entire text into `<span>` elements. Already-rendered chars are static. New chars get motion.
- For performance with long texts (1000+ chars), only keep the last N chars as individual spans; collapse older chars into a single text node.

**Reduced Motion:** Characters appear instantly. No fade or slide. Cursor blinks normally (blinking is not a motion issue).

---

#### Primitive 39: `<ToolCallIndicator>`

**Purpose:** Animated visualization for AI tool/function calls. Shows a sequence of tool invocations with status transitions.

**Default Physics:** `"smooth"`

**Props:**
```typescript
interface ToolCall {
  id: string;
  name: string;                // Tool name (e.g., "web_search", "code_run")
  status: "pending" | "running" | "complete" | "error";
  result?: string;             // Brief result text
  duration?: number;           // Seconds it took
  icon?: React.ReactNode;      // Custom icon
}

interface ToolCallIndicatorProps extends FluxPrimitiveProps {
  calls: ToolCall[];
  collapsible?: boolean;       // Allow collapsing individual results. Default: true
  showDuration?: boolean;      // Default: true
  compact?: boolean;           // Single-line per call. Default: false
  onCallClick?: (call: ToolCall) => void;
}
```

**Behavior:**
- Renders a vertical list of tool calls.
- Each call has a status icon:
  - `"pending"`: Grayed-out circle.
  - `"running"`: Spinning/pulsing indicator (spring-based rotation or opacity pulse).
  - `"complete"`: Green checkmark with scale-in spring animation.
  - `"error"`: Red X with shake animation.
- Status transitions are animated: icon morphs from one state to the next.
- When a new call appears, it animates in from below with stagger.
- If `collapsible`, clicking a completed call toggles the `result` text with `<Collapse>`.
- Connect calls with a vertical line (like a timeline). The line "grows" downward as new calls appear.

**Reduced Motion:** No icon animation. Status changes are instant. List items appear instantly.

---

#### Primitive 40: `<ThinkingPulse>`

**Purpose:** An organic, breathing loading indicator for AI "thinking" states. Replaces generic spinners with a more natural feel.

**Default Physics:** `"cinematic"`

**Props:**
```typescript
interface ThinkingPulseProps extends FluxPrimitiveProps {
  variant?: "dots" | "ring" | "blob" | "wave" | "text";  // Default: "dots"
  size?: "sm" | "md" | "lg";  // Default: "md"
  color?: string;              // Default: "currentColor"
  label?: string;              // Accessible text. Default: "Loading"
  phase?: string;              // Display text like "Thinking...", "Searching...", "Writing...". Default: undefined
  phaseTransition?: "crossfade" | "morph" | "slide";  // How phase text changes. Default: "crossfade"
}
```

**Behavior:**
- `"dots"`: Three dots with staggered scale pulsing (1→1.4→1). Not a simple CSS animation — uses spring physics for organic feel. Each dot's pulse is offset by 0.15s.
- `"ring"`: An SVG circle with animated `stroke-dashoffset`. The dash rotates and the gap size oscillates (grows and shrinks), creating a breathing effect.
- `"blob"`: An SVG blob shape that continuously morphs between 3-4 organic shapes using spring-animated path interpolation.
- `"wave"`: A horizontal wave (3-5 bars) with staggered height oscillation. Spring-based for organic bouncy feel.
- `"text"`: The `phase` text with animated ellipsis (dots appear one by one with spring).
- If `phase` is provided, render the phase text below/beside the indicator. When `phase` changes, animate the text transition using `phaseTransition`.
- Container has `role="status"` and `aria-label={label}`.

**Reduced Motion:** `"dots"` = static dots, no pulsing. `"ring"` = static circle. `"blob"` = static shape. `"wave"` = static bars. `"text"` = static text with "..." (no animation). Phase changes are instant.

---

## DEPENDENCY GRAPH

Implement in this order:

```
Phase 0 — Shared Infrastructure
  flux.config.ts, FluxProvider, all hooks, all utils

Phase 1 — Core (no inter-primitive dependencies)
  01-Reveal, 02-Presence, 05-CountUp, 08-Collapse, 09-Magnetic,
  10-HoverScale, 12-Drag, 17-Spotlight, 18-FollowCursor,
  19-Morph, 20-FluidLayout, 24-Marquee, 27-ScrollProgress,
  28-Parallax, 33-GradientMesh, 34-DotGrid, 35-Particles,
  36-Aurora, 37-Noise

Phase 2 — Depends on Phase 1
  03-Stagger (uses Reveal internally)
  04-TextReveal (uses Reveal animation logic)
  06-MorphText (uses Presence for transitions)
  07-FlipCard (uses Presence for face swap)
  11-Tilt (shares logic with Magnetic)
  13-Swipe (extends Drag)
  14-LongPress (uses HoverScale for feedback)
  15-Hover3D (shares logic with Tilt)
  16-ScrollVelocity (extends ScrollProgress)
  21-Reorder (extends Drag)
  23-AnimatedList (uses Presence + Stagger)
  25-Dock (uses Magnetic logic + HoverScale)
  29-ScrollSnap (uses ScrollProgress)
  30-StickyReveal (uses ScrollProgress)
  31-ScrollTriggeredVideo (uses ScrollProgress)
  32-CountOnScroll (uses CountUp + Reveal)
  38-StreamingText (uses Presence for characters)

Phase 3 — Depends on Phase 2
  22-PageTransition (uses Morph + Presence)
  26-InfiniteScroll (uses AnimatedList + Stagger)
  39-ToolCallIndicator (uses Collapse + AnimatedList + ThinkingPulse)
  40-ThinkingPulse (uses MorphText for phase text)
```

---

## TESTING REQUIREMENTS

For each primitive, the AI agent must produce:

1. **Unit Tests** (Vitest + React Testing Library):
   - Renders without crashing.
   - Forwards refs correctly.
   - Applies className and style props.
   - `disabled` prop renders children statically.
   - `asChild` merges props onto child.
   - Reduced motion behavior is correct.

2. **Visual Tests** (Storybook stories):
   - Default configuration story.
   - All prop variants showcased.
   - Interactive controls for tuning.
   - Reduced motion preview.

3. **Performance Tests:**
   - Each primitive renders 100 instances without dropping below 55fps on a mid-range device (simulated via Chrome DevTools throttling).

---

## FILE OUTPUT PER PRIMITIVE

```
src/primitives/[name]/
├── index.ts              # Public exports
├── [Name].tsx            # Main component
├── [Name].types.ts       # TypeScript interfaces
├── [Name].test.tsx       # Vitest tests
├── [Name].stories.tsx    # Storybook stories
└── use[Name].ts          # Hook (if the primitive has a hook-only API)
```

---

*End of specification. An AI agent with access to a React project scaffold, the `motion` library, Tailwind CSS v4, and Vitest should be able to implement all 40 primitives from this document without additional clarification.*
