import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, History, Scan, Utensils, Zap, Sparkles, BarChart3, Brain, Settings } from "lucide-react";
import { getDailyTotals, DAILY_CALORIE_GOAL } from "@/lib/meal-tracker";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [totals, setTotals] = useState(getDailyTotals());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMealAdded = () => setTotals(getDailyTotals());
    window.addEventListener("meal-added", handleMealAdded);
    return () => window.removeEventListener("meal-added", handleMealAdded);
  }, []);

  const calPct = Math.min(100, Math.max(0, (totals.calories / DAILY_CALORIE_GOAL) * 100));

  const navItems = [
    { icon: Scan, label: "Scanner", href: "/scanner" },
    { icon: History, label: "History", href: "/history" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Brain, label: "AI Insights", href: "/ai-insights" },
    { icon: Settings, label: "Settings", href: "/settings" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden selection:bg-primary/30">
      <nav className="w-full md:w-72 glass-card border-r-0 md:border-r border-b md:border-b-0 flex flex-col shrink-0 relative z-20 md:sticky md:top-0 md:h-screen">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent glow-green" />
        
        <div className="p-6 flex items-center justify-between md:block">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-gradient cursor-pointer hover:opacity-80 transition-opacity duration-200">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
              }} 
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Zap className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </motion.div>
            CaloriQ <span className="text-primary drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]">AI</span>
          </Link>
          <button 
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Activity className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className={`flex-1 flex flex-col gap-2 px-4 pb-6 overflow-y-auto ${isMobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.label} href={item.href} className="relative block group">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative z-10 ${
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 glow-green" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl shadow-[0_0_10px_rgba(34,197,94,1)]" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" : "group-hover:text-foreground"}`} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
          
          <div className="mt-auto pt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
            <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-glow transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all" />
              
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Utensils className="w-4 h-4 text-primary" />
                  Today's Meals
                </div>
              </div>
              
              <div className="relative z-10 flex items-center justify-center mb-5">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * calPct) / 100}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * calPct) / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-foreground">{Math.round(totals.calories)}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">/ {DAILY_CALORIE_GOAL}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 relative z-10">
                <div className="flex flex-col items-center bg-background/50 rounded-lg p-2 border border-border/50">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Pro</span>
                  <span className="text-sm font-bold text-foreground">{Math.round(totals.protein)}<span className="text-[10px] text-muted-foreground">g</span></span>
                </div>
                <div className="flex flex-col items-center bg-background/50 rounded-lg p-2 border border-border/50">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Carb</span>
                  <span className="text-sm font-bold text-foreground">{Math.round(totals.carbs)}<span className="text-[10px] text-muted-foreground">g</span></span>
                </div>
                <div className="flex flex-col items-center bg-background/50 rounded-lg p-2 border border-border/50">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Fat</span>
                  <span className="text-sm font-bold text-foreground">{Math.round(totals.fat)}<span className="text-[10px] text-muted-foreground">g</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 overflow-auto bg-mesh relative">
        <div className="p-6 md:p-10 max-w-6xl mx-auto h-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}