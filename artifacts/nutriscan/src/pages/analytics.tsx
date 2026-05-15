import { useGetScanHistory, getGetScanHistoryQueryKey } from "@workspace/api-client-react";
import type { ScanResult } from "@workspace/api-client-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format, subDays, isAfter } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Flame, Heart, Trophy, ScanSearch, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

const parseNum = (s: string | undefined | null) => { 
  if (!s) return 0;
  const m = s.match(/[\d.]+/); 
  return m ? parseFloat(m[0]) : 0; 
};

export default function Analytics() {
  const { data: history = [], isLoading } = useGetScanHistory({ query: { queryKey: getGetScanHistoryQueryKey() } });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const filteredHistory = useMemo(() => {
    if (timeRange === 'all') return history;
    const days = timeRange === '7d' ? 7 : 30;
    const cutoff = subDays(new Date(), days);
    return history.filter(scan => isAfter(new Date(scan.createdAt), cutoff));
  }, [history, timeRange]);

  const stats = useMemo(() => {
    if (!filteredHistory.length) return { scans: 0, avgCals: 0, avgScore: 0, bestMeal: "None" };
    
    const totalCals = filteredHistory.reduce((sum, s) => sum + s.calories, 0);
    const totalScore = filteredHistory.reduce((sum, s) => sum + s.healthScore, 0);
    
    const best = [...filteredHistory].sort((a, b) => b.healthScore - a.healthScore)[0];

    return {
      scans: filteredHistory.length,
      avgCals: Math.round(totalCals / filteredHistory.length),
      avgScore: Math.round(totalScore / filteredHistory.length),
      bestMeal: best ? best.foodName : "None"
    };
  }, [filteredHistory]);

  const trendData = useMemo(() => {
    return [...filteredHistory]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(scan => ({
        date: format(new Date(scan.createdAt), 'MMM d'),
        calories: scan.calories,
        healthScore: scan.healthScore
      }));
  }, [filteredHistory]);

  const macroData = useMemo(() => {
    let p = 0, c = 0, f = 0;
    filteredHistory.forEach(s => {
      p += parseNum(s.protein);
      c += parseNum(s.carbs);
      f += parseNum(s.fat);
    });
    return [
      { name: "Protein", value: p, color: "hsl(var(--secondary))" },
      { name: "Carbs", value: c, color: "hsl(var(--warning))" },
      { name: "Fat", value: f, color: "hsl(var(--destructive))" },
    ].filter(m => m.value > 0);
  }, [filteredHistory]);

  const recentScores = useMemo(() => {
    return [...filteredHistory]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .reverse()
      .map(s => ({
        name: s.foodName.length > 8 ? s.foodName.substring(0, 8) + '...' : s.foodName,
        score: s.healthScore
      }));
  }, [filteredHistory]);

  const topFoodsData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredHistory.forEach(s => {
      counts[s.foodName] = (counts[s.foodName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredHistory]);

  const getHealthColor = (score: number) => {
    if (score >= 70) return "hsl(var(--primary))";
    if (score >= 40) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const chartTooltipStyle = { 
    backgroundColor: 'rgba(10,16,28,0.95)', 
    borderColor: 'rgba(34,197,94,0.2)', 
    borderRadius: '12px', 
    color: '#fff' 
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full pb-10">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-12 w-48 rounded-xl bg-muted/30" />
          <Skeleton className="h-10 w-64 rounded-xl bg-muted/30" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-muted/30" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-3xl bg-muted/30" />
          <Skeleton className="h-80 rounded-3xl bg-muted/30" />
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute inset-0 glass-card rounded-full border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <BarChart3 className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-black mb-3 text-foreground">No data yet</h3>
        <p className="text-muted-foreground mb-8 max-w-sm">Scan your first meal to see analytics and trends.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">Analytics</h1>
          <p className="text-muted-foreground text-lg mt-2">Your nutrition trends and patterns.</p>
        </div>
        
        <div className="flex p-1 bg-card border border-border/50 rounded-xl w-fit shrink-0">
          {(['7d', '30d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                timeRange === range 
                  ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 flex flex-col items-center text-center mt-4">
          <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No scans in this period</h3>
          <p className="text-muted-foreground">Try selecting a wider time range to see data.</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center text-center">
              <ScanSearch className="w-8 h-8 text-foreground mb-3" />
              <div className="text-3xl md:text-4xl font-black tabular-nums">{stats.scans}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Total Scans</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center text-center">
              <Flame className="w-8 h-8 text-primary mb-3 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <div className="text-3xl md:text-4xl font-black tabular-nums">{stats.avgCals}</div>
              <div className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Avg Calories</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center text-center">
              <Heart className="w-8 h-8 mb-3" style={{ color: getHealthColor(stats.avgScore) }} />
              <div className="text-3xl md:text-4xl font-black tabular-nums" style={{ color: getHealthColor(stats.avgScore) }}>{stats.avgScore}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Avg Score</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center text-center">
              <Trophy className="w-8 h-8 text-secondary mb-3 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              <div className="text-xl md:text-2xl font-black truncate w-full px-2 capitalize">{stats.bestMeal}</div>
              <div className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Best Meal</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calorie Trend */}
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-6 lg:col-span-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Calorie & Health Trend
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="calories" name="Calories" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" isAnimationActive={true} />
                    <Area yAxisId="right" type="monotone" dataKey="healthScore" name="Health Score" stroke="hsl(var(--secondary))" strokeWidth={2} fillOpacity={0} isAnimationActive={true} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Macro Distribution */}
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold">Macro Distribution</h3>
              <div className="h-64 w-full relative">
                {macroData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%" cy="50%"
                        innerRadius={70} outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        isAnimationActive={true}
                      >
                        {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(val: number) => [`${val.toFixed(0)}g`, 'Amount']} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No macro data</div>
                )}
                {macroData.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-36px]">
                    <span className="text-lg font-black tracking-widest uppercase">Macros</span>
                  </div>
                )}
              </div>
            </div>

            {/* Health Score Trend */}
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold">Recent Health Scores</h3>
              <div className="h-64 w-full">
                {recentScores.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recentScores} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} angle={-45} textAnchor="end" />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]} isAnimationActive={true}>
                        {recentScores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getHealthColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="h-full flex items-center justify-center text-muted-foreground">No recent scores</div>
                )}
              </div>
            </div>

            {/* Top Foods */}
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-6 lg:col-span-2">
              <h3 className="text-lg font-bold">Most Scanned Foods</h3>
              <div className="h-72 w-full">
                {topFoodsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topFoodsData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }} />
                      <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} isAnimationActive={true} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No top foods</div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
