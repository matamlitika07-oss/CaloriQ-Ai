import { useEffect, useRef, useMemo, useState, type CSSProperties } from "react";
import { useLocation } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Menu, X, ScanSearch, Flame, Activity, Brain, Zap, BarChart3,
  Camera, ChevronRight, Star, Shield, TrendingUp, Leaf,
  Clock, Award, Database, Smartphone, Twitter, Github, Instagram,
  ArrowRight, CheckCircle2, Sparkles, Heart, Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie, RadialBarChart, RadialBar } from "recharts";

const LogoEmblem = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 5L93.3013 25V75L50 95L6.69873 75V25L50 5Z" stroke="#39FF88" strokeWidth="2" strokeOpacity="0.5"/>
    <path d="M50 15L84.641 35V65L50 85L15.359 65V35L50 15Z" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.8"/>
    <circle cx="50" cy="50" r="15" fill="#39FF88" fillOpacity="0.2" stroke="#39FF88" strokeWidth="2"/>
    <path d="M50 30V70M30 50H70" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ParticleField = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const seed1 = (i * 137) % 100;
      const seed2 = (i * 251) % 100;
      const seed3 = (i * 367) % 100;
      return {
        id: i,
        left: `${seed1}%`,
        top: `${seed2}%`,
        size: `${(seed3 % 3) + 1}px`,
        duration: 4 + (seed1 % 8),
        delay: seed2 % 5,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left, top: p.top, width: p.size, height: p.size,
            background: p.id % 3 === 0 ? "#39FF88" : p.id % 3 === 1 ? "#06b6d4" : "#4ade80",
          }}
          animate={{
            x: [p.id % 2 === 0 ? -25 : 25, p.id % 2 === 0 ? 25 : -25],
            y: [p.id % 3 === 0 ? -35 : 35, p.id % 3 === 0 ? 35 : -35],
            opacity: [0.08, 0.5, 0.08]
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
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
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const howItWorksRef = useRef(null);
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 });
  const dashboardRef = useRef(null);
  const dashboardInView = useInView(dashboardRef, { once: true, amount: 0.1 });
  const mobileRef = useRef(null);
  const mobileInView = useInView(mobileRef, { once: true, amount: 0.2 });

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
    if (hero) hero.addEventListener("mousemove", handleMouseMove);
    return () => { if (hero) hero.removeEventListener("mousemove", handleMouseMove); };
  }, []);

  const chartData = [
    { name: 'Mon', cals: 1800 },
    { name: 'Tue', cals: 2100 },
    { name: 'Wed', cals: 1650 },
    { name: 'Thu', cals: 1900 },
    { name: 'Fri', cals: 2200 },
    { name: 'Sat', cals: 1750 },
    { name: 'Sun', cals: 1600 },
  ];

  const macroData = [
    { name: "Protein", value: 28, fill: "#06b6d4" },
    { name: "Carbs", value: 45, fill: "#f97316" },
    { name: "Fats", value: 22, fill: "#a855f7" },
    { name: "Fiber", value: 12, fill: "#39FF88" },
  ];

  const navLinks = [
    { label: "Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Features", action: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "How It Works", action: () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Analytics", action: () => navigate("/analytics") },
    { label: "AI Insights", action: () => navigate("/ai-insights") },
    { label: "Contact", action: () => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" }) },
  ];

  return (
    <div className="min-h-[100dvh] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30" style={{ background: "linear-gradient(135deg, #020617 0%, #021a0e 50%, #020617 100%)" }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/5"
        style={{ background: "rgba(2,6,23,0.85)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="relative">
              <LogoEmblem className="w-9 h-9" style={{ filter: "drop-shadow(0 0 8px rgba(57,255,136,0.7))" }} />
              <div className="absolute inset-0 bg-[#39FF88]/20 rounded-full blur-md -z-10" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">CaloriQ <span style={{ color: "#39FF88" }}>AI</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-white/60 hover:text-white transition-colors text-sm font-medium hover:text-[#39FF88]"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("/scanner")}
              className="text-white/70 hover:text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/scanner")}
              className="text-sm font-bold px-6 py-2.5 rounded-full transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #39FF88, #06b6d4)", color: "#020617", boxShadow: "0 0 20px rgba(57,255,136,0.35)" }}
            >
              Get Started
            </button>
          </div>

          <button className="lg:hidden text-white/70 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 overflow-hidden"
              style={{ background: "rgba(2,6,23,0.98)" }}
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => { link.action(); setMobileMenuOpen(false); }}
                    className="text-white/70 hover:text-[#39FF88] text-sm font-medium py-2 text-left transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="flex gap-3 pt-2 border-t border-white/10">
                  <button onClick={() => navigate("/scanner")} className="flex-1 text-sm font-bold py-3 rounded-full border border-white/20 text-white/70">Login</button>
                  <button onClick={() => navigate("/scanner")} className="flex-1 text-sm font-bold py-3 rounded-full" style={{ background: "linear-gradient(135deg, #39FF88, #06b6d4)", color: "#020617" }}>Get Started</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO SECTION — CINEMATIC FOOD PHOTOGRAPHY ── */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">

        {/* === FULL-SCREEN REALISTIC FOOD PHOTOGRAPHY === */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=85&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.7) saturate(1.15)" }}
          />
          {/* Layered cinematic overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.35) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.4) 40%, transparent 70%)" }} />
          {/* Soft emerald ambient — not neon */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 15% 55%, rgba(52,211,153,0.07) 0%, transparent 55%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 70% at 85% 25%, rgba(6,182,212,0.04) 0%, transparent 55%)" }} />
          {/* Vignette */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.7) 100%)" }} />
        </div>

        {/* Particles float above the photo */}
        <ParticleField />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(57,255,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,136,0.025) 1px, transparent 1px)", backgroundSize: "4rem 4rem", maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #000 20%, transparent 100%)" }} />

        {/* Animated scan line — subtle */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
          className="absolute left-0 right-0 h-px z-[2] pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.2) 30%, rgba(52,211,153,0.45) 50%, rgba(52,211,153,0.2) 70%, transparent 100%)" }}
        />

        {/* Mouse interactive glow — soft */}
        <div
          ref={mouseGlowRef}
          className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[2] opacity-15"
          style={{ background: "radial-gradient(circle at center, rgba(52,211,153,0.12) 0%, transparent 65%)", willChange: "transform" }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-10 xl:gap-14 items-center z-10 pt-36 pb-24 lg:pt-28 lg:pb-16">

          {/* LEFT: Content floating above photo */}
          <div className="flex flex-col items-start text-left order-1">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-7"
              style={{ borderColor: "rgba(57,255,136,0.4)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)", color: "#39FF88" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold uppercase tracking-widest">AI-Powered Nutrition Intelligence</span>
            </motion.div>

            <h1 className="font-black tracking-tight leading-[0.88] mb-8" style={{ fontSize: "clamp(3.4rem, 7.5vw, 6.5rem)" }}>
              <motion.span
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="block font-light tracking-[0.18em] uppercase text-white/55"
                style={{ fontSize: "0.38em", letterSpacing: "0.22em", marginBottom: "0.35em", textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
              >AI-Powered</motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
                className="block text-white"
                style={{ textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}
              >AI</motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.36, ease: "easeOut" }}
                className="block"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 40%, #6ee7b7 80%, #5eead4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 2px 20px rgba(110,231,183,0.18))"
                }}
              >Wellness</motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="text-lg max-w-md mb-9 leading-relaxed font-light"
              style={{ color: "rgba(255,255,255,0.58)", textShadow: "0 1px 20px rgba(0,0,0,0.9)", letterSpacing: "0.01em" }}
            >
              Advanced nutrition intelligence designed for healthier living.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.52 }}
              className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto"
            >
              <button
                onClick={() => navigate("/scanner")}
                className="flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-sm transition-all hover:scale-[1.03] group"
                style={{
                  background: "linear-gradient(135deg, #34d399 0%, #06b6d4 100%)",
                  color: "#020617",
                  boxShadow: "0 4px 20px rgba(52,211,153,0.25), 0 8px 30px rgba(0,0,0,0.4)"
                }}
              >
                <Camera className="w-4 h-4" /> Start Scanning
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-medium text-sm text-white/70 hover:text-white transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
              >
                Explore Features
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍⚕️", "🏃", "👨‍🍳"].map((emoji, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm" style={{ borderColor: "#39FF88", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>{emoji}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#39FF88] text-[#39FF88]" />)}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
                  <span className="text-white font-bold">10,000+</span> meals analyzed
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Floating glassmorphism nutrition analytics panel */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="order-2 relative"
          >
            {/* Ambient glow behind card — soft */}
            <div className="absolute inset-0 rounded-3xl blur-3xl scale-90 -z-10 opacity-30" style={{ background: "radial-gradient(ellipse at center, rgba(52,211,153,0.18) 0%, rgba(6,182,212,0.08) 60%, transparent 100%)" }} />

            {/* Main glass card */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "rgba(12,18,20,0.45)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
              }}
            >
              {/* Inner top shimmer */}
              <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-15" style={{ background: "rgba(52,211,153,0.2)" }} />

              {/* Header row */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#34d399" }}
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">AI Scan Complete</span>
                  </div>
                  <div className="text-base font-bold text-white/90">Grilled Chicken Bowl</div>
                  <div className="text-[10px] text-white/30 mt-0.5">Analyzed just now · 1 serving</div>
                </div>
                {/* Health score ring — smaller */}
                <div className="relative w-13 h-13 shrink-0" style={{ width: 52, height: 52 }}>
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                    <motion.circle
                      cx="32" cy="32" r="26" fill="none" stroke="#34d399" strokeWidth="5"
                      strokeDasharray="163"
                      initial={{ strokeDashoffset: 163 }}
                      animate={{ strokeDashoffset: 163 * (1 - 0.88) }}
                      transition={{ delay: 1.2, duration: 1.4, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-white leading-none">88</span>
                    <span className="text-[7px] text-white/35 leading-none mt-0.5 uppercase tracking-wide">Score</span>
                  </div>
                </div>
              </div>

              {/* Calorie display */}
              <div className="rounded-xl p-3.5 mb-3 relative z-10" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.1)" }}>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[9px] text-white/35 mb-1 uppercase tracking-widest font-medium">Total Calories</div>
                    <div className="flex items-baseline gap-1.5">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                        className="text-3xl font-black"
                        style={{ color: "#6ee7b7" }}
                      >580</motion.span>
                      <span className="text-sm text-white/30 font-light">kcal</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-white/30 mb-0.5 uppercase tracking-wider">Daily Goal</div>
                    <div className="text-xs font-semibold text-white/50">2,000 kcal</div>
                    <div className="text-[10px] font-bold mt-0.5" style={{ color: "#6ee7b7" }}>29% used</div>
                  </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden mt-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #34d399, #06b6d4)" }}
                    initial={{ width: 0 }} animate={{ width: "29%" }}
                    transition={{ delay: 1.4, duration: 0.9, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Macros row */}
              <div className="grid grid-cols-3 gap-1.5 mb-3 relative z-10">
                {[
                  { label: "Protein", val: "42g", color: "#67e8f9", pct: 70 },
                  { label: "Carbs",   val: "38g", color: "#fdba74", pct: 45 },
                  { label: "Fats",    val: "18g", color: "#c4b5fd", pct: 35 },
                ].map(m => (
                  <div key={m.label} className="rounded-lg p-2.5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-sm font-bold mb-0.5" style={{ color: m.color }}>{m.val}</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1.5">{m.label}</div>
                    <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div className="h-full rounded-full" style={{ background: m.color, opacity: 0.7 }} initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ delay: 1.5, duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Vitamins */}
              <div className="rounded-xl p-3 mb-3 relative z-10" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-[9px] text-white/30 font-semibold uppercase tracking-widest mb-2.5">Vitamins & Minerals</div>
                <div className="space-y-2">
                  {[
                    { name: "Vitamin C", val: 88, color: "#fdba74" },
                    { name: "Vitamin D", val: 52, color: "#fcd34d" },
                    { name: "Iron",      val: 42, color: "#c4b5fd" },
                    { name: "Calcium",   val: 65, color: "#67e8f9" },
                  ].map(v => (
                    <div key={v.name} className="flex items-center gap-2.5">
                      <div className="text-[10px] text-white/35 w-16 shrink-0">{v.name}</div>
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: v.color, opacity: 0.7 }} initial={{ width: 0 }} animate={{ width: `${v.val}%` }} transition={{ delay: 1.6, duration: 0.8 }} />
                      </div>
                      <div className="text-[10px] font-semibold w-7 text-right shrink-0 text-white/45">{v.val}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI recommendation */}
              <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 relative z-10" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}>
                <Brain className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/40" />
                <span className="text-[10px] text-white/45 leading-relaxed">Excellent protein source. Consider adding quinoa for extra fiber.</span>
              </div>
            </div>

            {/* Floating badge — top left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 180 }}
              className="absolute -top-4 -left-4 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-semibold"
              style={{ background: "rgba(8,14,20,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(253,186,116,0.2)", color: "rgba(253,186,116,0.8)" }}
            >
              <Zap className="w-3 h-3" /> Instant Analysis
            </motion.div>

            {/* Floating badge — bottom right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 180 }}
              className="absolute -bottom-4 -right-4 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-semibold"
              style={{ background: "rgba(8,14,20,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(196,181,253,0.2)", color: "rgba(196,181,253,0.8)" }}
            >
              <Brain className="w-3 h-3" /> Powered by Claude AI
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── STATS TICKER ── */}
      <section className="w-full border-y border-white/5 relative z-20" style={{ background: "rgba(57,255,136,0.03)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/10">
            {[
              { val: "10,000+", label: "Meals Analyzed", icon: "🍽️" },
              { val: "98%", label: "Accuracy Rate", icon: "🎯" },
              { val: "50+", label: "Nutrients Tracked", icon: "🧪" },
              { val: "< 3s", label: "Instant AI Analysis", icon: "⚡" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center py-2 md:py-0">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <span className="text-2xl font-black mb-0.5" style={{ color: "#39FF88" }}>{stat.val}</span>
                <span className="text-white/50 text-xs font-medium tracking-wider uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" ref={featuresRef} className="py-28 relative z-10">
        {/* bg orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,136,0.04) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: "rgba(57,255,136,0.25)", background: "rgba(57,255,136,0.06)", color: "#39FF88" }}
            >
              <Zap className="w-3.5 h-3.5" /> Powerful Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            >
              <span className="text-white">Intelligent Nutrition</span>{" "}
              <span style={{ background: "linear-gradient(90deg, #39FF88, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Features</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg text-white/45 font-light max-w-xl mx-auto"
            >
              Everything you need to deeply understand your food and optimize your health
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: ScanSearch, title: "Food Recognition", desc: "AI computer vision instantly identifies any food from a photo with high precision", color: "#39FF88", emoji: "🔍" },
              { icon: Flame, title: "Calorie Estimation", desc: "Accurate calorie counts from a single photo — no manual logging needed", color: "#f97316", emoji: "🔥" },
              { icon: Activity, title: "Macro Analysis", desc: "Complete protein, carbs, fat, and fiber breakdown per serving", color: "#06b6d4", emoji: "📊" },
              { icon: Leaf, title: "Vitamin Detection", desc: "Full micronutrient and vitamin profile breakdown for every scan", color: "#4ade80", emoji: "🌿" },
              { icon: Brain, title: "AI Recommendations", desc: "Personalized dietary advice tailored to your unique nutritional profile", color: "#a855f7", emoji: "🧠" },
              { icon: TrendingUp, title: "Health Score", desc: "AI-powered health scoring based on your meal history and goals", color: "#f59e0b", emoji: "⭐" },
              { icon: Database, title: "Nutrition Tracking", desc: "Smart long-term tracking with weekly reports and trend analysis", color: "#ec4899", emoji: "📈" },
              { icon: Clock, title: "Scan History", desc: "Full searchable history of every meal you've ever scanned", color: "#14b8a6", emoji: "🗂️" },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.border = `1px solid ${feat.color}40`;
                  el.style.boxShadow = `0 0 30px ${feat.color}10, 0 20px 40px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.border = "1px solid rgba(255,255,255,0.07)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="text-3xl mb-4">{feat.emoji}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: `${feat.color}15` }}>
                  <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{feat.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{feat.desc}</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" style={{ color: feat.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" ref={howItWorksRef} className="py-24 relative z-10 border-y border-white/5" style={{ background: "rgba(255,255,255,0.012)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={howItWorksInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: "rgba(57,255,136,0.25)", background: "rgba(57,255,136,0.06)", color: "#39FF88" }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Simple Process
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={howItWorksInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            >
              <span className="text-white">How It </span>
              <span style={{ background: "linear-gradient(90deg, #39FF88, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Works</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={howItWorksInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg text-white/45"
            >
              Four simple steps to smarter nutrition
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(57,255,136,0.3), rgba(6,182,212,0.3), rgba(57,255,136,0.3), transparent)" }} />

            {[
              { num: "01", title: "Upload Food Image", desc: "Snap or upload a photo of your meal — any food, any angle", icon: Camera, emoji: "📸", color: "#39FF88" },
              { num: "02", title: "AI Vision Analysis", desc: "Our advanced Claude AI identifies every ingredient and portion size", icon: Brain, emoji: "🤖", color: "#06b6d4" },
              { num: "03", title: "Nutrition Breakdown", desc: "Get detailed calories, macros, vitamins, and mineral analysis", icon: BarChart3, emoji: "📊", color: "#a855f7" },
              { num: "04", title: "Health Recommendations", desc: "Receive personalized AI-powered dietary advice and health insights", icon: Heart, emoji: "💡", color: "#f59e0b" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="relative mb-6 z-10">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl" style={{ background: `${step.color}12`, border: `1px solid ${step.color}30`, boxShadow: `0 0 25px ${step.color}15` }}>
                    {step.emoji}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background: step.color, color: "#020617" }}>
                    {step.num}
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm max-w-[220px] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section ref={dashboardRef} className="py-24 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,136,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={dashboardInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: "rgba(57,255,136,0.25)", background: "rgba(57,255,136,0.06)", color: "#39FF88" }}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Live Dashboard
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={dashboardInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            <span className="text-white">See It In </span>
            <span style={{ background: "linear-gradient(90deg, #39FF88, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Action</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={dashboardInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-white/45"
          >
            A premium analytics dashboard at your fingertips
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={dashboardInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden border border-white/10"
            style={{ background: "rgba(8,15,30,0.95)", boxShadow: "0 0 80px rgba(57,255,136,0.08), 0 50px 100px rgba(0,0,0,0.5)" }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4">
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs text-white/30 text-center max-w-xs mx-auto">
                  nutriscan.ai/dashboard
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: "rgba(57,255,136,0.1)", color: "#39FF88", border: "1px solid rgba(57,255,136,0.2)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#39FF88] animate-pulse" /> Live
              </div>
            </div>

            <div className="flex h-[560px]">
              {/* Sidebar */}
              <div className="w-56 border-r border-white/8 p-5 hidden md:flex flex-col" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="flex items-center gap-2 mb-8">
                  <LogoEmblem className="w-6 h-6" />
                  <span className="font-bold text-sm">CaloriQ <span style={{ color: "#39FF88" }}>AI</span></span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(57,255,136,0.12)", color: "#39FF88", border: "1px solid rgba(57,255,136,0.2)" }}>
                    <Camera className="w-4 h-4" /> Scanner
                  </div>
                  {[
                    { label: "History", emoji: "🗂️" },
                    { label: "Analytics", emoji: "📊" },
                    { label: "AI Insights", emoji: "🧠" },
                    { label: "Settings", emoji: "⚙️" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/45">
                      <span>{item.emoji}</span> {item.label}
                    </div>
                  ))}
                </div>
                {/* Daily goal ring */}
                <div className="rounded-xl p-3 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="text-xs text-white/50 mb-2">Daily Calories</div>
                  <div className="flex items-center gap-3">
                    <svg width="36" height="36" viewBox="0 0 36 36" className="rotate-[-90deg]">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#39FF88" strokeWidth="3.5" strokeDasharray="88" strokeDashoffset="26" strokeLinecap="round" />
                    </svg>
                    <div>
                      <div className="text-sm font-black text-white">1,460</div>
                      <div className="text-xs text-white/40">/ 2,000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-6 overflow-hidden">
                {/* Top stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Calories", val: "1,460", unit: "kcal", color: "#39FF88", icon: "🔥" },
                    { label: "Health Score", val: "87", unit: "/100", color: "#06b6d4", icon: "⭐" },
                    { label: "Protein", val: "82g", unit: "/ 120g", color: "#a855f7", icon: "💪" },
                    { label: "Hydration", val: "68%", unit: "of goal", color: "#f59e0b", icon: "💧" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-base">{s.icon}</span>
                        <span className="text-xs text-white/50">{s.label}</span>
                      </div>
                      <div className="text-xl font-black" style={{ color: s.color }}>{s.val}<span className="text-xs text-white/30 font-normal ml-1">{s.unit}</span></div>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px]">
                  {/* Weekly bar chart */}
                  <div className="rounded-xl p-5 border border-white/8 flex flex-col" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="text-sm font-bold text-white mb-4">Weekly Calories</div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{ fill: "rgba(57,255,136,0.04)" }} contentStyle={{ backgroundColor: "#0a0f1e", border: "1px solid rgba(57,255,136,0.2)", borderRadius: "8px", color: "white", fontSize: "12px" }} />
                          <Bar dataKey="cals" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, idx) => (
                              <Cell key={idx} fill={idx === 6 ? "#39FF88" : "rgba(57,255,136,0.25)"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right col */}
                  <div className="flex flex-col gap-4">
                    {/* Macro pie */}
                    <div className="rounded-xl p-4 border border-white/8 flex items-center gap-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div style={{ width: 70, height: 70 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={macroData} cx="50%" cy="50%" innerRadius={22} outerRadius={33} dataKey="value" strokeWidth={0}>
                              {macroData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white mb-2">Macro Split</div>
                        <div className="grid grid-cols-2 gap-1">
                          {macroData.map(m => (
                            <div key={m.name} className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.fill }} />
                              <span className="text-xs text-white/50">{m.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI insight */}
                    <div className="rounded-xl p-4 border flex-1 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, rgba(57,255,136,0.08), rgba(6,182,212,0.04))", borderColor: "rgba(57,255,136,0.2)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4" style={{ color: "#39FF88" }} />
                        <span className="text-sm font-bold text-white">AI Recommendation</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">You're 18g short of your protein goal. Consider adding Greek yogurt or a protein-rich snack this afternoon. ✨</p>
                      <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: "#39FF88" }}>
                        <Sparkles className="w-3.5 h-3.5" /> Powered by Claude AI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE APP MOCKUP ── */}
      <section ref={mobileRef} className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={mobileInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-semibold uppercase tracking-widest"
                style={{ borderColor: "rgba(57,255,136,0.25)", background: "rgba(57,255,136,0.06)", color: "#39FF88" }}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile Experience
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                <span className="text-white">Nutrition On </span>
                <span style={{ background: "linear-gradient(90deg, #39FF88, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Go</span>
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Scan your meals from anywhere. Our fully responsive experience works perfectly on any device — get instant AI nutrition analysis from the convenience of your phone.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: "Instant Camera Scan", desc: "Open your camera and scan any meal in seconds" },
                  { title: "Offline History", desc: "Access your meal history even without an internet connection" },
                  { title: "Smart Notifications", desc: "Get personalized reminders to stay on track with your goals" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#39FF88" }} />
                    <div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <div className="text-sm text-white/45">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/scanner")}
                className="flex items-center gap-2 rounded-full px-8 py-4 font-bold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #39FF88, #06b6d4)", color: "#020617", boxShadow: "0 0 20px rgba(57,255,136,0.3)" }}
              >
                Try It Now <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Right: phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mobileInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 rounded-[40px] blur-3xl scale-75 -z-10" style={{ background: "linear-gradient(135deg, rgba(57,255,136,0.2), rgba(6,182,212,0.15))" }} />

                {/* Phone frame */}
                <div className="relative w-64 rounded-[40px] overflow-hidden border-4" style={{ borderColor: "rgba(255,255,255,0.15)", background: "#080f1e", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 py-3" style={{ background: "#040a14" }}>
                    <span className="text-xs text-white/60 font-medium">9:41</span>
                    <div className="w-20 h-5 rounded-full" style={{ background: "#040a14", border: "2px solid rgba(255,255,255,0.1)" }} />
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5 items-end">
                        {[3,5,7,7].map((h,i) => <div key={i} className="w-1 rounded-sm bg-white/60" style={{ height: `${h}px` }} />)}
                      </div>
                      <div className="w-5 h-2.5 rounded-sm border border-white/40 relative">
                        <div className="absolute inset-0.5 right-1 rounded-sm bg-white/70" />
                      </div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="px-4 py-4" style={{ minHeight: "520px", background: "linear-gradient(180deg, #040a14 0%, #020617 100%)" }}>
                    {/* App header */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-xs text-white/40 mb-0.5">Good morning!</div>
                        <div className="text-sm font-bold text-white">Ready to scan?</div>
                      </div>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(57,255,136,0.15)", border: "1px solid rgba(57,255,136,0.3)" }}>
                        <LogoEmblem className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Scan button */}
                    <motion.div
                      animate={{ boxShadow: ["0 0 15px rgba(57,255,136,0.3)", "0 0 30px rgba(57,255,136,0.5)", "0 0 15px rgba(57,255,136,0.3)"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full rounded-2xl py-6 mb-5 flex flex-col items-center gap-2 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, rgba(57,255,136,0.15), rgba(6,182,212,0.08))", border: "1px solid rgba(57,255,136,0.3)" }}
                    >
                      <div className="text-3xl">📸</div>
                      <div className="text-xs font-bold" style={{ color: "#39FF88" }}>Tap to Scan Meal</div>
                    </motion.div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { label: "Calories", val: "820", color: "#39FF88" },
                        { label: "Health", val: "91%", color: "#06b6d4" },
                      ].map(s => (
                        <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="text-base font-black" style={{ color: s.color }}>{s.val}</div>
                          <div className="text-xs text-white/40">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recent scan */}
                    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-xs text-white/40 mb-2">Last Scan</div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🥗</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white">Avocado Salad</div>
                          <div className="text-xs text-white/40">620 kcal · Score 94</div>
                        </div>
                        <div className="text-xs font-bold" style={{ color: "#39FF88" }}>94</div>
                      </div>
                    </div>
                  </div>

                  {/* Home bar */}
                  <div className="flex justify-center py-3" style={{ background: "#040a14" }}>
                    <div className="w-24 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-28 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,136,0.1) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(57,255,136,0.08) 0%, rgba(6,182,212,0.04) 50%, rgba(57,255,136,0.06) 100%)", border: "1px solid rgba(57,255,136,0.2)", boxShadow: "0 0 80px rgba(57,255,136,0.08)" }}
          >
            {/* Corner glow */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(57,255,136,0.07)" }} />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(6,182,212,0.05)" }} />

            <div className="relative z-10">
              <div className="text-5xl mb-6">🥗</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="text-white">Ready to Transform</span>
                <br />
                <span style={{ background: "linear-gradient(90deg, #39FF88, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Nutrition?</span>
              </h2>
              <p className="text-lg text-white/55 mb-10 max-w-xl mx-auto">
                Start your AI-powered nutrition journey today. Better insights, better health — one scan at a time.
              </p>
              <button
                onClick={() => navigate("/scanner")}
                className="flex items-center gap-3 mx-auto rounded-full px-12 py-5 font-black text-lg transition-all hover:scale-105 group"
                style={{ background: "linear-gradient(135deg, #39FF88, #06b6d4)", color: "#020617", boxShadow: "0 0 40px rgba(57,255,136,0.4)" }}
              >
                <Camera className="w-5 h-5" /> Start Scanning Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-white/30 mt-6">No account required · Instant analysis · Powered by Claude AI</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" className="border-t border-white/8 pt-16 pb-8 relative z-10" style={{ background: "rgba(2,6,23,0.98)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <LogoEmblem className="w-7 h-7" style={{ filter: "drop-shadow(0 0 6px rgba(57,255,136,0.6))" }} />
                <span className="font-black text-lg text-white">CaloriQ <span style={{ color: "#39FF88" }}>AI</span></span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-5">AI-powered nutrition intelligence for smarter, healthier eating decisions.</p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Instagram, href: "#" },
                ].map(({ icon: Icon, href }, i) => (
                  <a key={i} href={href} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#39FF88] hover:border-[#39FF88]/40 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Scanner", action: () => navigate("/scanner") },
                  { label: "History", action: () => navigate("/history") },
                  { label: "Analytics", action: () => navigate("/analytics") },
                  { label: "AI Insights", action: () => navigate("/ai-insights") },
                  { label: "Settings", action: () => navigate("/settings") },
                ].map(link => (
                  <button key={link.label} onClick={link.action} className="text-sm text-white/40 hover:text-[#39FF88] transition-colors text-left">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Features</div>
              <div className="flex flex-col gap-2.5">
                {["Food Recognition", "Calorie Tracking", "Macro Analysis", "Vitamin Detection", "Health Scoring", "AI Recommendations"].map(item => (
                  <span key={item} className="text-sm text-white/40 cursor-default">{item}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Technology</div>
              <div className="flex flex-col gap-2.5">
                {["Powered by Claude AI", "Built on Replit", "React + Vite", "PostgreSQL", "Real-time Analysis"].map(item => (
                  <span key={item} className="text-sm text-white/40 cursor-default">{item}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(57,255,136,0.08)", border: "1px solid rgba(57,255,136,0.2)", color: "#39FF88" }}>
                  🤖 Claude AI
                </div>
                <div className="px-3 py-1.5 rounded-full text-xs font-medium text-white/50" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ⚡ Replit
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/8 gap-4">
            <p className="text-xs text-white/25">© 2025 CaloriQ AI · Powered by Anthropic Claude · All rights reserved</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-white/25 hover:text-[#39FF88] transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-white/25 hover:text-[#39FF88] transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-white/25 hover:text-[#39FF88] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
