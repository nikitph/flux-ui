import { useState } from 'react';
import {
    Reveal, TextReveal, Stagger, Magnetic, HoverScale, Marquee,
    Tilt, GridPattern, StreamingText, AIMessage, CountUp, Dock,
    Aurora, MeshGradient, ScrollProgress, MorphText,
    Spotlight, Particles, FlipCard, Noise,
    TypingIndicator
} from '../index';

const FEATURES = [
    { icon: "spring", label: "Physics-Based Springs", desc: "Seven tuned spring presets — from snappy micro-interactions to cinematic reveals. No magic numbers." },
    { icon: "compose", label: "Composable Primitives", desc: "Nest Magnetic inside Reveal inside Tilt. Primitives compose naturally — like Unix pipes for motion." },
    { icon: "a11y", label: "Accessibility First", desc: "Three-tier reduced motion strategy. Every animation degrades gracefully. Motion enhances, never gates." },
    { icon: "perf", label: "Performance Budget", desc: "Built-in animation budget system. Automatically simplifies when the frame rate drops below threshold." },
    { icon: "ai", label: "AI-Native Patterns", desc: "Purpose-built primitives for streaming text, tool calls, thinking states, and generative interfaces." },
    { icon: "ssr", label: "SSR & RSC Safe", desc: "No window access during render. Works with Next.js App Router, Remix, Astro — everywhere React runs." },
];

const ICON_MAP: Record<string, React.ReactNode> = {
    spring: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c0-3.3 2.7-6 6-6 4.4 0 8 3.6 8 8s-3.6 8-8 8c-3.3 0-6-2.7-6-6"/><circle cx="12" cy="12" r="2"/></svg>,
    compose: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    a11y: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1"/><path d="m6 8 2 1 4-1 4 1 2-1"/><path d="M12 9v14"/><path d="m8 18-2 4"/><path d="m16 18 2 4"/></svg>,
    perf: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    ai: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>,
    ssr: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>,
};

const STATS = [
    { value: 40, suffix: "", label: "Motion Primitives" },
    { value: 7, suffix: "", label: "Physics Presets" },
    { value: 3, suffix: "", label: "KB avg. per primitive" },
    { value: 0, suffix: "", label: "Runtime dependencies*", displayValue: "Zero" },
];

export function HomeView({ onNavigate }: { onNavigate: (tab: any) => void }) {
    const [flipState, setFlipState] = useState(false);

    return (
        <>
            {/* ═══════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════ */}
            <section className="text-center max-w-5xl mx-auto mb-40 flex flex-col items-center relative z-20">
                {/* Version badge */}
                <Reveal from="below" delay={0.1} distance={12}>
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-10">
                        <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-600 tracking-wide">v1.0 — 40 motion primitives</span>
                    </div>
                </Reveal>

                {/* Main headline */}
                <TextReveal
                    tag="h1"
                    by="word"
                    stagger={0.05}
                    physics="snappy"
                    className="text-6xl sm:text-7xl md:text-[88px] font-display tracking-tight leading-[0.95] text-slate-950 mb-8 max-w-[960px]"
                >
                    Motion is not a feature. It is a language.
                </TextReveal>

                {/* Subtitle */}
                <Reveal from="below" delay={0.5} distance={24}>
                    <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-light leading-relaxed">
                        FLUX UI is a physics-first React component library that treats animation
                        as a core architectural primitive — composable, accessible, and beautiful by default.
                    </p>
                </Reveal>

                {/* CTA buttons */}
                <Stagger interval={0.08} className="flex flex-wrap items-center justify-center gap-4">
                    <Magnetic strength={0.35} radius={100}>
                        <button
                            onClick={() => onNavigate('components')}
                            className="bg-slate-950 text-white px-8 py-4 rounded-full font-medium text-sm flex items-center gap-2.5 shadow-xl shadow-black/10 hover:bg-slate-800 transition-colors focus:outline-none"
                        >
                            Explore 40 Primitives
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </Magnetic>
                    <HoverScale hoverScale={1.04} pressScale={0.96}>
                        <button
                            onClick={() => onNavigate('docs')}
                            className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
                        >
                            Read the Docs
                        </button>
                    </HoverScale>
                    <HoverScale hoverScale={1.04} pressScale={0.96}>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 border border-slate-200/0 px-5 py-4 rounded-full font-medium text-sm hover:text-slate-900 transition-colors inline-flex items-center gap-2 focus:outline-none"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            GitHub
                        </a>
                    </HoverScale>
                </Stagger>
            </section>

            {/* ═══════════════════════════════════════════════
                SCROLL PROGRESS
            ═══════════════════════════════════════════════ */}
            <ScrollProgress color="#0d9488" height={2} />

            {/* ═══════════════════════════════════════════════
                STATS MARQUEE BAND
            ═══════════════════════════════════════════════ */}
            <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-40 border-y border-slate-200/80 bg-white py-10 overflow-hidden z-20">
                <Marquee speed={35} pauseOnHover gradientWidth={120} gradientColor="white" className="flex items-center">
                    {[
                        "Physics-Based Springs",
                        "40 Motion Primitives",
                        "Composable Architecture",
                        "Accessibility First",
                        "SSR Ready",
                        "TypeScript Native",
                        "< 3KB per Primitive",
                        "AI-Native Patterns",
                        "Zero Lock-in",
                    ].map((text, i) => (
                        <div key={i} className="px-8 flex h-full items-center gap-4 mx-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                            <span className="text-2xl font-display font-medium tracking-tight text-slate-400 whitespace-nowrap">{text}</span>
                        </div>
                    ))}
                </Marquee>
            </section>

            {/* ═══════════════════════════════════════════════
                STATS ROW
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-5xl mx-auto mb-40 relative z-20">
                <Stagger interval={0.12} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <Reveal key={i} from="below" distance={20}>
                            <div className="text-center py-8 px-4">
                                <div className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-3 tracking-tight">
                                    {stat.displayValue ? stat.displayValue : <CountUp to={stat.value} duration={2.5} suffix={stat.suffix} />}
                                </div>
                                <div className="text-sm font-medium text-slate-400 tracking-wide uppercase">{stat.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </Stagger>
            </section>

            {/* ═══════════════════════════════════════════════
                HERO FEATURE — AI COMPOSITION
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-6xl mx-auto mb-40 relative z-20">
                <div className="flex flex-col items-start mb-16">
                    <TextReveal tag="h2" by="word" stagger={0.04} className="text-4xl md:text-5xl font-display tracking-tight mb-5 text-slate-900 font-medium">
                        Built for what comes next.
                    </TextReveal>
                    <Reveal from="below" delay={0.2}>
                        <p className="text-slate-500 text-lg max-w-xl leading-relaxed">Purpose-built primitives for AI interfaces, generative UI, and streaming interactions that feel alive.</p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Large AI demo card */}
                    <Tilt maxTilt={2} className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-200/60 shadow-lg overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/40 blur-[40px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                        <div className="p-10 pb-0 relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-medium text-slate-900">Generative Intelligence</h3>
                                    <p className="text-sm text-slate-400">Streaming, typing, tool calls — motion that understands AI.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mx-6 mb-6 bg-slate-50 backdrop-blur-xs rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
                            <GridPattern size={20} fade />
                            <div className="relative z-10 space-y-4">
                                <AIMessage role="assistant" className="">
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-bl-sm px-5 py-4 text-slate-700 text-[15px] leading-relaxed">
                                        <StreamingText text="I can help you build generative UI that feels alive. Each word appears with physics-based spring motion, not just a timer." speed={30} />
                                    </div>
                                </AIMessage>
                                <AIMessage role="user" delay={2} className="">
                                    <div className="bg-slate-900 text-white rounded-2xl rounded-br-sm px-5 py-3.5 flex items-center gap-3 w-max shadow-md ml-auto text-[15px]">
                                        <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                        Show me the components
                                    </div>
                                </AIMessage>
                                <div className="flex items-center gap-2 pt-1">
                                    <TypingIndicator />
                                    <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    </Tilt>

                    {/* Right column: stacked cards */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Precision card */}
                        <Reveal from="right" distance={30}>
                            <div className="bg-slate-950 rounded-[2rem] p-8 shadow-xl relative overflow-hidden border border-slate-800 flex-1">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                                <div className="relative z-10">
                                    <h4 className="text-base font-medium text-slate-400 mb-6 tracking-wide">Precision Counting</h4>
                                    <div className="text-5xl font-bold text-teal-400 font-mono tracking-tighter drop-shadow-[0_0_12px_rgba(45,212,191,0.3)]">
                                        <CountUp to={99.97} decimals={2} suffix="%" duration={3.5} />
                                    </div>
                                    <div className="text-sm text-slate-500 mt-3 font-medium">Uptime this quarter</div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Morph text card */}
                        <Reveal from="right" distance={30} delay={0.15}>
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-lg relative overflow-hidden">
                                <MeshGradient speed={6} style={{ opacity: 0.35 }} />
                                <div className="relative z-10">
                                    <h4 className="text-base font-medium text-slate-400 mb-6 tracking-wide">Text Morphing</h4>
                                    <MorphText
                                        texts={["Motion", "Fluid", "Reactive", "Composable", "Beautiful"]}
                                        className="text-4xl font-display font-bold text-slate-900"
                                    />
                                </div>
                            </div>
                        </Reveal>

                        {/* Flip card mini demo */}
                        <Reveal from="right" distance={30} delay={0.3}>
                            <div
                                className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-lg relative overflow-hidden cursor-pointer"
                                onClick={() => setFlipState(!flipState)}
                            >
                                <h4 className="text-base font-medium text-slate-400 mb-4 tracking-wide">3D Flip Card</h4>
                                <FlipCard
                                    flipped={flipState}
                                    trigger="manual"
                                    height={80}
                                    front={
                                        <div className="w-full h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-medium text-sm shadow-lg">
                                            Click to flip →
                                        </div>
                                    }
                                    back={
                                        <div className="w-full h-20 bg-slate-900 rounded-xl flex items-center justify-center text-teal-400 font-medium text-sm shadow-lg">
                                            ← Click again
                                        </div>
                                    }
                                />
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                FEATURE GRID — WHY FLUX
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-6xl mx-auto mb-40 relative z-20">
                <div className="text-center mb-16">
                    <TextReveal tag="h2" by="word" stagger={0.04} className="text-4xl md:text-5xl font-display tracking-tight mb-5 text-slate-900 font-medium">
                        Why choose FLUX UI?
                    </TextReveal>
                    <Reveal from="below" delay={0.2}>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Every decision is grounded in physics, accessibility, and developer experience.</p>
                    </Reveal>
                </div>

                <Stagger interval={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map((feature, i) => (
                        <Spotlight key={i} size={250} color="rgba(20,184,166,0.06)" mode="glow">
                            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl mb-5 flex items-center justify-center text-slate-700">
                                    {ICON_MAP[feature.icon]}
                                </div>
                                <h4 className="text-lg font-display font-medium text-slate-900 mb-2">{feature.label}</h4>
                                <p className="text-slate-500 text-[15px] leading-relaxed">{feature.desc}</p>
                            </div>
                        </Spotlight>
                    ))}
                </Stagger>
            </section>

            {/* ═══════════════════════════════════════════════
                DOCK DEMO SECTION
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-5xl mx-auto mb-40 relative z-20">
                <Reveal from="below" delay={0.1}>
                    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200/60 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-100/20 blur-[40px] rounded-full pointer-events-none" />
                        <div className="relative z-10 text-center">
                            <h3 className="text-3xl font-display font-medium mb-3 text-slate-900">Interactive Dock</h3>
                            <p className="text-slate-500 mb-12 text-base">macOS-style magnification with spring physics. Hover to see it in action.</p>
                            <div className="flex justify-center">
                                <Dock magnification={1.5} distance={150} gap={10}>
                                    {["Finder", "Safari", "Messages", "Mail", "Maps", "Photos", "Music", "Calendar"].map((app, i) => (
                                        <Dock.Item key={i} label={app}>
                                            <HoverScale hoverScale={1}>
                                                <div className="w-14 h-14 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-[1rem] shadow-sm flex items-center justify-center text-sm font-bold text-slate-400 cursor-pointer hover:text-slate-900 hover:shadow-md transition-all">
                                                    {app[0]}
                                                </div>
                                            </HoverScale>
                                        </Dock.Item>
                                    ))}
                                </Dock>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ═══════════════════════════════════════════════
                COMPOSITION DEMO — LAYERED BACKGROUNDS
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-6xl mx-auto mb-40 relative z-20">
                <div className="text-center mb-16">
                    <TextReveal tag="h2" by="word" stagger={0.04} className="text-4xl md:text-5xl font-display tracking-tight mb-5 text-slate-900 font-medium">
                        Compose anything.
                    </TextReveal>
                    <Reveal from="below" delay={0.2}>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Stack primitives together. Aurora + Particles + Noise + Tilt = one line of intent, infinite expression.</p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dark immersive card */}
                    <Tilt maxTilt={3} className="h-[400px] bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative group">
                        <Aurora opacity={0.5} />
                        <Particles quantity={30} color="#2dd4bf" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-10">
                            <Reveal from="below" distance={30}>
                                <h3 className="text-4xl font-display font-bold text-white mb-4 drop-shadow-lg tracking-tight">Aurora + Particles</h3>
                                <p className="text-slate-400 text-base leading-relaxed max-w-sm">Layer ambient backgrounds to create depth. Each primitive runs independently on the GPU.</p>
                            </Reveal>
                        </div>
                    </Tilt>

                    {/* Light elegant card */}
                    <Tilt maxTilt={3} className="h-[400px] bg-white rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden relative group">
                        <MeshGradient speed={8} style={{ opacity: 0.5 }} />
                        <Noise opacity={0.06} />
                        <GridPattern size={28} fade />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-10">
                            <Reveal from="below" distance={30}>
                                <h3 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">Mesh + Noise + Grid</h3>
                                <p className="text-slate-500 text-base leading-relaxed max-w-sm">Combine textures for rich, tactile surfaces that feel handcrafted and intentional.</p>
                            </Reveal>
                        </div>
                    </Tilt>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                ARCHITECTURE SECTION
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-5xl mx-auto mb-40 relative z-20">
                <div className="text-center mb-16">
                    <TextReveal tag="h2" by="word" stagger={0.04} className="text-4xl md:text-5xl font-display tracking-tight mb-5 text-slate-900 font-medium">
                        Five layers of motion.
                    </TextReveal>
                    <Reveal from="below" delay={0.2}>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">From physics tokens to full page templates — a principled architecture that scales.</p>
                    </Reveal>
                </div>

                <Stagger interval={0.1} className="space-y-3">
                    {[
                        { layer: "5", name: "Scenes", desc: "Full page templates with orchestrated motion", color: "bg-teal-500", textColor: "text-white" },
                        { layer: "4", name: "Patterns", desc: "Multi-component compositions with coordinated animation", color: "bg-teal-400", textColor: "text-white" },
                        { layer: "3", name: "Components", desc: "Individual UI elements with motion built-in", color: "bg-teal-300", textColor: "text-teal-900" },
                        { layer: "2", name: "Primitives", desc: "40 composable animation behaviors", color: "bg-teal-200", textColor: "text-teal-900" },
                        { layer: "1", name: "Motion Tokens", desc: "Physics constants, spring presets, timing scales", color: "bg-teal-100", textColor: "text-teal-800" },
                    ].map((item) => (
                        <Reveal key={item.layer} from="below" distance={16}>
                            <div className={`${item.color} ${item.textColor} rounded-2xl px-8 py-5 flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold opacity-60">L{item.layer}</span>
                                    <span className="text-lg font-display font-medium">{item.name}</span>
                                </div>
                                <span className="text-sm opacity-70 hidden sm:block">{item.desc}</span>
                            </div>
                        </Reveal>
                    ))}
                </Stagger>
            </section>

            {/* ═══════════════════════════════════════════════
                CTA / CLOSING
            ═══════════════════════════════════════════════ */}
            <section className="w-full max-w-4xl mx-auto mb-20 relative z-20 text-center">
                <Reveal from="below" distance={30}>
                    <div className="bg-slate-950 rounded-[3rem] p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
                        <Aurora opacity={0.3} />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 tracking-tight">Start building today.</h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                                Copy-paste ownership. No lock-in. MIT licensed. Works with Next.js, Vite, Remix, and Astro.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Magnetic strength={0.3} radius={80}>
                                    <button
                                        onClick={() => onNavigate('components')}
                                        className="bg-teal-500 text-white px-8 py-4 rounded-full font-medium text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors focus:outline-none"
                                    >
                                        Browse Primitives
                                    </button>
                                </Magnetic>
                                <HoverScale hoverScale={1.04} pressScale={0.96}>
                                    <button
                                        onClick={() => onNavigate('docs')}
                                        className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-medium text-sm hover:bg-white/20 transition-colors backdrop-blur-sm focus:outline-none"
                                    >
                                        Documentation
                                    </button>
                                </HoverScale>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ═══════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════ */}
            <footer className="w-full max-w-6xl mx-auto pt-16 pb-8 border-t border-slate-200/60 relative z-20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-slate-900 rounded-[4px] flex items-center justify-center">
                            <div className="w-2 h-2 bg-teal-400 rounded-[2px]" />
                        </div>
                        <span className="font-display font-semibold text-slate-600">FLUX UI</span>
                        <span className="text-slate-300 mx-2">·</span>
                        <span>Motion is the message.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => onNavigate('components')}>Primitives</span>
                        <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => onNavigate('showcase')}>Showcase</span>
                        <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => onNavigate('docs')}>Docs</span>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
