import { useEffect, useRef, useMemo, useState, type CSSProperties } from "react";
import { useLocation } from "wouter";
import { motion, useInView } from "framer-motion";
import { 
  Menu, X, ScanSearch, Flame, Activity, Brain, Zap, BarChart3, 
  Camera, ChevronRight, Activity as ActivityIcon 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

// Inline SVG Emblem Component
const LogoEmblem = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 5L93.3013 25V75L50 95L6.69873 75V25L50 5Z" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5"/>
    <path d="M50 15L84.641 35V65L50 85L15.359 65V35L50 15Z" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.8"/>
    <circle cx="50" cy="50" r="15" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2"/>
    <path d="M50 30V70M30 50H70" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ParticleField = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      // Seeded random-like generation based on index
      const seed1 = (i * 137) % 100;
      const seed2 = (i * 251) % 100;
      const seed3 = (i * 367) % 100;
      
      const left = seed1;
      const top = seed2;
      const size = (seed3 % 3) + 1;
      const duration = 4 + (seed1 % 8);
      const delay = (seed2 % 5);
      
      return {
        id: i,
        left: `${left}%`,
        top: `${top}%`,
        size: `${size}px`,
        duration,
        delay,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-emerald-400 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [(p.id % 2 === 0 ? -30 : 30), (p.id % 2 === 0 ? 30 : -30)],
            y: [(p.id % 3 === 0 ? -40 : 40), (p.id % 3 === 0 ? 40 : -40)],
            opacity: [0.1, 0.6, 0.1]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default function Landing() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseGlowRef.current && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseGlowRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (hero) hero.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const mockupRef = useRef(null);
  const mockupInView = useInView(mockupRef, { once: true, amount: 0.2 });

  const chartData = [
    { name: 'Mon', cals: 1800 },
    { name: 'Tue', cals: 2100 },
    { name: 'Wed', cals: 1650 },
    { name: 'Thu', cals: 1900 },
    { name: 'Fri', cals: 2200 },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
        className="fixed top-0 inset-x-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoEmblem className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-white">NutriScan AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              How It Works
            </button>
            <button 
              onClick={() => navigate("/scanner")}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full px-6 py-2.5 text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:scale-105 transition-all"
            >
              Get Started →
            </button>
          </div>

          <button className="md:hidden text-white/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[100dvh] pt-20 flex flex-col lg:flex-row items-center justify-center overflow-hidden">
        
        <ParticleField />
        
        {/* Glow Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/12 rounded-full blur-3xl pointer-events-none" />
        {/* Vertical light beams */}
        <div className="absolute top-0 left-[25%] w-px h-full bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 pointer-events-none" />
        <div className="absolute top-0 left-[75%] w-px h-full bg-gradient-to-b from-cyan-500/0 via-cyan-500/15 to-cyan-500/0 pointer-events-none" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 pointer-events-none" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

        {/* Mouse Glow */}
        <div 
          ref={mouseGlowRef}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)] pointer-events-none opacity-50 transition-opacity duration-300"
          style={{ willChange: 'transform' }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10 py-20 lg:py-0">
          
          {/* LEFT: 3D Orbital Logo */}
          <div className="relative flex items-center justify-center order-2 lg:order-1" style={{ height: "480px" }}>
            {/* Pulsing core glow */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-40 h-40 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none z-0"
            />

            {/* Outer orbital ring + dots — positioned absolutely from the center */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, ease: "linear", repeat: Infinity }}
              style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", border: "1px dashed rgba(34,197,94,0.3)" }}
            >
              <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 18px 6px rgba(59,130,246,0.7)" }} />
              <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 18px 6px rgba(34,197,94,0.7)" }} />
              <div style={{ position: "absolute", top: "50%", left: -8, transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 12px 4px rgba(168,85,247,0.6)" }} />
            </motion.div>

            {/* Middle orbital ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 9, ease: "linear", repeat: Infinity }}
              style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(6,182,212,0.35)" }}
            >
              <div style={{ position: "absolute", top: "50%", left: -8, transform: "translateY(-50%)", width: 14, height: 14, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 16px 5px rgba(6,182,212,0.7)" }} />
              <div style={{ position: "absolute", top: "50%", right: -8, transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 12px 4px rgba(6,182,212,0.5)" }} />
              <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: "#67e8f9", boxShadow: "0 0 8px 3px rgba(6,182,212,0.4)" }} />
            </motion.div>

            {/* Inner ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
              style={{ position: "absolute", width: 190, height: 190, borderRadius: "50%", border: "2px solid rgba(34,197,94,0.45)", boxShadow: "0 0 25px rgba(34,197,94,0.08), inset 0 0 25px rgba(34,197,94,0.04)" }}
            >
              <div style={{ position: "absolute", top: "13%", right: "13%", width: 14, height: 14, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 16px 5px rgba(34,197,94,0.8)" }} />
              <div style={{ position: "absolute", bottom: "13%", left: "13%", width: 9, height: 9, borderRadius: "50%", background: "#86efac", boxShadow: "0 0 10px 3px rgba(34,197,94,0.5)" }} />
            </motion.div>

            {/* Floating core logo */}
            <motion.div
              animate={{ y: [-14, 14, -14] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              style={{ position: "relative", zIndex: 10 }}
            >
              <LogoEmblem
                className="w-28 h-28"
                style={{ filter: "drop-shadow(0 0 18px rgba(34,197,94,0.9)) drop-shadow(0 0 45px rgba(34,197,94,0.45)) drop-shadow(0 0 70px rgba(6,182,212,0.3))" }}
              />
            </motion.div>

            {/* Label + holographic platform */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.2 }}
              style={{ position: "absolute", bottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
            >
              <span className="tracking-[0.5em] text-xs font-bold text-emerald-400/60 uppercase">NUTRISCAN AI</span>
              <div className="w-64 h-5 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-blue-500/30 blur-2xl rounded-full" />
            </motion.div>
          </div>

          {/* RIGHT: Typography & CTA */}
          <div className="flex flex-col items-start text-left order-1 lg:order-2 z-10 pt-10 lg:pt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6 uppercase tracking-wider"
            >
              ✦ AI-Powered Nutrition Intelligence
            </motion.div>
            
            <h1 className="font-black tracking-tight leading-[0.9] mb-8" style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)" }}>
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                NUTRISCAN
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="block"
                style={{ background: "linear-gradient(90deg, #4ade80, #22d3ee, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}
              >
                AI
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-white/60 font-light max-w-lg mb-4"
            >
              AI-Powered Smart Nutrition Analysis & Health Intelligence Platform
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-white/40 max-w-lg mb-10 leading-relaxed"
            >
              Simply upload a photo of your meal. Our advanced computer vision instantly identifies the food, calculates precise macronutrients, and provides personalized health insights. No more manual logging.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => navigate("/scanner")}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full px-8 py-4 font-bold text-lg hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2 group"
              >
                Get Started <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="border border-white/20 bg-white/5 hover:bg-white/10 rounded-full px-8 py-4 font-semibold text-white/80 hover:text-white transition-all backdrop-blur-md"
              >
                Explore Features
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <section className="w-full bg-white/5 backdrop-blur-md border-y border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { val: "10,000+", label: "Meals Analyzed" },
              { val: "98%", label: "Accuracy Rate" },
              { val: "50+", label: "Nutrients Tracked" },
              { val: "Instant", label: "AI Analysis" },
            ].map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-center py-2 md:py-0 w-full text-center">
                <span className="text-3xl font-black text-emerald-400 mb-1">{stat.val}</span>
                <span className="text-white/50 text-sm font-medium tracking-wider uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" ref={featuresRef} className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              <span className="block text-white">INTELLIGENT NUTRITION</span>
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">FEATURES</span>
            </h2>
            <p className="text-xl text-white/50 font-light">Everything you need to understand your food</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ScanSearch, title: "Food Recognition", desc: "AI computer vision instantly identifies any food with high precision" },
              { icon: Flame, title: "Calorie Estimation", desc: "Accurate calorie counts from a single photo, no manual logging needed" },
              { icon: Activity, title: "Macronutrient Analysis", desc: "Complete protein, carbs, fat, and fiber breakdown per serving" },
              { icon: Brain, title: "AI Health Insights", desc: "Personalized health scoring and pattern recognition across all meals" },
              { icon: Zap, title: "Smart Recommendations", desc: "Tailored dietary advice based on your unique nutritional profile" },
              { icon: BarChart3, title: "Nutrition Analytics", desc: "Visual trends, weekly reports, and long-term health progress tracking" },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/3 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:border-emerald-500/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <feat.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-xl mb-3">{feat.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD MOCKUP */}
      <section className="py-20 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="text-white">SEE IT IN </span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">ACTION</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6" ref={mockupRef}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={mockupInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#0a0f1c]/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 flex flex-col md:flex-row h-[600px]"
          >
            {/* Sidebar Mockup */}
            <div className="w-64 border-r border-white/10 p-6 hidden md:flex flex-col bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-10">
                <LogoEmblem className="w-6 h-6" />
                <span className="font-bold text-lg">NutriScan AI</span>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 border border-emerald-500/30">
                  <Camera className="w-4 h-4" /> Scanner
                </div>
                {['History', 'Analytics', 'AI Insights', 'Settings'].map((item) => (
                  <div key={item} className="text-white/50 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-white/10" /> {item}
                  </div>
                ))}
              </div>
              <div className="mt-auto bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="rotate-[-90deg]">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="100" strokeDashoffset="40" strokeLinecap="round" />
                </svg>
                <div>
                  <div className="text-xs text-white/50">Daily Goal</div>
                  <div className="text-sm font-bold text-white">1200 / 2000</div>
                </div>
              </div>
            </div>

            {/* Content Mockup */}
            <div className="flex-1 p-6 sm:p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMEgyMFYyMEgwWiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Result Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-2">Scan Result</div>
                    <div className="text-2xl font-bold text-white mb-1">Avocado Toast</div>
                    <div className="text-5xl font-black text-emerald-400 mb-6">620 <span className="text-xl text-white/50 font-normal">kcal</span></div>
                  </div>
                  <div className="flex gap-2 mb-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">P: 18g</div>
                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium">C: 45g</div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">F: 32g</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                    <ActivityIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-white/80">Health Score</span>
                    <span className="ml-auto font-bold text-emerald-400">78 / 100</span>
                  </div>
                </div>

                {/* Chart Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                  <div className="text-sm font-bold text-white mb-6">Weekly Calories</div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Bar dataKey="cals" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 4 ? '#22c55e' : 'rgba(255,255,255,0.2)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Nutrients Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hidden lg:block">
                  <div className="text-sm font-bold text-white mb-4">Micronutrients</div>
                  <div className="space-y-3">
                    {[
                      { name: "Protein", val: 72, color: "bg-blue-500" },
                      { name: "Fiber", val: 45, color: "bg-emerald-500" },
                      { name: "Vitamin C", val: 88, color: "bg-orange-500" },
                      { name: "Iron", val: 34, color: "bg-purple-500" },
                    ].map(n => (
                      <div key={n.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70">{n.name}</span>
                          <span className="text-white">{n.val}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${n.color}`} style={{ width: `${n.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-2xl p-6 hidden lg:block">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">AI Insights</span>
                  </div>
                  <div className="space-y-3 text-sm text-white/70">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <p>Great source of healthy monounsaturated fats from avocado.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <p>Consider adding an egg for a complete protein profile.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <p>Sodium content is optimal (12% of daily value).</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 relative z-10 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">HOW IT WORKS</h2>
            <p className="text-white/50">Three simple steps to smarter nutrition</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent border-dashed" />
            
            {[
              { num: "01", title: "Upload Photo", desc: "Snap a picture of your meal", icon: Camera },
              { num: "02", title: "AI Analysis", desc: "Our engine identifies the food", icon: Brain },
              { num: "03", title: "Get Results", desc: "View detailed macro breakdown", icon: BarChart3 },
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#020617] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.15)] mb-6 relative">
                  <step.icon className="w-6 h-6 text-emerald-400" />
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-[#020617] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-20 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="block text-white mb-2">READY TO TRANSFORM</span>
            <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">YOUR NUTRITION?</span>
          </h2>
          <p className="text-lg text-white/60 mb-10">Start your AI-powered nutrition journey today. Better insights, better health.</p>
          
          <button 
            onClick={() => navigate("/scanner")}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full px-10 py-5 font-bold text-xl hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all flex items-center justify-center gap-2 mx-auto group mb-6"
          >
            Start Scanning Now <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-white/40">No account required • Instant analysis • Powered by Claude AI</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#020617] border-t border-white/10 pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <LogoEmblem className="w-6 h-6" />
              <span className="font-bold text-xl">NutriScan AI</span>
            </div>
            <p className="text-white/40 text-sm">AI-Powered Nutrition Intelligence</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium backdrop-blur">
              Powered by Claude AI
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium backdrop-blur">
              Built on Replit
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left text-white/30 text-xs flex flex-col md:flex-row justify-between pt-8 border-t border-white/5">
          <p>© 2025 NutriScan AI • Powered by Anthropic Claude</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
