import { useState } from 'react';
import * as P from '../index';
import { LazySection } from '../components/LazySection';

/* ─── Reusable Demo Card ──────────────────────────────────── */
const Card = ({ title, desc, dark, children }: { title: string; desc: string; dark?: boolean; children: React.ReactNode }) => (
    <P.Tilt maxTilt={3} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col overflow-hidden group">
        <div className={`flex-1 min-h-[160px] flex items-center justify-center relative rounded-xl border mb-5 overflow-hidden ${dark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
            {children}
        </div>
        <h4 className="font-display font-medium text-lg text-slate-900 mb-1.5">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </P.Tilt>
);

/* ─── Section Header ──────────────────────────────────────── */
const SectionHeader = ({ badge, color, title, count }: { badge: string; color: string; title: string; count: number }) => (
    <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-10">
        <h3 className="text-2xl font-display font-medium text-slate-900 flex items-center gap-3">
            <span className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-xs font-bold`}>{badge}</span>
            {title}
        </h3>
        <span className="text-sm text-slate-400 font-medium">{count} primitives</span>
    </div>
);

/* ─── Interactive helpers ─────────────────────────────────── */
function CollapseDemo() {
    const [open, setOpen] = useState(false);
    return (
        <div className="w-full px-5">
            <button onClick={() => setOpen(!open)} className="w-full bg-white border border-slate-200 h-10 rounded-lg flex items-center px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors mb-2 shadow-sm">
                {open ? 'Collapse ↑' : 'Expand ↓'}
            </button>
            <P.Collapse open={open}>
                <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-sm text-teal-700">
                    This content smoothly animates its height using spring physics. No hardcoded heights needed.
                </div>
            </P.Collapse>
        </div>
    );
}

function FlipDemo() {
    const [flipped, setFlipped] = useState(false);
    return (
        <div onClick={() => setFlipped(!flipped)} className="cursor-pointer">
            <P.FlipCard
                flipped={flipped}
                trigger="manual"
                height={120}
                width={160}
                front={<div className="w-40 h-[120px] bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-medium shadow-lg">Front →</div>}
                back={<div className="w-40 h-[120px] bg-slate-900 rounded-xl flex items-center justify-center text-teal-400 font-medium shadow-lg">← Back</div>}
            />
        </div>
    );
}

function SwipeDemo() {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return <button onClick={() => setDismissed(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Reset</button>;
    return (
        <P.Swipe direction="horizontal" onSwipe={() => setDismissed(true)}>
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-6 py-3 text-sm font-medium text-slate-600 cursor-grab active:cursor-grabbing">
                ← Swipe me →
            </div>
        </P.Swipe>
    );
}

function LongPressDemo() {
    const [pressed, setPressed] = useState(false);
    return (
        <P.LongPress onLongPress={() => { setPressed(true); setTimeout(() => setPressed(false), 1500); }} duration={0.8} feedback="ring">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-xs font-medium shadow-md transition-colors ${pressed ? 'bg-teal-500 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
                {pressed ? 'Done!' : 'Hold me'}
            </div>
        </P.LongPress>
    );
}

/* ─── Main View ───────────────────────────────────────────── */
export function ComponentsView() {
    return (
        <div className="w-full max-w-7xl mx-auto space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-20">
            {/* Page Header */}
            <div className="border-b border-slate-200 pb-12">
                <P.TextReveal tag="h2" by="word" className="text-5xl md:text-6xl font-display font-medium text-slate-900 mb-6 tracking-tight">
                    40 Motion Primitives
                </P.TextReveal>
                <p className="text-slate-500 text-xl max-w-3xl leading-relaxed">
                    Every primitive is composable, accessible, SSR-safe, and under 3KB gzipped. Copy them into your project and start building.
                </p>
            </div>

            {/* ═══ CATEGORY A: Entrance & Exit ═══ */}
            <LazySection minHeight={600}>
                <section>
                    <SectionHeader badge="A" color="bg-teal-100 text-teal-700" title="Entrance & Exit" count={8} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card title="Reveal" desc="Viewport-triggered entrance animations with configurable direction and spring.">
                            <P.Reveal from="below" distance={24}><div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl shadow-lg" /></P.Reveal>
                        </Card>
                        <Card title="Presence" desc="AnimatePresence wrapper ensuring exit animations complete before unmount.">
                            <P.Presence mode="wait"><div key="p" className="w-20 h-20 bg-slate-800 rounded-2xl shadow-lg" /></P.Presence>
                        </Card>
                        <Card title="Stagger" desc="Orchestrate children with sequential delay from any origin.">
                            <P.Stagger interval={0.1} className="flex gap-2">
                                <div className="w-10 h-10 bg-teal-300 rounded-lg" />
                                <div className="w-10 h-10 bg-teal-400 rounded-lg" />
                                <div className="w-10 h-10 bg-teal-500 rounded-lg" />
                                <div className="w-10 h-10 bg-teal-600 rounded-lg" />
                            </P.Stagger>
                        </Card>
                        <Card title="Text Reveal" desc="Character, word, or line-level staggered text entrance.">
                            <P.TextReveal by="char" stagger={0.03} className="font-display text-3xl font-bold tracking-tight text-slate-800">Flux UI</P.TextReveal>
                        </Card>
                        <Card title="Count Up" desc="Animate numbers with spring physics or timed interpolation.">
                            <div className="text-5xl font-mono font-bold text-teal-500 tracking-tighter">
                                <P.CountUp to={2048} duration={3} separator="," />
                            </div>
                        </Card>
                        <Card title="Morph Text" desc="Cycle through strings with crossfade, scramble, or typewriter effects.">
                            <P.MorphText texts={["Hello", "Bonjour", "Hola", "こんにちは"]} className="text-3xl font-display font-bold text-slate-800" />
                        </Card>
                        <Card title="Flip Card" desc="3D card flip between front and back faces. Click to interact.">
                            <FlipDemo />
                        </Card>
                        <Card title="Collapse" desc="Spring-animated height transitions. Solves auto-height animation.">
                            <CollapseDemo />
                        </Card>
                    </div>
                </section>
            </LazySection>

            {/* ═══ CATEGORY B: Interaction & Gesture ═══ */}
            <LazySection minHeight={600}>
                <section>
                    <SectionHeader badge="B" color="bg-indigo-100 text-indigo-700" title="Interaction & Gesture" count={10} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card title="Magnetic" desc="Elements subtly follow the cursor within a configurable radius.">
                            <P.Magnetic strength={0.5} radius={80}>
                                <button className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium text-sm shadow-lg cursor-pointer">Pull Me</button>
                            </P.Magnetic>
                        </Card>
                        <Card title="Hover Scale" desc="Scale-on-hover with press feedback. The essential interaction.">
                            <P.HoverScale hoverScale={1.08} pressScale={0.94}>
                                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl shadow-lg cursor-pointer" />
                            </P.HoverScale>
                        </Card>
                        <Card title="Tilt" desc="3D perspective tilt following the cursor. Apple TV card effect.">
                            <P.Tilt maxTilt={20} glare glareOpacity={0.15}>
                                <div className="w-36 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-xl border border-indigo-400/20 flex items-center justify-center text-white/80 text-xs font-medium">Hover me</div>
                            </P.Tilt>
                        </Card>
                        <Card title="Drag" desc="Draggable elements with constraints, momentum, and snap points.">
                            <P.Drag>
                                <div className="w-16 h-16 bg-slate-800 rounded-full cursor-grab active:cursor-grabbing shadow-lg text-white flex items-center justify-center text-[11px] font-medium">Drag</div>
                            </P.Drag>
                        </Card>
                        <Card title="Swipe" desc="Swipe-to-dismiss with velocity detection and rubber-band physics.">
                            <SwipeDemo />
                        </Card>
                        <Card title="Long Press" desc="Hold-to-activate with ring, fill, or scale visual feedback.">
                            <LongPressDemo />
                        </Card>
                        <Card title="Hover 3D" desc="Multi-layer parallax hover creating depth between children.">
                            <P.Hover3D maxMovement={15} className="w-32 h-24 relative">
                                <P.Hover3D.Layer depth={0}><div className="absolute inset-0 bg-slate-200 rounded-xl" /></P.Hover3D.Layer>
                                <P.Hover3D.Layer depth={0.5}><div className="absolute inset-2 bg-slate-300 rounded-lg" /></P.Hover3D.Layer>
                                <P.Hover3D.Layer depth={1}><div className="absolute inset-4 bg-teal-500 rounded-md shadow-lg" /></P.Hover3D.Layer>
                            </P.Hover3D>
                        </Card>
                        <Card title="Spotlight" desc="Radial gradient glow that follows the cursor over an element.">
                            <P.Spotlight size={180} color="rgba(20,184,166,0.12)" mode="glow">
                                <div className="w-full h-full flex items-center justify-center text-sm text-slate-400 font-medium">
                                    Move cursor here
                                </div>
                            </P.Spotlight>
                        </Card>
                        <Card title="Follow Cursor" desc="Element that tracks the cursor with configurable spring lag.">
                            <div className="text-sm text-slate-400 font-medium bg-slate-100 px-4 py-2 rounded-full border border-slate-200">See global cursor</div>
                        </Card>
                        <Card title="Scroll Velocity" desc="Visual effects that intensify based on scroll speed.">
                            <div className="text-sm text-slate-400 font-medium text-center px-4">Scroll the page to see blur, stretch, and skew effects</div>
                        </Card>
                    </div>
                </section>
            </LazySection>

            {/* ═══ CATEGORY C: Layout & Transition ═══ */}
            <LazySection minHeight={600}>
                <section>
                    <SectionHeader badge="C" color="bg-orange-100 text-orange-700" title="Layout & Transition" count={8} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card title="Morph" desc="Shared layout animations between elements via layoutId.">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                                <div className="w-8 h-8 bg-slate-600 rounded-lg self-end" />
                            </div>
                        </Card>
                        <Card title="Fluid Layout" desc="Auto-animate size changes when content shifts.">
                            <div className="w-full px-4">
                                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                    <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
                                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                                </div>
                            </div>
                        </Card>
                        <Card title="Reorder" desc="Drag-to-reorder list with spring-based snapping.">
                            <div className="w-full px-6 space-y-2">
                                {["Item A", "Item B", "Item C"].map((item) => (
                                    <div key={item} className="h-9 bg-white border border-slate-200 rounded-lg flex items-center px-3 text-xs font-medium text-slate-500 shadow-sm">{item}</div>
                                ))}
                            </div>
                        </Card>
                        <Card title="Page Transition" desc="Route-level enter/exit orchestration for Next.js or React Router.">
                            <div className="flex gap-2">
                                <div className="w-16 h-20 bg-slate-200 rounded-lg border border-slate-300 opacity-40" />
                                <div className="w-16 h-20 bg-teal-100 rounded-lg border border-teal-200" />
                            </div>
                        </Card>
                        <Card title="Animated List" desc="Items animate in/out individually with layout shift animation.">
                            <div className="w-full px-6 space-y-2">
                                <P.Stagger interval={0.08}>
                                    <div className="h-8 w-full bg-teal-100 rounded-md border border-teal-200" />
                                    <div className="h-8 w-[85%] bg-teal-50 rounded-md border border-teal-100" />
                                    <div className="h-8 w-[70%] bg-teal-50/50 rounded-md border border-teal-100/50" />
                                </P.Stagger>
                            </div>
                        </Card>
                        <Card title="Marquee" desc="Infinite scrolling ribbon with pause-on-hover and edge fade.">
                            <div className="w-full overflow-hidden">
                                <P.Marquee speed={30} gradientWidth={40} gradientColor="#f8fafc">
                                    {["React", "Motion", "Tailwind", "TypeScript"].map((t, i) => (
                                        <span key={i} className="mx-4 text-sm font-medium text-slate-400 whitespace-nowrap">{t}</span>
                                    ))}
                                </P.Marquee>
                            </div>
                        </Card>
                        <Card title="Dock" desc="macOS-style dock with distance-based magnification.">
                            <P.Dock magnification={1.4} distance={80} gap={6}>
                                {["A", "B", "C", "D"].map((item) => (
                                    <P.Dock.Item key={item} label={`App ${item}`}>
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 flex items-center justify-center text-xs font-bold cursor-pointer" />
                                    </P.Dock.Item>
                                ))}
                            </P.Dock>
                        </Card>
                        <Card title="Infinite Scroll" desc="Scroll-driven content loading with smooth entrance animation.">
                            <div className="text-sm text-slate-400 font-medium text-center px-4">Triggers onLoadMore when threshold reached</div>
                        </Card>
                    </div>
                </section>
            </LazySection>

            {/* ═══ CATEGORY D: Scroll-Linked ═══ */}
            <LazySection minHeight={400}>
                <section>
                    <SectionHeader badge="D" color="bg-purple-100 text-purple-700" title="Scroll-Linked" count={4} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card title="Scroll Progress" desc="Map scroll position to any animatable CSS property.">
                            <div className="w-full px-6">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-teal-500 rounded-full" />
                                </div>
                                <div className="text-xs text-slate-400 mt-2 text-center">Scroll the page</div>
                            </div>
                        </Card>
                        <Card title="Parallax" desc="Elements move at variable speeds relative to scroll.">
                            <div className="relative h-full w-full flex items-center justify-center">
                                <div className="w-20 h-20 bg-slate-200 rounded-xl absolute" />
                                <div className="w-14 h-14 bg-teal-400 rounded-lg shadow-lg relative z-10" />
                            </div>
                        </Card>
                        <Card title="Sticky Scroll" desc="Content sticks and progressively reveals during scroll range.">
                            <div className="w-full px-6">
                                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm space-y-2">
                                    <div className="h-3 w-full bg-teal-200 rounded" />
                                    <div className="h-3 w-2/3 bg-teal-100 rounded" />
                                    <div className="h-3 w-1/3 bg-teal-50 rounded" />
                                </div>
                            </div>
                        </Card>
                        <Card title="Scroll Snap" desc="Enhanced CSS scroll-snap with animated indicators.">
                            <div className="flex gap-1.5 items-center">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className={`rounded-full transition-all ${i === 1 ? 'w-3 h-3 bg-teal-500' : 'w-2 h-2 bg-slate-300'}`} />
                                ))}
                            </div>
                        </Card>
                    </div>
                </section>
            </LazySection>

            {/* ═══ CATEGORY E: Background & Ambient ═══ */}
            <LazySection minHeight={400}>
                <section>
                    <SectionHeader badge="E" color="bg-pink-100 text-pink-700" title="Background & Ambient" count={5} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card title="Mesh Gradient" dark desc="Fluid animated multi-point mesh gradient background.">
                            <div className="absolute inset-0 z-0 rounded-xl overflow-hidden m-0"><P.MeshGradient speed={15} /></div>
                        </Card>
                        <Card title="Aurora" dark desc="Northern lights effect with undulating gradient bands.">
                            <div className="absolute inset-0 z-0 bg-slate-950 rounded-xl overflow-hidden m-0"><P.Aurora opacity={0.7} /></div>
                        </Card>
                        <Card title="Particles" dark desc="Canvas-based floating particles with cursor interaction.">
                            <div className="absolute inset-0 bg-slate-950 z-0 rounded-xl overflow-hidden m-0"><P.Particles quantity={60} color="#2dd4bf" /></div>
                        </Card>
                        <Card title="Grid Pattern" desc="Customizable SVG dot or line grid backgrounds.">
                            <div className="absolute inset-0 z-0 bg-white rounded-xl overflow-hidden m-0"><P.GridPattern size={20} color="#000" /></div>
                        </Card>
                        <Card title="Noise" desc="Animated film grain texture overlay with blend modes.">
                            <div className="absolute inset-0 bg-white z-0 rounded-xl overflow-hidden m-0"><P.Noise opacity={0.2} /></div>
                        </Card>
                    </div>
                </section>
            </LazySection>

            {/* ═══ CATEGORY F: AI & Streaming ═══ */}
            <LazySection minHeight={400}>
                <section>
                    <SectionHeader badge="F" color="bg-rose-100 text-rose-700" title="AI & Streaming" count={5} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card title="Streaming Text" desc="Physics-based character reveal for LLM streaming output.">
                            <div className="px-5 text-sm text-slate-700 leading-relaxed">
                                <P.StreamingText text="Each character appears with spring motion, creating a natural typing feel for AI responses." speed={20} />
                            </div>
                        </Card>
                        <Card title="Typing Indicator" desc="Organic breathing dots for AI thinking states.">
                            <div className="flex items-center gap-3">
                                <P.TypingIndicator />
                                <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                            </div>
                        </Card>
                        <Card title="Skeleton" desc="Shimmer loading placeholder for unstructured content.">
                            <div className="w-full px-6 space-y-3">
                                <P.Skeleton width="100%" height={20} className="bg-slate-200" />
                                <P.Skeleton width="85%" height={20} className="bg-slate-200" />
                                <P.Skeleton width="60%" height={20} className="bg-slate-200" />
                            </div>
                        </Card>
                        <Card title="Hero Highlight" desc="Draw visual attention to specific text with animated marks.">
                            <div className="text-2xl font-bold tracking-tight text-slate-800 flex items-center justify-center gap-1">
                                <P.HeroHighlight>Motion</P.HeroHighlight> first
                            </div>
                        </Card>
                        <Card title="AI Message" desc="Chat bubble wrapper with role-based alignment and entrance.">
                            <div className="w-full px-4 space-y-3">
                                <P.AIMessage role="assistant">
                                    <div className="bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm text-xs text-slate-700">How can I help?</div>
                                </P.AIMessage>
                                <P.AIMessage role="user" delay={0.5}>
                                    <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-xs ml-auto w-max">Build something great</div>
                                </P.AIMessage>
                            </div>
                        </Card>
                    </div>
                </section>
            </LazySection>

            {/* Totals footer */}
            <div className="text-center pt-8 pb-4 border-t border-slate-100">
                <p className="text-sm text-slate-400">
                    <span className="font-display font-medium text-slate-600">40 primitives</span> across 6 categories.
                    Each one is composable, ref-forwarding, and respects <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">prefers-reduced-motion</code>.
                </p>
            </div>
        </div>
    );
}
