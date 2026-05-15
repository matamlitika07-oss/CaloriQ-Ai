import { useState, useEffect, useCallback } from "react";
import { useGetScanHistory, getGetScanHistoryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Settings, User, Target, Heart, Database, Download, Trash2, Shield, Zap, Plus, Minus, Save, ChevronRight } from "lucide-react";

const PILL_OPTIONS_FITNESS = ["Weight Loss", "Muscle Gain", "Maintenance", "Endurance"];
const PILL_OPTIONS_DIET = ["Omnivore", "Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free"];
const PILL_OPTIONS_ALLERGIES = ["Gluten", "Dairy", "Nuts", "Shellfish", "Soy", "Eggs"];

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: history = [] } = useGetScanHistory({ query: { queryKey: getGetScanHistoryQueryKey() } });

  // State
  const [displayName, setDisplayName] = useState("CaloriQ User");
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [macros, setMacros] = useState({ protein: 150, carbs: 250, fat: 65 });
  const [prefs, setPrefs] = useState({ allergies: [] as string[], fitnessGoal: "Maintenance", dietType: "Omnivore" });
  const [waterGoal, setWaterGoal] = useState(8);

  // Load from local storage
  useEffect(() => {
    try {
      const name = localStorage.getItem("nutriscan_display_name");
      if (name) setDisplayName(name);

      const cals = localStorage.getItem("nutriscan_calorie_goal");
      if (cals) setCalorieGoal(Number(cals));

      const m = localStorage.getItem("nutriscan_macro_goals");
      if (m) setMacros(JSON.parse(m));

      const p = localStorage.getItem("nutriscan_dietary_prefs");
      if (p) setPrefs(JSON.parse(p));

      const w = localStorage.getItem("nutriscan_water_goal");
      if (w) setWaterGoal(Number(w));
    } catch (e) {
      console.error("Error loading settings", e);
    }
  }, []);

  // Save specific section
  const saveProfile = () => {
    localStorage.setItem("nutriscan_display_name", displayName);
    toast({ title: "Profile saved", description: "Your display name has been updated." });
  };

  const saveGoals = useCallback(() => {
    localStorage.setItem("nutriscan_calorie_goal", calorieGoal.toString());
    localStorage.setItem("nutriscan_macro_goals", JSON.stringify(macros));
    localStorage.setItem("nutriscan_water_goal", waterGoal.toString());
  }, [calorieGoal, macros, waterGoal]);

  const savePrefs = useCallback((newPrefs: typeof prefs) => {
    setPrefs(newPrefs);
    localStorage.setItem("nutriscan_dietary_prefs", JSON.stringify(newPrefs));
  }, []);

  // Auto-save goals when debounced (simulated by just saving on interaction end or explicitly)
  // For simplicity we will save goals whenever they change
  useEffect(() => {
    const timer = setTimeout(saveGoals, 1000);
    return () => clearTimeout(timer);
  }, [calorieGoal, macros, waterGoal, saveGoals]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `nutriscan_history_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    toast({ title: "Export successful", description: "Your nutrition history has been downloaded." });
  };

  const handleClearToday = () => {
    if (confirm("Are you sure you want to clear today's tracked meals? This action cannot be undone.")) {
      const date = new Date();
      const key = `nutriscan_meals_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      localStorage.removeItem(key);
      window.dispatchEvent(new Event("meal-added")); // trigger update
      toast({ title: "Cleared", description: "Today's meals have been cleared." });
    }
  };

  const toggleAllergy = (a: string) => {
    const next = prefs.allergies.includes(a) 
      ? prefs.allergies.filter(x => x !== a) 
      : [...prefs.allergies, a];
    savePrefs({ ...prefs, allergies: next });
  };

  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "NU";

  // Macro Preview Bar calculations
  const totalMacros = macros.protein + macros.carbs + macros.fat;
  const pPct = totalMacros ? (macros.protein / totalMacros) * 100 : 0;
  const cPct = totalMacros ? (macros.carbs / totalMacros) * 100 : 0;
  const fPct = totalMacros ? (macros.fat / totalMacros) * 100 : 0;

  return (
    <div className="flex flex-col gap-8 pb-10 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient flex items-center gap-4">
          <Settings className="w-10 h-10 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground text-lg">Manage your profile, goals, and app preferences.</p>
      </div>

      {/* Section 1: Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start border-glow">
        <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-black text-3xl shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          {initials}
        </div>
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div>
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2 block flex items-center gap-2">
              <User className="w-4 h-4" /> Display Name
            </label>
            <div className="flex gap-3">
              <Input 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)}
                className="glass border-border/50 text-lg h-12 rounded-xl focus-visible:ring-primary/50"
              />
              <Button onClick={saveProfile} className="h-12 px-6 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                <Save className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Daily Goals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-8">
        <h2 className="text-xl font-black flex items-center gap-2 border-b border-border/40 pb-4">
          <Target className="w-6 h-6 text-secondary" /> Daily Nutrition Goals
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                <span>Daily Calories</span>
                <span className="text-primary font-black">{calorieGoal} kcal</span>
              </label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="glass h-10 w-10 shrink-0 rounded-lg" onClick={() => setCalorieGoal(Math.max(1000, calorieGoal - 100))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input 
                  type="number" 
                  value={calorieGoal} 
                  onChange={e => setCalorieGoal(Number(e.target.value))}
                  className="glass text-center font-black text-lg h-10 rounded-lg border-border/50"
                />
                <Button variant="outline" size="icon" className="glass h-10 w-10 shrink-0 rounded-lg" onClick={() => setCalorieGoal(Math.min(5000, calorieGoal + 100))}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                <span>Daily Water</span>
                <span className="text-secondary font-black">{waterGoal} glasses</span>
              </label>
              <Slider 
                value={[waterGoal]} 
                min={4} max={16} step={1}
                onValueChange={(v) => setWaterGoal(v[0])}
                className="py-2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 bg-card/30 p-5 rounded-2xl border border-border/40">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Macro Targets (g)</label>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-foreground"><span>Protein</span> <span className="text-secondary">{macros.protein}g</span></div>
                <Slider value={[macros.protein]} min={50} max={300} step={5} onValueChange={(v) => setMacros(m => ({...m, protein: v[0]}))} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-foreground"><span>Carbs</span> <span className="text-warning">{macros.carbs}g</span></div>
                <Slider value={[macros.carbs]} min={100} max={500} step={5} onValueChange={(v) => setMacros(m => ({...m, carbs: v[0]}))} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-foreground"><span>Fat</span> <span className="text-destructive">{macros.fat}g</span></div>
                <Slider value={[macros.fat]} min={20} max={150} step={1} onValueChange={(v) => setMacros(m => ({...m, fat: v[0]}))} />
              </div>
            </div>

            {/* Live Preview Bar */}
            <div className="mt-2 flex flex-col gap-2">
              <div className="h-3 w-full rounded-full flex overflow-hidden bg-card border border-border/50">
                <div className="bg-secondary transition-all" style={{ width: `${pPct}%` }} />
                <div className="bg-warning transition-all" style={{ width: `${cPct}%` }} />
                <div className="bg-destructive transition-all" style={{ width: `${fPct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                <span>{pPct.toFixed(0)}% P</span>
                <span>{cPct.toFixed(0)}% C</span>
                <span>{fPct.toFixed(0)}% F</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 3: Dietary Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-8">
        <h2 className="text-xl font-black flex items-center gap-2 border-b border-border/40 pb-4">
          <Heart className="w-6 h-6 text-primary" /> Dietary Preferences
        </h2>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Fitness Goal</label>
            <div className="flex flex-wrap gap-2">
              {PILL_OPTIONS_FITNESS.map(goal => (
                <button
                  key={goal}
                  onClick={() => savePrefs({ ...prefs, fitnessGoal: goal })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    prefs.fitnessGoal === goal 
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black border-none shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                      : "glass border-border/50 text-foreground hover:bg-white/5"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Diet Type</label>
            <div className="flex flex-wrap gap-2">
              {PILL_OPTIONS_DIET.map(diet => (
                <button
                  key={diet}
                  onClick={() => savePrefs({ ...prefs, dietType: diet })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    prefs.dietType === diet 
                      ? "bg-primary/20 text-primary border border-primary/40 glow-green" 
                      : "glass border-border/50 text-foreground hover:bg-white/5"
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Common Allergies & Restrictions</label>
            <div className="flex flex-wrap gap-2">
              {PILL_OPTIONS_ALLERGIES.map(allergy => {
                const isActive = prefs.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? "bg-destructive/20 text-destructive border border-destructive/40 shadow-[0_0_15px_rgba(248,113,113,0.2)]" 
                        : "glass border-border/50 text-foreground hover:bg-white/5"
                    }`}
                  >
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 4: Data Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <h2 className="text-xl font-black flex items-center gap-2 border-b border-border/40 pb-4">
          <Database className="w-6 h-6 text-muted-foreground" /> Data Management
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={handleExport} className="glass border-border/50 rounded-2xl p-5 flex flex-col items-start gap-3 hover:bg-white/5 transition-all text-left group">
            <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Export Nutrition History</div>
              <div className="text-sm text-muted-foreground">Download all your scan data as JSON</div>
            </div>
          </button>

          <button onClick={handleClearToday} className="glass border-border/50 rounded-2xl p-5 flex flex-col items-start gap-3 hover:bg-destructive/10 transition-all text-left group">
            <div className="bg-destructive/10 text-destructive p-2 rounded-lg group-hover:scale-110 transition-transform border border-destructive/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-destructive">Clear Today's Meals</div>
              <div className="text-sm text-destructive/70">Reset today's tracked calories & macros</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Section 5: About */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center justify-center text-center gap-4 py-8 opacity-80">
        <div className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> CaloriQ <span className="text-primary drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]">AI</span> <span className="text-sm font-medium text-muted-foreground bg-card px-2 py-0.5 rounded-md border border-border">v1.0</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          <Shield className="w-4 h-4" /> Powered by Claude AI
        </div>
        <div className="flex gap-2 mt-2">
          <span className="text-xs font-bold text-muted-foreground bg-card border border-border/50 px-3 py-1 rounded-full">Replit AI Integrations</span>
          <span className="text-xs font-bold text-muted-foreground bg-card border border-border/50 px-3 py-1 rounded-full">PostgreSQL</span>
        </div>
      </motion.div>

    </div>
  );
}
