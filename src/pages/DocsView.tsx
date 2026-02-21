import { useState } from 'react';
import { HeroHighlight, Reveal, TextReveal, Stagger, Collapse } from '../index';

const Code = ({ children, title }: { children: string; title?: string }) => (
    <div className="bg-[#0a0a0b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden my-6">
        {title && (
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{title}</span>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
            </div>
        )}
        <pre className="p-6 overflow-x-auto">
            <code className="text-sm text-slate-300 font-mono leading-relaxed">{children}</code>
        </pre>
    </div>
);

const PropRow = ({ name, type, def, desc }: { name: string; type: string; def?: string; desc: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-4 border-b border-slate-100 last:border-0">
        <div className="sm:w-1/4 flex-shrink-0">
            <code className="text-sm font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{name}</code>
        </div>
        <div className="sm:w-1/4 flex-shrink-0">
            <code className="text-xs font-mono text-slate-500">{type}</code>
            {def && <span className="text-xs text-slate-400 ml-2">= {def}</span>}
        </div>
        <div className="sm:w-1/2 text-sm text-slate-600 leading-relaxed">{desc}</div>
    </div>
);

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-slate-200/60 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left">
                <span className="font-display font-medium text-slate-900">{title}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <Collapse open={open}>
                <div className="px-6 pb-6 pt-2">{children}</div>
            </Collapse>
        </div>
    );
}

export function DocsView() {
    return (
        <section className="w-full max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-20">
            <div className="border-b border-slate-200 pb-12">
                <TextReveal tag="h2" by="word" className="text-5xl md:text-6xl font-display font-medium mb-6 text-slate-900 tracking-tight">
                    Documentation
                </TextReveal>
                <p className="text-slate-500 text-xl leading-relaxed">
                    Everything you need to install, configure, and compose <HeroHighlight>FLUX UI</HeroHighlight> primitives.
                </p>
            </div>

            {/* Quick Start */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Quick Start</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                    FLUX UI primitives are designed to be copied into your project or installed as a package. The only runtime dependency is <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">motion/react</code> (Framer Motion for React 19).
                </p>
                <Code title="Terminal">{`npm install motion/react clsx tailwind-merge`}</Code>
                <p className="text-slate-600 leading-relaxed mt-6">
                    Then copy any primitive into your components directory. Each is a single file with zero internal dependencies beyond shared hooks.
                </p>
                <Code title="your-project/components/flux/reveal.tsx">{`// Copy from src/primitives/01-reveal.tsx
import { Reveal } from './components/flux/reveal';

export default function Page() {
  return (
    <Reveal from="below" distance={24} physics="snappy">
      <h1>Hello, FLUX</h1>
    </Reveal>
  );
}`}</Code>
            </div>

            {/* Provider */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">FluxProvider</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                    Optionally wrap your app in <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">FluxProvider</code> to set global defaults. If omitted, primitives use sensible defaults and respect the OS <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">prefers-reduced-motion</code> setting.
                </p>
                <Code title="app/layout.tsx">{`import { FluxProvider } from '@/components/flux';

export default function RootLayout({ children }) {
  return (
    <FluxProvider
      motionLevel="full"      // "full" | "reduced" | "none"
      defaultPhysics="gentle" // any PhysicsPreset name
    >
      {children}
    </FluxProvider>
  );
}`}</Code>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-6">
                    <h4 className="font-display font-medium text-slate-900 mb-4">Provider Props</h4>
                    <PropRow name="motionLevel" type='"full" | "reduced" | "none"' def='"full"' desc="Controls global animation intensity. 'reduced' uses simplified transitions. 'none' disables all animation." />
                    <PropRow name="defaultPhysics" type="PhysicsPreset" def='"smooth"' desc="Default spring configuration for all primitives." />
                    <PropRow name="children" type="ReactNode" desc="Your application tree." />
                </div>
            </div>

            {/* Physics Presets */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Physics Presets</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                    Seven named presets map to spring configurations. Pass any preset name as the <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">physics</code> prop.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-display font-medium text-slate-900">Preset</th>
                                <th className="text-left py-3 px-4 font-display font-medium text-slate-900">Stiffness</th>
                                <th className="text-left py-3 px-4 font-display font-medium text-slate-900">Damping</th>
                                <th className="text-left py-3 px-4 font-display font-medium text-slate-900">Mass</th>
                                <th className="text-left py-3 px-4 font-display font-medium text-slate-900">Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "snappy", s: 500, d: 30, m: 0.5, use: "Micro-interactions, buttons, toggles" },
                                { name: "smooth", s: 200, d: 20, m: 1, use: "General purpose, most UI elements" },
                                { name: "gentle", s: 120, d: 14, m: 1, use: "Reveals, fades, subtle entrances" },
                                { name: "dramatic", s: 80, d: 10, m: 1.5, use: "Hero sections, attention-grabbing" },
                                { name: "bouncy", s: 400, d: 15, m: 1, use: "Playful, energetic, gamified" },
                                { name: "cinematic", s: 50, d: 12, m: 2, use: "Slow reveals, page transitions" },
                                { name: "instant", s: 800, d: 40, m: 0.3, use: "Immediate feedback, no overshoot" },
                            ].map((p) => (
                                <tr key={p.name} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4"><code className="font-mono text-teal-700 font-medium">{p.name}</code></td>
                                    <td className="py-3 px-4 text-slate-600 font-mono">{p.s}</td>
                                    <td className="py-3 px-4 text-slate-600 font-mono">{p.d}</td>
                                    <td className="py-3 px-4 text-slate-600 font-mono">{p.m}</td>
                                    <td className="py-3 px-4 text-slate-500">{p.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Primitive Anatomy */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Primitive Anatomy</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                    Every primitive shares a common interface. They forward refs, accept standard HTML attributes, and compose naturally.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h4 className="font-display font-medium text-slate-900 mb-4">Common Props</h4>
                    <PropRow name="physics" type="PhysicsPreset" def='"smooth"' desc="Spring configuration preset." />
                    <PropRow name="disabled" type="boolean" def="false" desc="Disables all animation. Element renders statically." />
                    <PropRow name="className" type="string" desc="CSS classes applied to the wrapper." />
                    <PropRow name="style" type="CSSProperties" desc="Inline styles on the wrapper." />
                    <PropRow name="asChild" type="boolean" def="false" desc="Delegates rendering via Radix Slot pattern." />
                </div>
                <Code title="Composition example">{`<Reveal from="below" physics="gentle">
  <Tilt maxTilt={8}>
    <Spotlight mode="glow" size={200}>
      <Card>
        <CountUp to={99.9} decimals={1} suffix="%" />
      </Card>
    </Spotlight>
  </Tilt>
</Reveal>`}</Code>
            </div>

            {/* Accessibility */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Accessibility</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                    FLUX UI uses a three-tier motion reduction strategy. Motion enhances but never gates functionality.
                </p>
                <Stagger interval={0.08} className="space-y-4">
                    {[
                        { tier: "1", title: "OS Preference", desc: "Reads prefers-reduced-motion automatically." },
                        { tier: "2", title: "Provider Override", desc: "motionLevel prop overrides OS setting per-app." },
                        { tier: "3", title: "Per-Primitive", desc: "Each accepts a disabled prop for granular control." },
                    ].map((item) => (
                        <Reveal key={item.tier} from="left" distance={12}>
                            <div className="bg-white rounded-xl border border-slate-200/60 p-5 flex items-start gap-4">
                                <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">{item.tier}</div>
                                <div>
                                    <h4 className="font-display font-medium text-slate-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </Stagger>
            </div>

            {/* Primitive Reference */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Primitive Reference</h3>
                <p className="text-slate-600 leading-relaxed mb-6">All 40 primitives organized by category. Click to expand.</p>
                <div className="space-y-3">
                    <AccordionItem title="A · Entrance & Exit (8)">
                        <div className="space-y-4 text-sm text-slate-600">
                            <p className="leading-relaxed">Controls how elements appear and disappear — viewport triggers, mount/unmount transitions, stagger orchestration.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {["Reveal", "Presence", "Stagger", "TextReveal", "CountUp", "MorphText", "FlipCard", "Collapse"].map((n) => (
                                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 font-medium">{n}</div>
                                ))}
                            </div>
                            <Code>{`<Reveal from="below" distance={24} physics="gentle">
  <div>Animate in on scroll</div>
</Reveal>

<TextReveal by="word" stagger={0.05} tag="h1">
  Each word appears sequentially
</TextReveal>`}</Code>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="B · Interaction & Gesture (10)">
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>Mouse, touch, pointer interactions — magnetic pull, hover, drag, swipe, long-press, cursor tracking.</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {["Magnetic", "HoverScale", "Tilt", "Drag", "Swipe", "LongPress", "Hover3D", "Spotlight", "FollowCursor", "ScrollVelocity"].map((n) => (
                                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 font-medium">{n}</div>
                                ))}
                            </div>
                            <Code>{`<Magnetic strength={0.4} radius={120}>
  <button>Pull toward cursor</button>
</Magnetic>

<Tilt maxTilt={15} glare glareOpacity={0.1}>
  <Card>3D perspective tilt</Card>
</Tilt>`}</Code>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="C · Layout & Transition (8)">
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>Shared layouts, fluid resizing, reorder, page transitions, marquees, dock.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {["Morph", "FluidLayout", "Reorder", "PageTransition", "AnimatedList", "Marquee", "Dock", "InfiniteScroll"].map((n) => (
                                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 font-medium">{n}</div>
                                ))}
                            </div>
                            <Code>{`<Dock magnification={1.4} distance={140}>
  <Dock.Item label="Home"><Icon /></Dock.Item>
</Dock>`}</Code>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="D · Scroll-Linked (4)">
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>Map scroll position to visuals — progress, parallax, sticky reveals, snap.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {["ScrollProgress", "Parallax", "StickyScroll", "ScrollSnap"].map((n) => (
                                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 font-medium">{n}</div>
                                ))}
                            </div>
                            <Code>{`<ScrollProgress color="#0d9488" height={3} />
<Parallax offset={50} direction="up">
  <Image src="/hero.jpg" />
</Parallax>`}</Code>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="E · Background & Ambient (5)">
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>Atmospheric visual layers — gradients, aurora, particles, grids, noise. All GPU-accelerated.</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {["Aurora", "MeshGradient", "Particles", "GridPattern", "Noise"].map((n) => (
                                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 font-medium">{n}</div>
                                ))}
                            </div>
                            <Code>{`<div className="relative">
  <Aurora opacity={0.5} />
  <Particles quantity={30} color="#2dd4bf" />
  <Noise opacity={0.04} />
  <div className="relative z-10">Content</div>
</div>`}</Code>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="F · AI & Streaming (5)">
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>For generative AI — streaming text, thinking states, loading, chat wrappers.</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {["StreamingText", "TypingIndicator", "Skeleton", "AIMessage", "HeroHighlight"].map((n) => (
                                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 font-medium">{n}</div>
                                ))}
                            </div>
                            <Code>{`<AIMessage role="assistant">
  <StreamingText text="Physics-based streaming." speed={25} />
</AIMessage>
<TypingIndicator />
<Skeleton width="100%" height={24} />`}</Code>
                        </div>
                    </AccordionItem>
                </div>
            </div>

            {/* Hooks */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Hooks</h3>
                <p className="text-slate-600 leading-relaxed mb-6">Utility hooks that power the primitives. Use them directly for custom components.</p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <PropRow name="usePhysics" type="(preset) => SpringConfig" desc="Resolves a preset name to spring values." />
                    <PropRow name="useReducedMotion" type="() => boolean" desc="True if motion should be reduced (OS or provider)." />
                    <PropRow name="useInView" type="(ref, opts) => boolean" desc="True when element is visible in viewport." />
                    <PropRow name="useScrollProgress" type="(ref) => MotionValue" desc="0-1 motion value tracking scroll progress." />
                    <PropRow name="usePrefersReducedMotion" type="() => boolean" desc="Reads OS prefers-reduced-motion query." />
                    <PropRow name="useAnimationBudget" type="() => BudgetContext" desc="Frame rate budget for performance management." />
                    <PropRow name="useMergedRef" type="(...refs) => Ref" desc="Merges multiple refs into one." />
                    <PropRow name="useIsClient" type="() => boolean" desc="False during SSR, true after hydration." />
                </div>
            </div>

            {/* Architecture */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Architecture</h3>
                <p className="text-slate-600 leading-relaxed mb-6">Five-layer architecture from raw physics tokens to full page scenes.</p>
                <Stagger interval={0.08} className="space-y-2">
                    {[
                        { l: "5", name: "Scenes", desc: "Full page templates", color: "bg-teal-500 text-white" },
                        { l: "4", name: "Patterns", desc: "Multi-component compositions", color: "bg-teal-400 text-white" },
                        { l: "3", name: "Components", desc: "Individual UI elements with motion", color: "bg-teal-300 text-teal-900" },
                        { l: "2", name: "Primitives", desc: "40 composable animation behaviors", color: "bg-teal-200 text-teal-900" },
                        { l: "1", name: "Motion Tokens", desc: "Physics constants and spring presets", color: "bg-teal-100 text-teal-800" },
                    ].map((item) => (
                        <Reveal key={item.l} from="left" distance={12}>
                            <div className={`${item.color} rounded-xl px-6 py-4 flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold opacity-60">L{item.l}</span>
                                    <span className="font-display font-medium">{item.name}</span>
                                </div>
                                <span className="text-xs opacity-60 hidden sm:block">{item.desc}</span>
                            </div>
                        </Reveal>
                    ))}
                </Stagger>
            </div>

            {/* Compatibility */}
            <div>
                <h3 className="text-3xl font-display font-medium text-slate-900 mb-3">Compatibility</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                        { name: "React 19+", note: "Required" },
                        { name: "Next.js 15+", note: "App Router" },
                        { name: "Vite 5+", note: "Recommended" },
                        { name: "Remix 2+", note: "Supported" },
                        { name: "Astro 4+", note: "React islands" },
                        { name: "TypeScript", note: "Native" },
                        { name: "Tailwind v4", note: "Used in demos" },
                        { name: "motion/react", note: "Peer dep" },
                    ].map((item) => (
                        <div key={item.name} className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
                            <div className="font-display font-medium text-slate-900 text-sm">{item.name}</div>
                            <div className="text-xs text-slate-400 mt-1">{item.note}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pt-8 pb-4 border-t border-slate-100">
                <p className="text-sm text-slate-400">
                    FLUX UI is MIT licensed. Copy-paste ownership — no lock-in, no accounts, no telemetry.
                </p>
            </div>
        </section>
    );
}
