import type { ScanResult } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addMeal } from "@/lib/meal-tracker";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Flame, Info, Plus, Zap } from "lucide-react";

export function Dashboard({ data }: { data: ScanResult }) {
  const { toast } = useToast();

  const parseNum = (s: string) => {
    const match = s.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const macros = [
    { name: "Protein", value: parseNum(data.protein), color: "hsl(var(--primary))" },
    { name: "Carbs", value: parseNum(data.carbs), color: "hsl(var(--secondary))" },
    { name: "Fat", value: parseNum(data.fat), color: "hsl(var(--warning))" },
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

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-bold text-foreground capitalize tracking-tight">{data.foodName}</h2>
            {data.confidence && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
                {data.confidence}% Match
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{data.servingSize} • {data.healthSummary}</p>
        </div>
        <Button onClick={handleAddMeal} className="shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
          <Plus className="w-4 h-4 mr-2" /> Add to Today
        </Button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-card-border/50 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -mr-8 -mt-8" />
          <Flame className="w-6 h-6 text-primary mb-2 opacity-80" />
          <div className="text-3xl font-black tabular-nums">{data.calories}</div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Calories</div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-card-border/50 flex items-center justify-center">
          <div className="w-full max-w-[120px] aspect-square relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={healthScoreData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black" style={{ color: getHealthColor(data.healthScore) }}>{data.healthScore}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Score</span>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-card rounded-xl p-4 border border-card-border/50 flex items-center gap-4">
          <div className="w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macros} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value">
                  {macros.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            {macros.map(m => (
              <div key={m.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: m.color, color: m.color }} />
                  <span className="text-xs text-muted-foreground font-medium">{m.name}</span>
                </div>
                <span className="text-sm font-bold">{m.value}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {data.dietaryFlags?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Dietary Profile</h3>
              <div className="flex flex-wrap gap-2">
                {data.dietaryFlags.map((flag: string) => (
                  <Badge key={flag} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20 shadow-[0_0_10px_rgba(34,211,238,0.15)] px-3 py-1 text-sm">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.allergens?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" /> Allergens
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.allergens.map((item: string) => (
                  <Badge key={item} variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 shadow-[0_0_10px_rgba(248,113,113,0.15)] px-3 py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.vitamins?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Vitamins & Daily %</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.vitamins} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      formatter={(val: number) => [`${val}%`, 'Daily Value']}
                    />
                    <Bar dataKey="dailyPct" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]}>
                      {data.vitamins.map((v: { name: string; amount: string; dailyPct: number }, i: number) => (
                        <Cell key={i} fill={v.dailyPct > 20 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {data.recommendations?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">AI Insights</h3>
              <div className="flex flex-col gap-3">
                {data.recommendations.map((rec: { emoji: string; text: string; type: "positive" | "warning" | "tip" }, i: number) => (
                  <div key={i} className="bg-card/50 border border-card-border/50 rounded-xl p-4 flex gap-3 items-start">
                    <div className={`mt-0.5 shrink-0 ${rec.type === 'positive' ? 'text-primary' : rec.type === 'warning' ? 'text-warning' : 'text-secondary'}`}>
                      {rec.type === 'positive' ? <CheckCircle2 className="w-5 h-5" /> : rec.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <p className="text-sm leading-relaxed">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.ingredients?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Ingredients Breakout
              </h3>
              <div className="bg-card/30 rounded-xl p-4 border border-card-border/30 text-sm text-muted-foreground leading-relaxed">
                {data.ingredients.join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
