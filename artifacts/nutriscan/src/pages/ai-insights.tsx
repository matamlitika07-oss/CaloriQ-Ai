import { useGetScanHistory, getGetScanHistoryQueryKey } from "@workspace/api-client-react";
import type { ScanResult } from "@workspace/api-client-react";
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, CheckCircle2, Zap, TrendingUp, Heart, Flame, Star, Shield, Activity, ArrowRight, Info } from "lucide-react";
import { format, subDays } from "date-fns";
import { Link } from "wouter";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

const parseNum = (s: string | undefined | null) => { 
  if (!s) return 0;
  const m = s.match(/[\d.]+/); 
  return m ? parseFloat(m[0]) : 0; 
};

export default function AiInsights() {
  const { data: history = [], isLoading } = useGetScanHistory({ query: { queryKey: getGetScanHistoryQueryKey() } });

  const insights = useMemo(() => {
    if (!history.length) return null;

    const totalScore = history.reduce((sum, s) => sum + s.healthScore, 0);
    const avgScore = Math.round(totalScore / history.length);
    
    let grade = "F";
    let gradeColor = "hsl(var(--destructive))";
    if (avgScore >= 90) { grade = "A"; gradeColor = "hsl(var(--primary))"; }
    else if (avgScore >= 75) { grade = "B"; gradeColor = "hsl(var(--primary))"; }
    else if (avgScore >= 60) { grade = "C"; gradeColor = "hsl(var(--warning))"; }
    else if (avgScore >= 40) { grade = "D"; gradeColor = "hsl(var(--warning))"; }

    const vits: Record<string, { totalPct: number, count: number }> = {};
    const allergensSet = new Set<string>();
    let totalP = 0, totalC = 0, totalF = 0;
    const foodCounts: Record<string, number> = {};
    const daysWithScans = new Set<string>();

    const cutoff7d = new Date();
    cutoff7d.setDate(cutoff7d.getDate() - 7);

    history.forEach(scan => {
      scan.vitamins?.forEach(v => {
        if (!vits[v.name]) vits[v.name] = { totalPct: 0, count: 0 };
        vits[v.name].totalPct += v.dailyPct;
        vits[v.name].count++;
      });
      scan.allergens?.forEach(a => allergensSet.add(a));
      
      totalP += parseNum(scan.protein);
      totalC += parseNum(scan.carbs);
      totalF += parseNum(scan.fat);

      foodCounts[scan.foodName] = (foodCounts[scan.foodName] || 0) + 1;

      const scanDate = new Date(scan.createdAt);
      if (scanDate >= cutoff7d) {
        daysWithScans.add(scanDate.toDateString());
      }
    });

    const topFoods = Object.entries(foodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const deficientVits = Object.entries(vits)
      .map(([name, data]) => ({ name, avgPct: data.totalPct / data.count }))
      .filter(v => v.avgPct < 15)
      .slice(0, 3);
      
    const sortedVits = Object.entries(vits)
      .map(([name, data]) => ({ name, avgPct: data.totalPct / data.count }))
      .sort((a, b) => b.avgPct - a.avgPct)
      .slice(0, 5);

    const totalMacros = totalP + totalC + totalF;
    const pPct = totalMacros > 0 ? (totalP / totalMacros) * 100 : 0;
    const fPct = totalMacros > 0 ? (totalF / totalMacros) * 100 : 0;

    const alerts = [];
    if (avgScore < 60) {
      alerts.push({ type: 'warning' as const, text: "Your average health score is below optimal. Focus on whole foods." });
    }
    deficientVits.forEach(v => {
      alerts.push({ type: 'warning' as const, text: `Low ${v.name} intake detected across your recent scans.` });
    });
    if (allergensSet.size === 0) {
      alerts.push({ type: 'positive' as const, text: "No common allergens detected in your recent meals." });
    }
    if (history.length > 5) {
      alerts.push({ type: 'tip' as const, text: "You've been consistent! Keep scanning to get better insights." });
    }
    if (pPct < 20 && totalMacros > 0) {
      alerts.push({ type: 'warning' as const, text: "Consider increasing protein intake. Aim for 0.8g per kg of body weight." });
    }

    if (alerts.length < 3) {
      alerts.push({ type: 'tip' as const, text: "Try scanning different types of meals to expand your nutrient profile." });
    }

    const recs = [];
    if (deficientVits.length > 0) {
      recs.push(`Boost your ${deficientVits[0].name} by adding specific fortified foods or natural sources.`);
    }
    if (pPct < 20) {
      recs.push("Add more lean meats, legumes, or dairy to meet protein goals.");
    }
    if (fPct > 40) {
      recs.push("Try swapping some saturated fats for healthier alternatives like avocados or nuts.");
    }
    recs.push("Aim for 5+ servings of vegetables daily.");
    recs.push("Stay hydrated: target 8 glasses of water.");
    recs.push("Consider adding omega-3 rich foods like salmon.");

    return {
      avgScore,
      grade,
      gradeColor,
      alerts,
      pPct, cPct: totalMacros > 0 ? (totalC / totalMacros) * 100 : 0, fPct,
      sortedVits,
      streak: daysWithScans.size,
      topFoods,
      recs: recs.slice(0, 5)
    };
  }, [history]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 w-full pb-10">
        <Skeleton className="h-[400px] w-full rounded-[3rem] bg-muted/30" />
        <div className="flex gap-4 overflow-x-auto">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-80 shrink-0 rounded-2xl bg-muted/30" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-3xl bg-muted/30" />
          <Skeleton className="h-64 rounded-3xl bg-muted/30" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="glass-card rounded-[3rem] p-12 max-w-2xl w-full flex flex-col items-center border-glow overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
          
          <Brain className="w-20 h-20 text-primary mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] relative z-10" />
          <h2 className="text-4xl font-black mb-4 text-white relative z-10">AI Health Coach Ready</h2>
          <p className="text-lg text-muted-foreground mb-10 relative z-10">Start scanning meals to unlock personalized intelligence, macro tracking, and nutritional insights.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-10 relative z-10">
            {["Health Scoring", "Macro Balance", "Smart Alerts", "Vitamin Tracking"].map((feat, i) => (
              <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">{feat}</span>
              </div>
            ))}
          </div>

          <Link href="/">
            <Button size="lg" className="rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black border-none glow-green h-14 px-8 relative z-10">
              Scan Your First Meal <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const gradeData = [{ name: "Score", value: insights.avgScore, fill: insights.gradeColor }];
  const macroData = [
    { name: "Protein", value: insights.pPct, fill: "hsl(var(--secondary))" },
    { name: "Carbs", value: insights.cPct, fill: "hsl(var(--warning))" },
    { name: "Fat", value: insights.fPct, fill: "hsl(var(--destructive))" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient flex items-center gap-4">
          <Brain className="w-10 h-10 text-primary" /> AI Insights
        </h1>
        <p className="text-muted-foreground text-lg">Intelligent analysis of your nutritional habits.</p>
      </div>

      {/* Section 1: AI Health Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
          <ResponsiveContainer width="100%" height="200%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" barSize={40} data={gradeData} startAngle={180} endAngle={-180}>
              <RadialBar background={{ fill: 'transparent' }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: insights.gradeColor, opacity: 0.2 }} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Overall Health Grade</span>
          <div className="text-[10rem] font-black leading-none tracking-tighter drop-shadow-2xl" style={{ color: insights.gradeColor, textShadow: `0 0 40px ${insights.gradeColor}80` }}>
            {insights.grade}
          </div>
          <span className="mt-4 px-4 py-1.5 rounded-full bg-card border border-border text-sm font-bold text-muted-foreground">
            Based on {history.length} scans
          </span>
        </div>
      </motion.div>

      {/* Section 2: Smart Alerts */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold flex items-center gap-2 px-2"><Activity className="w-5 h-5 text-primary" /> Smart Alerts</h3>
        <div className="flex overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none gap-4">
          {insights.alerts.map((alert, i) => {
            const isWarn = alert.type === 'warning';
            const isPos = alert.type === 'positive';
            const Icon = isWarn ? AlertTriangle : isPos ? CheckCircle2 : Zap;
            const colorClass = isWarn ? 'border-l-warning' : isPos ? 'border-l-primary' : 'border-l-secondary';
            const iconColor = isWarn ? 'text-warning' : isPos ? 'text-primary' : 'text-secondary';
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                key={i} 
                className={`glass-card rounded-2xl p-5 shrink-0 w-80 flex gap-4 border-l-4 ${colorClass}`}
              >
                <div className={`mt-0.5 shrink-0 bg-background/50 p-2 rounded-lg ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium leading-relaxed">{alert.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Nutrition Patterns */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><PieChart className="w-5 h-5 text-secondary" /> Macro Balance</h3>
          <div className="flex items-center gap-6 h-full">
            <div className="w-32 h-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                    {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-center text-sm font-bold"><span className="text-secondary">Protein</span><span>{insights.pPct.toFixed(0)}%</span></div>
              <div className="flex justify-between items-center text-sm font-bold"><span className="text-warning">Carbs</span><span>{insights.cPct.toFixed(0)}%</span></div>
              <div className="flex justify-between items-center text-sm font-bold"><span className="text-destructive">Fat</span><span>{insights.fPct.toFixed(0)}%</span></div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><Zap className="w-5 h-5 text-primary" /> Vitamin Profile (Avg)</h3>
          <div className="flex flex-col gap-4">
            {insights.sortedVits.map((vit, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>{vit.name}</span>
                  <span className={vit.avgPct < 20 ? "text-warning" : "text-primary"}>{vit.avgPct.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${vit.avgPct < 20 ? "bg-warning" : "bg-primary"}`} style={{ width: `${Math.min(100, vit.avgPct)}%` }} />
                </div>
              </div>
            ))}
            {insights.sortedVits.length === 0 && <div className="text-muted-foreground text-sm text-center py-4">Not enough vitamin data yet.</div>}
          </div>
        </div>
      </div>

      {/* Section 4: Food Intelligence */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-bold mb-6">7-Day Scan Streak</h3>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = subDays(new Date(), 6 - i);
              const hasScan = insights.streak > 0 && Array.from(history).some(s => new Date(s.createdAt).toDateString() === d.toDateString());
              return (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${hasScan ? 'bg-primary/20 text-primary border-primary/40 glow-green' : 'bg-card border-border/50 text-muted-foreground'}`}>
                  {format(d, 'ee')[0]}
                </div>
              );
            })}
          </div>
          <div className="text-3xl font-black text-white">{insights.streak} <span className="text-lg text-muted-foreground font-medium">Days</span></div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-6">Most Scanned Foods</h3>
          <div className="flex flex-col gap-3">
            {insights.topFoods.map(([name, count], i) => (
              <div key={i} className="flex justify-between items-center bg-card/40 border border-border/30 rounded-xl p-3">
                <span className="font-bold capitalize truncate pr-4">{name}</span>
                <span className="shrink-0 bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-black border border-primary/20">{count}x</span>
              </div>
            ))}
            {insights.topFoods.length === 0 && <div className="text-muted-foreground text-sm text-center py-4">No foods scanned yet.</div>}
          </div>
        </div>
      </div>

      {/* Section 5: Health Recommendations */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <h3 className="text-xl font-black flex items-center gap-2"><Heart className="w-6 h-6 text-destructive" /> Personalized Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.recs.map((rec, i) => (
            <div key={i} className="bg-card/40 border border-border/40 rounded-xl p-4 flex gap-3 items-start hover:bg-card/60 transition-colors">
              <Star className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
