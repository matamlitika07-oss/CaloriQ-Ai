import { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, Scan, Activity } from "lucide-react";
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
        <h1 className="text-3xl font-bold tracking-tight">Nutrition Scanner</h1>
        <p className="text-muted-foreground">Upload a food photo for instant AI-powered nutritional analysis.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div 
            className={`relative w-full aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 overflow-hidden ${preview ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-card'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {preview ? (
              <>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Change Photo
                  </span>
                </div>
                <img src={preview} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover" />
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-card border border-card-border flex items-center justify-center mb-4 text-primary">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="font-semibold mb-1">Upload Photo</div>
                <div className="text-xs text-muted-foreground">Drag & drop or click to browse</div>
              </>
            )}
          </div>
          
          <Button 
            size="lg" 
            className="w-full text-base font-semibold shadow-[0_0_20px_rgba(74,222,128,0.2)]"
            disabled={!file || analyzing}
            onClick={analyze}
          >
            {analyzing ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Scan className="w-5 h-5 mr-2" /> Analyze Nutrition</>
            )}
          </Button>
        </div>

        <div className="lg:col-span-2">
          {analyzing ? (
            <div className="glass-card rounded-2xl p-6 h-full min-h-[500px] flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-xl w-full mt-4" />
            </div>
          ) : result ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Dashboard data={result} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="glass-card rounded-2xl p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center border border-dashed border-border">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Activity className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to Analyze</h3>
              <p className="text-muted-foreground max-w-md">
                Upload a photo of your food and our AI will break down its nutritional profile, identify allergens, and give you a health score.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
