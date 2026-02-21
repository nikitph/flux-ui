import { useState } from 'react';
import {
    Aurora, MeshGradient, Tilt, Reveal, GridPattern, StreamingText,
    CountUp, Magnetic, HoverScale, Stagger, TextReveal, Dock,
    Particles, Noise, Spotlight, Marquee, MorphText,
    AIMessage, TypingIndicator
} from '../index';

export function ShowcaseView() {
    const [pricingAnnual, setPricingAnnual] = useState(false);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-20">
            {/* Page Header */}
            <div className="text-center border-b border-slate-200 pb-12">
                <TextReveal tag="h2" by="word" className="text-5xl md:text-6xl font-display font-medium mb-6 text-slate-900 tracking-tight">
                    Composition Showcase
                </TextReveal>
                <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
                    Real-world patterns built by composing FLUX primitives. Each demo uses multiple primitives working together.
                </p>
            </div>

            {/* ═══ SHOWCASE 1: Immersive Hero ═══ */}
            <section>
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wider">Pattern 01</span>
                    <h3 className="text-2xl font-display font-medium text-slate-900 mt-4">Immersive Hero Section</h3>
                    <p className="text-slate-500 mt-1">Aurora + Particles + Tilt + TextReveal + Stagger + Magnetic</p>
                </div>
                <Tilt maxTilt={2} className="w-full h-[580px] bg-slate-950 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative">
                    <Aurora opacity={0.5} />
                    <Particles quantity={25} color="#2dd4bf" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:28px_28px]" />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center text-white">
                        <Reveal from="below" delay={0.1} distance={20}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                                <span className="text-sm text-slate-300 font-medium">Launching Q2 2026</span>
                            </div>
                        </Reveal>
                        <TextReveal tag="h3" by="word" stagger={0.06} className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight drop-shadow-2xl leading-[1.05]">
                            The future of interface design is motion.
                        </TextReveal>
                        <Reveal from="below" delay={0.5} distance={30}>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                                Build interfaces that respond, breathe, and communicate through physics-based animation.
                            </p>
                        </Reveal>
                        <Stagger interval={0.1} className="flex items-center gap-4">
                            <Magnetic strength={0.3} radius={80}>
                                <button className="bg-teal-500 text-white px-8 py-4 rounded-full font-medium text-sm shadow-lg shadow-teal-500/30 hover:bg-teal-400 transition-colors">
                                    Get Early Access
                                </button>
                            </Magnetic>
                            <HoverScale hoverScale={1.04} pressScale={0.96}>
                                <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-medium text-sm backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    Watch Demo
                                </button>
                            </HoverScale>
                        </Stagger>
                    </div>
                </Tilt>
            </section>

            {/* ═══ SHOWCASE 2: AI Chat Interface ═══ */}
            <section>
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wider">Pattern 02</span>
                    <h3 className="text-2xl font-display font-medium text-slate-900 mt-4">Generative AI Chat</h3>
                    <p className="text-slate-500 mt-1">StreamingText + AIMessage + TypingIndicator + Reveal + MorphText</p>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-300 border border-red-400/30" />
                            <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400/30" />
                            <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400/30" />
                        </div>
                        <div className="px-6 py-1.5 bg-white rounded-lg text-xs font-mono text-slate-400 border border-slate-200 shadow-sm">app.flux-ui.dev/chat</div>
                        <div className="w-20" />
                    </div>
                    <div className="p-8 md:p-12 space-y-6 min-h-[380px] relative">
                        <GridPattern size={24} fade />
                        <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
                            <AIMessage role="assistant">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-4 text-[15px] text-slate-700 leading-relaxed shadow-sm">
                                    <StreamingText text="Hello! I'm your FLUX UI assistant. I can help you compose motion primitives, configure physics presets, and build beautiful interactive interfaces." speed={25} />
                                </div>
                            </AIMessage>
                            <AIMessage role="user" delay={2.5}>
                                <div className="bg-slate-900 text-white rounded-2xl rounded-br-sm px-5 py-3.5 text-[15px] ml-auto w-max shadow-md flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]" />
                                    Build a pricing page with animated numbers
                                </div>
                            </AIMessage>
                            <AIMessage role="assistant" delay={3.5}>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-4 text-[15px] text-slate-700 leading-relaxed shadow-sm">
                                    <StreamingText text="I'll compose CountUp for animated pricing, MorphText for plan name transitions, and Stagger for the feature list reveal. Here's the implementation..." speed={20} />
                                </div>
                            </AIMessage>
                            <div className="flex items-center gap-2.5 pl-1">
                                <TypingIndicator />
                                <MorphText texts={["Thinking...", "Composing...", "Building..."]} className="text-xs text-slate-400 font-medium" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SHOWCASE 3: Pricing Table ═══ */}
            <section>
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wider">Pattern 03</span>
                    <h3 className="text-2xl font-display font-medium text-slate-900 mt-4">Animated Pricing</h3>
                    <p className="text-slate-500 mt-1">CountUp + HoverScale + Stagger + Spotlight + Reveal</p>
                </div>
                <div className="text-center mb-10">
                    <div className="inline-flex bg-slate-100 rounded-full p-1 border border-slate-200">
                        <button onClick={() => setPricingAnnual(false)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!pricingAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Monthly</button>
                        <button onClick={() => setPricingAnnual(true)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${pricingAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Annual <span className="text-teal-500 text-xs font-bold">-20%</span></button>
                    </div>
                </div>
                <Stagger interval={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Starter", price: 0, features: ["5 primitives", "Basic physics", "Community support"] },
                        { name: "Pro", price: 29, features: ["All 40 primitives", "All physics presets", "Priority support", "Figma kit"], featured: true },
                        { name: "Team", price: 79, features: ["Everything in Pro", "Custom presets", "Dedicated support", "SSO access", "SLA"] },
                    ].map((plan) => (
                        <Spotlight key={plan.name} size={300} color={plan.featured ? "rgba(20,184,166,0.08)" : "rgba(0,0,0,0.03)"} mode="glow">
                            <HoverScale hoverScale={plan.featured ? 1.02 : 1.01} pressScale={0.99}>
                                <div className={`rounded-[2rem] p-8 h-full flex flex-col ${plan.featured ? 'bg-slate-950 text-white border-2 border-teal-500/30 shadow-xl shadow-teal-500/10' : 'bg-white border border-slate-200/60 shadow-lg'}`}>
                                    {plan.featured && <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">Most Popular</div>}
                                    <h4 className={`text-2xl font-display font-medium mb-6 ${plan.featured ? '' : 'text-slate-900'}`}>{plan.name}</h4>
                                    <div className="mb-8">
                                        <span className={`text-5xl font-display font-bold tracking-tight ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                                            $<CountUp to={pricingAnnual ? Math.round(plan.price * 0.8) : plan.price} duration={1.5} />
                                        </span>
                                        <span className={`text-sm ml-1 ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                                    </div>
                                    <div className="space-y-3 mb-8 flex-1">
                                        {plan.features.map((f, i) => (
                                            <div key={i} className={`flex items-center gap-3 text-sm ${plan.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${plan.featured ? 'bg-teal-400' : 'bg-teal-500'}`} />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                    <button className={`w-full py-3.5 rounded-full font-medium text-sm transition-colors ${plan.featured ? 'bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                        {plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                                    </button>
                                </div>
                            </HoverScale>
                        </Spotlight>
                    ))}
                </Stagger>
            </section>

            {/* ═══ SHOWCASE 4: Dashboard Stats ═══ */}
            <section>
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wider">Pattern 04</span>
                    <h3 className="text-2xl font-display font-medium text-slate-900 mt-4">Dashboard Analytics</h3>
                    <p className="text-slate-500 mt-1">CountUp + Stagger + Tilt + Spotlight</p>
                </div>
                <Stagger interval={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { label: "Total Revenue", value: 48250, prefix: "$", color: "from-teal-500 to-emerald-500" },
                        { label: "Active Users", value: 12847, color: "from-indigo-500 to-purple-500" },
                        { label: "Conversion", value: 4.2, suffix: "%", color: "from-orange-500 to-amber-500", decimals: 1 },
                        { label: "Uptime", value: 99.99, suffix: "%", color: "from-pink-500 to-rose-500", decimals: 2 },
                    ].map((stat, i) => (
                        <Tilt key={i} maxTilt={4}>
                            <Spotlight size={200} color="rgba(20,184,166,0.04)" mode="glow">
                                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl translate-x-8 -translate-y-8`} />
                                    <div className="relative z-10">
                                        <div className="text-sm text-slate-500 font-medium mb-3">{stat.label}</div>
                                        <div className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                                            {stat.prefix || ''}<CountUp to={stat.value} decimals={stat.decimals || 0} duration={2.5} separator="," />{stat.suffix || ''}
                                        </div>
                                    </div>
                                </div>
                            </Spotlight>
                        </Tilt>
                    ))}
                </Stagger>
            </section>

            {/* ═══ SHOWCASE 5: Feature Bento ═══ */}
            <section>
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wider">Pattern 05</span>
                    <h3 className="text-2xl font-display font-medium text-slate-900 mt-4">Feature Bento Grid</h3>
                    <p className="text-slate-500 mt-1">Tilt + Spotlight + Aurora + MeshGradient + Noise + GridPattern</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Spotlight size={300} color="rgba(20,184,166,0.06)" mode="glow" className="md:col-span-2">
                        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-lg p-10 h-full relative overflow-hidden">
                            <MeshGradient speed={6} style={{ opacity: 0.2 }} />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-slate-900 rounded-xl mb-5 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                </div>
                                <h4 className="text-2xl font-display font-medium text-slate-900 mb-3">Physics-Based Animation</h4>
                                <p className="text-slate-500 leading-relaxed max-w-lg">Seven spring presets cover every use case. From snappy 500/30/0.5 micro-interactions to cinematic 50/12/2 reveals.</p>
                            </div>
                        </div>
                    </Spotlight>
                    <Tilt maxTilt={4}>
                        <div className="bg-slate-950 rounded-[2rem] border border-slate-800 p-8 shadow-xl overflow-hidden relative h-full min-h-[200px]">
                            <Aurora opacity={0.4} />
                            <div className="relative z-10">
                                <h4 className="text-lg font-display font-medium text-white mb-2">Dark Mode</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">Beautiful on dark surfaces.</p>
                            </div>
                        </div>
                    </Tilt>
                    <Tilt maxTilt={4}>
                        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-lg overflow-hidden relative h-full">
                            <Noise opacity={0.08} />
                            <GridPattern size={20} fade />
                            <div className="relative z-10">
                                <h4 className="text-lg font-display font-medium text-slate-900 mb-2">Texture Layering</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Noise + Grid = tactile surfaces.</p>
                            </div>
                        </div>
                    </Tilt>
                    <Tilt maxTilt={4} className="md:col-span-2">
                        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-lg overflow-hidden relative h-full">
                            <div className="relative z-10">
                                <h4 className="text-lg font-display font-medium text-slate-900 mb-4">Interactive Dock</h4>
                                <div className="flex justify-center">
                                    <Dock magnification={1.3} distance={100} gap={8}>
                                        {["Home", "Search", "Mail", "Music", "Settings"].map((app) => (
                                            <Dock.Item key={app} label={app}>
                                                <div className="w-11 h-11 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-xs font-bold text-slate-400 cursor-pointer">{app[0]}</div>
                                            </Dock.Item>
                                        ))}
                                    </Dock>
                                </div>
                            </div>
                        </div>
                    </Tilt>
                </div>
            </section>

            {/* ═══ SHOWCASE 6: Social Proof Marquee ═══ */}
            <section>
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase tracking-wider">Pattern 06</span>
                    <h3 className="text-2xl font-display font-medium text-slate-900 mt-4">Social Proof Strip</h3>
                    <p className="text-slate-500 mt-1">Marquee + HoverScale + Reveal</p>
                </div>
                <Reveal from="below">
                    <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-lg py-10 overflow-hidden">
                        <p className="text-center text-sm text-slate-400 font-medium uppercase tracking-wider mb-8">Trusted by teams building the future</p>
                        <Marquee speed={25} pauseOnHover gradientWidth={80} gradientColor="white">
                            {["Vercel", "Stripe", "Linear", "Notion", "Figma", "Supabase", "Railway", "Resend"].map((brand, i) => (
                                <HoverScale key={i} hoverScale={1.05}>
                                    <div className="mx-6 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100 text-lg font-display font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-default">
                                        {brand}
                                    </div>
                                </HoverScale>
                            ))}
                        </Marquee>
                    </div>
                </Reveal>
            </section>

            {/* Bottom */}
            <div className="text-center pt-8 pb-4 border-t border-slate-100">
                <p className="text-sm text-slate-400">
                    Each showcase composes multiple FLUX primitives. View the <span className="text-slate-600 font-medium">Components</span> page to explore all 40 individually.
                </p>
            </div>
        </div>
    );
}
