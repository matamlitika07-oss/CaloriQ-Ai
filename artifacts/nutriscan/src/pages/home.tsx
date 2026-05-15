import { useState, useRef, useEffect } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, Scan, Activity, ArrowRight, Lock, CheckCircle2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { ScanResult } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard } from "@/components/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (selected: File | null) => {
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const analyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`${import.meta.env.BASE_URL}api/nutrition/analyze`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err.message || "An error occurred while analyzing the image.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">Nutrition Scanner</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-muted-foreground text-lg">Upload a food photo for instant AI-powered nutritional analysis.</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            AI Ready
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-8">
          {/* Spotlight glow behind upload card */}
          {!preview && (
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-10" />
          )}
          <motion.div 
            className={`relative w-full aspect-square md:aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden transition-colors ${
              dragActive ? 'border-primary bg-primary/10' : preview ? 'border-primary/30 bg-primary/5' : 'border-primary/20 hover:border-primary/50 hover:bg-card/50 glass-card holographic-border'
            } ${!preview && !dragActive ? 'scanner-pulse' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: preview ? 1 : 1.01 }}
            animate={dragActive ? { scale: 1.02 } : { scale: 1 }}
          >
            {/* Animated dashed border effect via SVG could go here, simulating with CSS classes for now */}
            {dragActive && (
              <motion.div 
                className="absolute inset-0 rounded-3xl border-2 border-primary border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            )}
            
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              data-testid="file-upload"
            />
            
            {preview ? (
              <>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center group">
                  <span className="text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <ImageIcon className="w-5 h-5" /> Change Photo
                  </span>
                </div>
                <img src={preview} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover" />
              </>
            ) : (
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full glass border border-card-border flex items-center justify-center mb-6 text-primary shadow-[0_0_30px_rgba(34,197,94,0.15)]"
                >
                  <UploadCloud className="w-10 h-10 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </motion.div>
                <div className="font-bold text-xl mb-2 text-foreground">Drop your food photo here</div>
                <div className="text-sm text-muted-foreground">JPG, PNG, WEBP · Max 5MB</div>
              </div>
            )}
          </motion.div>
          
          <div className="flex justify-center gap-4 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
            <div className="flex items-center gap-1"><FileImage className="w-4 h-4" /> JPG</div>
            <div className="flex items-center gap-1"><FileImage className="w-4 h-4" /> PNG</div>
            <div className="flex items-center gap-1"><FileImage className="w-4 h-4" /> WEBP</div>
          </div>

          <motion.div whileHover={{ scale: (!file || analyzing) ? 1 : 1.02 }} whileTap={{ scale: (!file || analyzing) ? 1 : 0.98 }}>
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black border-none transition-all glow-green shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:shadow-none"
              disabled={!file || analyzing}
              onClick={analyze}
              data-testid="analyze-btn"
            >
              {analyzing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="animate-pulse">AI Analyzing...</span>
                </div>
              ) : (
                <><Scan className="w-6 h-6 mr-2" /> Analyze Nutrition</>
              )}
            </Button>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          {analyzing ? (
            <div className="glass-card rounded-3xl p-8 h-full min-h-[600px] flex flex-col gap-8 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex gap-6 items-center relative z-10">
                <Skeleton className="w-24 h-24 rounded-full bg-muted/50 border-2 border-primary/20" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-10 w-2/3 bg-muted/50" />
                  <Skeleton className="h-5 w-1/3 bg-muted/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-32 rounded-2xl bg-muted/50" />
                ))}
              </div>
              <div className="flex-1 min-h-[200px] grid md:grid-cols-2 gap-6 relative z-10 mt-4">
                <Skeleton className="h-full rounded-2xl bg-muted/50" />
                <Skeleton className="h-full rounded-2xl bg-muted/50" />
              </div>
            </div>
          ) : result ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Dashboard data={result} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="glass-card rounded-3xl p-8 h-full min-h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden border-glow">
              {/* Floating orbs background */}
              <motion.div 
                animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div 
                animate={{ y: [0, 40, 0], x: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto w-full">
                <h3 className="text-3xl font-black mb-4 text-gradient">Ready to Analyze</h3>
                <p className="text-muted-foreground text-lg mb-12">
                  Upload a food photo to unlock full nutritional breakdown, health scores, and personalized AI insights.
                </p>

                {/* Preview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
                  {['Calories', 'Health Score', 'Protein', 'Fiber'].map((label, i) => (
                    <div key={label} className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Lock className="w-5 h-5 text-muted-foreground/40 mb-1" />
                      <div className="w-12 h-3 bg-muted/30 rounded animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
                    </div>
                  ))}
                </div>

                {/* How it works flow */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                    Upload Photo
                  </div>
                  <ArrowRight className="w-4 h-4 text-border hidden md:block" />
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                    AI Processing
                  </div>
                  <ArrowRight className="w-4 h-4 text-border hidden md:block" />
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                    Get Insights
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}