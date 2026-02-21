import { useState } from 'react';
import { FluxProvider } from './index';

// Primitives for generic App level UI
import { Reveal } from './primitives/01-reveal';
import { FollowCursor } from './primitives/18-follow-cursor';
import { GridPattern } from './primitives/34-grid-pattern';
import { Particles } from './primitives/33-particles';
import { Noise } from './primitives/35-noise';

// Views
import { HomeView } from './pages/HomeView';
import { ComponentsView } from './pages/ComponentsView';
import { ShowcaseView } from './pages/ShowcaseView';
import { DocsView } from './pages/DocsView';

function App() {
  const [motionLevel, setMotionLevel] = useState<'full' | 'reduced' | 'none'>('full');
  const [activeTab, setActiveTab] = useState<'home' | 'components' | 'showcase' | 'docs'>('home');

  return (
    <FluxProvider motionLevel={motionLevel}>
      {/* 
        Tambo Aesthetic: 
        Light mode mostly, but with deep contrast, large typography, 
        mint/teal accents, soft glows, and lots of rounded geometry.
      */}
      <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-teal-200/60 overflow-x-hidden relative flex flex-col">

        {/* Soft floating background glow attached to the top — use opacity gradient instead of massive blur for GPU perf */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-teal-100/20 blur-[40px] rounded-full pointer-events-none z-0" />

        {/* Master Background Textures */}
        <GridPattern size={32} color="#000" fade={false} style={{ opacity: 0.03 }} />
        <Particles quantity={40} staticity={30} ease={50} color="#0d9488" />
        <Noise opacity={0.04} />

        {/* Ambient Cursor Follower */}
        <FollowCursor lag={0.15}>
          <div className="w-14 h-14 rounded-full border border-teal-500/40 bg-teal-400/10 pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-2 h-2 bg-teal-500 rounded-full" />
          </div>
        </FollowCursor>

        {/* Floating Glass Navigation */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
          <Reveal from="above" delay={0.1} distance={20}>
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg px-6 py-3 rounded-full flex items-center gap-10">
              <button
                onClick={() => setActiveTab('home')}
                className="font-display font-bold text-xl tracking-tight flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              >
                <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center shadow-inner pt-px">
                  <div className="w-2.5 h-2.5 bg-teal-400 rounded-[3px] shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                </div>
                FLUX
              </button>

              <div className="flex gap-2 text-sm font-medium text-slate-500 relative bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                {(['components', 'showcase', 'docs'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-2 rounded-full transition-all duration-300 z-10 capitalize focus:outline-none ${activeTab === tab ? 'text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    {activeTab === tab && (
                      <div className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-slate-200/50" />
                    )}
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="w-2 h-2 rounded-full hidden md:block bg-teal-500 animate-pulse" />
                <select
                  value={motionLevel}
                  onChange={(e) => setMotionLevel(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold tracking-wider uppercase text-slate-400 outline-none cursor-pointer focus:outline-none"
                >
                  <option value="full">Motion: Full</option>
                  <option value="reduced">Motion: Reduced</option>
                  <option value="none">Motion: None</option>
                </select>
              </div>
            </div>
          </Reveal>
        </nav>

        <main className="pt-48 pb-32 px-6 w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-start min-h-screen">
          {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
          {activeTab === 'components' && <ComponentsView />}
          {activeTab === 'showcase' && <ShowcaseView />}
          {activeTab === 'docs' && <DocsView />}
        </main>
      </div>
    </FluxProvider>
  );
}

export default App;
