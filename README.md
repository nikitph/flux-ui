<p align="center">
  <img src="https://img.shields.io/badge/FLUX_UI-v0.1.0-0d9488?style=for-the-badge&labelColor=09090b" alt="Version" />
  <img src="https://img.shields.io/badge/React-19+-61dafb?style=for-the-badge&logo=react&labelColor=09090b" alt="React 19+" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&labelColor=09090b" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=for-the-badge&logo=tailwindcss&labelColor=09090b" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&labelColor=09090b" alt="MIT License" />
</p>

<h1 align="center">FLUX UI</h1>

<p align="center">
  <strong>A motion-first, physics-based React component library.</strong><br/>
  40 composable primitives that turn animation from a feature into a language.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#primitives">Primitives</a> ·
  <a href="#physics-presets">Physics</a> ·
  <a href="#accessibility">Accessibility</a> ·
  <a href="#architecture">Architecture</a>
</p>

---

## Why FLUX UI?

Every UI library treats animation as decoration — a per-component config you tweak until it "feels right." FLUX UI takes a different stance: **motion is a grammar.** A button's hover, a modal's entrance, a page transition, and a skeleton loader's pulse should all speak the same visual language.

FLUX UI provides that language through 40 motion primitives, a unified physics engine, and a composable architecture where wrapping `<Magnetic>` around `<Reveal>` around a `<button>` just works.

**What makes it different:**

- **Physics-first defaults** — 7 named spring presets (`snappy`, `smooth`, `gentle`, `dramatic`, `bouncy`, `cinematic`, `instant`) replace magic number configs. Every animation is driven by real stiffness, damping, and mass values.
- **Composable, not configurable** — Small primitives that combine like Unix pipes for motion, instead of mega-components with 50 props each.
- **AI-native patterns** — First-class primitives for streaming text, typing indicators, skeleton loaders, and AI chat interfaces.
- **Accessibility built in** — Three-tier system: OS `prefers-reduced-motion` → FluxProvider `motionLevel` → per-primitive `disabled` prop. Reduced motion never disables — it gracefully degrades to opacity crossfades.
- **Zero visual lock-in** — Primitives add motion behavior only. All visual styling lives in your Tailwind classes.

---

## Quick Start

### Installation

```bash
npm install flux-ui
```

**Peer dependencies:** `react >= 19`, `react-dom >= 19`, `motion >= 12`, `tailwindcss >= 4`

### Wrap your app

```tsx
import { FluxProvider } from "flux-ui";

function App() {
  return (
    <FluxProvider physics="smooth" motionLevel="full">
      {/* your app */}
    </FluxProvider>
  );
}
```

### Use a primitive

```tsx
import { Reveal, Magnetic, HoverScale } from "flux-ui";

function Hero() {
  return (
    <Reveal direction="up" stagger>
      <h1>Welcome</h1>
      <p>Motion is not a feature. It is a language.</p>
      <Magnetic strength={0.3}>
        <HoverScale scale={1.05}>
          <button className="px-6 py-3 bg-teal-500 text-white rounded-xl">
            Get Started
          </button>
        </HoverScale>
      </Magnetic>
    </Reveal>
  );
}
```

Primitives compose freely — nest them, combine them, and let the physics engine handle the rest.

---

## Primitives

40 motion primitives across 6 categories.

### Category A — Entrance & Exit

| # | Primitive | Description |
|---|-----------|-------------|
| 01 | `Reveal` | Fade + directional slide on viewport entry |
| 02 | `Presence` | Mount/unmount with enter/exit animations |
| 03 | `Stagger` | Sequentially animate child elements |
| 04 | `TextReveal` | Character or word-level text entrance |
| 05 | `CountUp` | Animated number counter |
| 06 | `MorphText` | Smooth text content transitions |
| 07 | `FlipCard` | 3D card flip with front/back faces |
| 08 | `Collapse` | Smooth height expand/collapse |

### Category B — Interaction & Gesture

| # | Primitive | Description |
|---|-----------|-------------|
| 09 | `Magnetic` | Cursor-attracted element displacement |
| 10 | `HoverScale` | Scale transform on hover |
| 11 | `Tilt` | Perspective tilt following pointer position |
| 12 | `Drag` | Physics-based drag with constraints |
| 13 | `Swipe` | Swipe-to-dismiss / swipe-to-action |
| 14 | `LongPress` | Press-and-hold interaction with progress |
| 15 | `Hover3D` | Multi-layer parallax depth on hover |
| 16 | `ScrollVelocity` | Speed-reactive scroll animations |
| 17 | `Spotlight` | Radial gradient follows cursor |
| 18 | `FollowCursor` | Element tracks cursor position |

### Category C — Layout & Transition

| # | Primitive | Description |
|---|-----------|-------------|
| 19 | `Morph` | Shared-layout morphing transitions |
| 20 | `FluidLayout` | Animated layout reflow |
| 21 | `Reorder` | Drag-to-reorder with animated layout |
| 22 | `PageTransition` | Route-level enter/exit transitions |
| 23 | `AnimatedList` | Auto-animate list item add/remove |
| 24 | `Marquee` | Infinite horizontal/vertical scroll |
| 25 | `Dock` | macOS-style magnifying dock |
| 26 | `InfiniteScroll` | Virtualized infinite scroll with motion |

### Category D — Scroll-Linked

| # | Primitive | Description |
|---|-----------|-------------|
| 27 | `ScrollProgress` | Scroll-linked progress indicator |
| 28 | `Parallax` | Depth-based scroll parallax layers |
| 29 | `StickyScroll` | Scroll-driven sticky reveal sections |
| 30 | `ScrollSnap` | Physics-based snap scrolling |

### Category E — Background & Ambient

| # | Primitive | Description |
|---|-----------|-------------|
| 31 | `Aurora` | Animated aurora borealis gradient |
| 32 | `MeshGradient` | Morphing mesh gradient background |
| 33 | `Particles` | Configurable particle field |
| 34 | `GridPattern` | Animated dot/line grid |
| 35 | `Noise` | Animated grain/noise texture overlay |

### Category F — AI & Streaming

| # | Primitive | Description |
|---|-----------|-------------|
| 36 | `StreamingText` | Token-by-token text reveal |
| 37 | `TypingIndicator` | Animated typing dots |
| 38 | `Skeleton` | Content placeholder with shimmer |
| 39 | `AIMessage` | Chat bubble with streaming support |
| 40 | `HeroHighlight` | Animated text emphasis highlight |

---

## Physics Presets

Every spring animation is driven by named physics presets — no magic numbers.

| Preset | Stiffness | Damping | Mass | Best for |
|--------|-----------|---------|------|----------|
| `snappy` | 500 | 30 | 0.5 | Buttons, toggles, micro-interactions |
| `smooth` | 200 | 20 | 1.0 | General transitions, reveals |
| `gentle` | 120 | 14 | 1.0 | Background shifts, ambient motion |
| `dramatic` | 80 | 10 | 1.5 | Hero entrances, page transitions |
| `bouncy` | 400 | 15 | 1.0 | Playful interactions, attention |
| `cinematic` | 50 | 12 | 2.0 | Full-screen reveals, slow drama |
| `instant` | 800 | 40 | 0.3 | Immediate feedback, no perceptible delay |

Override per-primitive:

```tsx
<Reveal physics="dramatic" direction="up">
  <h1>Grand Entrance</h1>
</Reveal>
```

Or configure globally:

```tsx
<FluxProvider physics="smooth">
  {/* all children default to smooth springs */}
</FluxProvider>
```

---

## Accessibility

FLUX UI implements a three-tier accessibility strategy:

**Tier 1 — OS Level.** Automatically detects `prefers-reduced-motion` via `usePrefersReducedMotion()`. When active, all spatial animations (translate, scale, rotate) are replaced with 150ms opacity crossfades. Nothing is disabled — every primitive still communicates state changes.

**Tier 2 — Provider Level.** The `FluxProvider` accepts a `motionLevel` prop (`"full"`, `"reduced"`, `"none"`) for app-wide control, independent of OS settings.

**Tier 3 — Primitive Level.** Every primitive accepts a `disabled` prop to opt out of motion on a case-by-case basis.

```tsx
// OS-level detection is automatic
// Provider-level override:
<FluxProvider motionLevel="reduced">
  {/* All primitives use reduced motion */}
  <Reveal disabled>{/* This specific one has no motion */}</Reveal>
</FluxProvider>
```

---

## Architecture

FLUX UI is built on a five-layer architecture:

```
┌─────────────────────────────────┐
│  Layer 5 — Scenes               │  Full page compositions
├─────────────────────────────────┤
│  Layer 4 — Patterns             │  Multi-primitive recipes
├─────────────────────────────────┤
│  Layer 3 — Components           │  Single-purpose UI elements
├─────────────────────────────────┤
│  Layer 2 — Primitives (×40)     │  Motion behaviors
├─────────────────────────────────┤
│  Layer 1 — Motion Tokens        │  Physics presets, scales, config
└─────────────────────────────────┘
```

Primitives live at Layer 2. They add **motion behavior only** — never visual styling. You bring your own design system, your own Tailwind classes, your own component library. FLUX UI handles the motion.

### Key architectural decisions

- **Radix Slot pattern** — Every primitive supports `asChild` for zero-wrapper composition.
- **Ref forwarding** — All 40 primitives forward refs via `React.forwardRef`.
- **SSR safe** — No `window` or `document` access at render time. All browser APIs live inside effects.
- **Tree-shakeable** — Import only what you use. Each primitive is independently importable.
- **< 3KB per primitive** — Every primitive targets under 3KB gzipped (excluding the `motion` peer dependency).

---

## Hooks

8 utility hooks available for custom motion work:

| Hook | Description |
|------|-------------|
| `usePhysics(preset)` | Returns spring config for a named preset |
| `usePrefersReducedMotion()` | Raw `prefers-reduced-motion` media query |
| `useReducedMotion()` | Computed boolean factoring provider + OS |
| `useIsClient()` | SSR guard — `false` on server, `true` on client |
| `useMergedRef(...refs)` | Merge forwarded ref + internal ref |
| `useInView(options)` | IntersectionObserver wrapper |
| `useScrollProgress(ref)` | Element scroll position as 0→1 |
| `useAnimationBudget()` | Register/deregister active animations |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Animation | Motion (Framer Motion) |
| Styling | Tailwind CSS v4 |
| Composition | Radix UI Slot |
| Language | TypeScript 5.9 (strict) |
| Build | Vite 7 |

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npx tsc -b

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## License

MIT © FLUX UI

---

<p align="center">
  <strong>Motion is not a feature. It is a language.</strong>
</p>
