import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, History, Scan, Utensils } from "lucide-react";
import { getDailyTotals, DAILY_CALORIE_GOAL } from "@/lib/meal-tracker";
import { Progress } from "@/components/ui/progress";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [totals, setTotals] = useState(getDailyTotals());

  useEffect(() => {
    const handleMealAdded = () => setTotals(getDailyTotals());
    window.addEventListener("meal-added", handleMealAdded);
    return () => window.removeEventListener("meal-added", handleMealAdded);
  }, []);

  const calPct = Math.min(100, Math.max(0, (totals.calories / DAILY_CALORIE_GOAL) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <nav className="w-full md:w-64 glass-card md:border-r border-b md:border-b-0 p-6 flex flex-col gap-8 shrink-0">
        <div className="flex items-center gap-3 text-primary font-bold text-xl tracking-tight">
          <Activity className="w-6 h-6" />
          NutriScan AI
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${location === "/" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Scan className="w-5 h-5" />
            Scanner
          </Link>
          <Link href="/history" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${location === "/history" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <History className="w-5 h-5" />
            History
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-card border border-card-border/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Utensils className="w-4 h-4 text-secondary" />
            Today's Budget
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{Math.round(totals.calories)} kcal</span>
              <span>{DAILY_CALORIE_GOAL} kcal</span>
            </div>
            <Progress value={calPct} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center bg-background rounded-md p-1.5 border border-border/50">
              <div className="text-[10px] text-muted-foreground">Pro</div>
              <div className="text-xs font-medium">{Math.round(totals.protein)}g</div>
            </div>
            <div className="text-center bg-background rounded-md p-1.5 border border-border/50">
              <div className="text-[10px] text-muted-foreground">Carb</div>
              <div className="text-xs font-medium">{Math.round(totals.carbs)}g</div>
            </div>
            <div className="text-center bg-background rounded-md p-1.5 border border-border/50">
              <div className="text-[10px] text-muted-foreground">Fat</div>
              <div className="text-xs font-medium">{Math.round(totals.fat)}g</div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="p-6 md:p-10 max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
