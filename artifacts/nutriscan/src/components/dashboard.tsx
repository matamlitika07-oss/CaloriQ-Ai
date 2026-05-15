import type { ScanResult } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addMeal } from "@/lib/meal-tracker";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Flame, Info, Plus, Zap, Dumbbell, Wheat, AlertTriangle, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function Dashboard({ data }: { data: ScanResult }) {
  const { toast } = useToast();

  const parseNum = (s: string) => {
    const match = s.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const macros = [
    { name: "Protein", value: parseNum(data.protein), color: "hsl(var(--secondary))" }, // cyan
    { name: "Carbs", value: parseNum(data.carbs), color: "hsl(var(--warning))" }, // amber
    { name: "Fat", value: parseNum(data.fat), color: "hsl(var(--destructive))" }, // red
  ].filter(m => m.value > 0);

  const getHealthColor = (score: number) => {
    if (score >= 70) return "hsl(var(--primary))";
    if (score >= 40) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const healthScoreData = [{ name: "Score", value: data.healthScore, fill: getHealthColor(data.healthScore) }];

  const handleAddMeal = () => {
    addMeal(data);
    toast({
      title: "Added to today's meals",
      description: `${data.foodName} (${data.calories} kcal)`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 flex flex-col gap-10 shadow-2xl relative border-glow overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h2 className="text-4xl md:text-5xl font-black text-foreground capitalize tracking-tight">
                <span className="text-gradient">{data.foodName.split(' ')[0]}</span>
                {data.foodName.includes(' ') ? ' ' + data.foodName.split(' ').slice(1).join(' ') : ''}
              </h2>
              {data.confidence && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1 font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  {data.confidence}% Match
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">{data.servingSize} • {data.healthSummary}</p>
          </div>
          <Button 
            onClick={handleAddMeal} 
            size="lg"
            className="shrink-0 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black border-none glow-green font-bold text-base h-12 px-6 rounded-xl"
            data-testid="add-meal-btn"
          >
            <Plus className="w-5 h-5 mr-2" /> Add to Today
          </Button>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-border via-border/50 to-transparent mt-8" />
      </div>

      {/* Primary Stats Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/20 transition-colors" />
          <Flame className="w-8 h-8 text-primary mb-3 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <div className="text-4xl md:text-5xl font-black tabular-nums tracking-tighter text-white">{data.calories}</div>
          <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Calories</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative group hover:scale-[1.02] transition-transform duration-300 cursor-default">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-2xl pointer-events-none" />
          <div className="w-full max-w-[140px] aspect-square relative drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={12} data={healthScoreData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black drop-shadow-md" style={{ color: getHealthColor(data.healthScore), textShadow: `0 0 20px ${getHealthColor(data.healthScore)}40` }}>
                {data.healthScore}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-secondary/20 transition-colors" />
          <Dumbbell className="w-8 h-8 text-secondary mb-3 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          <div className="text-4xl md:text-5xl font-black tabular-nums tracking-tighter text-white">{parseNum(data.protein)}<span className="text-2xl text-muted-foreground/60 ml-1">g</span></div>
          <div className="text-xs text-secondary font-bold uppercase tracking-widest mt-2">Protein</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-warning/20 transition-colors" />
          <Wheat className="w-8 h-8 text-warning mb-3 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          <div className="text-4xl md:text-5xl font-black tabular-nums tracking-tighter text-white">{parseNum(data.carbs)}<span className="text-2xl text-muted-foreground/60 ml-1">g</span></div>
          <div className="text-xs text-warning font-bold uppercase tracking-widest mt-2">Carbs</div>
        </motion.div>
      </motion.div>

      {/* Macros Section */}
      <motion.div variants={itemVariants} initial="hidden" animate="show" className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative z-10 border border-card-border/60">
        <div className="w-48 h-48 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={macros} 
                cx="50%" cy="50%" 
                innerRadius={55} outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
              >
                {macros.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-md" />)}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10,16,28,0.9)', backdropFilter: 'blur(10px)', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Macros</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4 w-full">
          {macros.map(m => (
            <div key={m.name} className="flex items-center justify-between bg-card/40 px-5 py-3 rounded-xl border border-border/30 hover:bg-card/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: m.color, color: m.color }} />
                <span className="text-sm font-bold tracking-wide text-foreground">{m.name}</span>
              </div>
              <span className="text-lg font-black text-white">{m.value}g</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dietary Flags & Allergens (Scrolling row) */}
      <div className="relative z-10 flex flex-col gap-4">
        {(data.dietaryFlags?.length > 0 || data.allergens?.length > 0) && (
          <div className="flex overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none gap-3 items-center">
            {data.dietaryFlags?.map((flag: string) => {
              const isVeganVeg = flag.toLowerCase().includes('vegan') || flag.toLowerCase().includes('vegetarian');
              const isKetoPaleo = flag.toLowerCase().includes('keto') || flag.toLowerCase().includes('paleo');
              const colorClass = isVeganVeg ? 'bg-primary/10 text-primary border-primary/30 glow-green' : 
                                isKetoPaleo ? 'bg-secondary/10 text-secondary border-secondary/30 glow-cyan' : 
                                'bg-warning/10 text-warning border-warning/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]';
              
              return (
                <Badge key={flag} variant="outline" className={`shrink-0 px-4 py-1.5 text-sm font-bold rounded-full backdrop-blur-md ${colorClass}`}>
                  {flag}
                </Badge>
              );
            })}
            
            {data.allergens?.map((item: string) => (
              <Badge key={item} variant="destructive" className="shrink-0 px-4 py-1.5 text-sm font-bold rounded-full bg-destructive/15 text-destructive border-destructive/30 backdrop-blur-md shadow-[0_0_15px_rgba(248,113,113,0.2)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {item}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 relative z-10">
        {/* Left Column - Vitamins & Minerals */}
        <div className="flex flex-col gap-8">
          {data.vitamins?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" /> Vitamins Profile
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.vitamins} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }} width={90} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(10,16,28,0.9)', backdropFilter: 'blur(10px)', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: number) => [`${val}%`, 'Daily Value']}
                    />
                    <Bar dataKey="dailyPct" radius={[0, 6, 6, 0]} isAnimationActive={true}>
                      {data.vitamins.map((v: { name: string; amount: string; dailyPct: number }, i: number) => (
                        <Cell key={i} fill={v.dailyPct > 20 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {data.minerals?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Minerals</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.minerals.map((m, i) => (
                  <div key={i} className="flex justify-between items-center bg-card/30 px-3 py-2 rounded-lg border border-border/30">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <span className="text-sm font-bold text-muted-foreground">{m.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Recommendations & Ingredients */}
        <div className="flex flex-col gap-8">
          {data.recommendations?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> AI Insights
              </h3>
              <div className="flex flex-col gap-4">
                {data.recommendations.map((rec: { emoji: string; text: string; type: "positive" | "warning" | "tip" }, i: number) => {
                  const styles = rec.type === 'positive' 
                    ? 'border-l-4 border-l-primary bg-primary/5 text-primary shadow-[inset_4px_0_10px_rgba(34,197,94,0.1)]' 
                    : rec.type === 'warning' 
                      ? 'border-l-4 border-l-warning bg-warning/5 text-warning shadow-[inset_4px_0_10px_rgba(251,191,36,0.1)]' 
                      : 'border-l-4 border-l-secondary bg-secondary/5 text-secondary shadow-[inset_4px_0_10px_rgba(6,182,212,0.1)]';
                  
                  const Icon = rec.type === 'positive' ? CheckCircle2 : rec.type === 'warning' ? AlertTriangle : Zap;

                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className={`glass rounded-xl p-5 flex gap-4 items-start ${styles}`}
                    >
                      <div className="mt-0.5 shrink-0 bg-background/50 p-1.5 rounded-md drop-shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm leading-relaxed text-foreground font-medium">{rec.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {data.ingredients?.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ingredients" className="border-none glass-card rounded-2xl px-2">
                <AccordionTrigger className="hover:no-underline px-4 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Info className="w-4 h-4" /> Ingredients Breakout
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2 pt-2">
                    {data.ingredients.map((ing, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-card/50 border border-border/50 text-xs font-medium text-foreground/80">
                        {ing}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}