import { useGetScanHistory, useDeleteScan, getGetScanHistoryQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Trash2, Image as ImageIcon, Flame, Search, ChevronDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Dashboard } from "@/components/dashboard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import type { ScanResult } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SortOption = "Newest" | "Oldest" | "Highest Score" | "Most Calories";

export default function History() {
  const { data: history, isLoading } = useGetScanHistory({ query: { queryKey: getGetScanHistoryQueryKey() } });
  const deleteScan = useDeleteScan();
  const queryClient = useQueryClient();
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("Newest");

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteScan.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetScanHistoryQueryKey() });
      }
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-primary border-primary shadow-[0_0_10px_rgba(34,197,94,0.3)] bg-primary/10";
    if (score >= 40) return "text-warning border-warning shadow-[0_0_10px_rgba(251,191,36,0.3)] bg-warning/10";
    return "text-destructive border-destructive shadow-[0_0_10px_rgba(248,113,113,0.3)] bg-destructive/10";
  };

  const filteredAndSortedHistory = useMemo(() => {
    if (!history) return [];
    
    let result = [...history];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(scan => scan.foodName.toLowerCase().includes(q));
    }
    
    result.sort((a, b) => {
      switch (sort) {
        case "Newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "Oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "Highest Score": return b.healthScore - a.healthScore;
        case "Most Calories": return b.calories - a.calories;
        default: return 0;
      }
    });
    
    return result;
  }, [history, search, sort]);

  return (
    <div className="flex flex-col gap-8 pb-10 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">Scan History</h1>
            {!isLoading && history && (
              <span className="px-3 py-1 rounded-full bg-card border border-border text-sm font-bold text-muted-foreground">
                {history.length}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-lg">Your past food analyses and health data.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search foods..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 glass border-border/50 focus-visible:ring-primary/50 rounded-xl"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass border-border/50 rounded-xl font-medium justify-between min-w-[140px]">
                {sort} <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-border/50 rounded-xl">
              {(["Newest", "Oldest", "Highest Score", "Most Calories"] as SortOption[]).map(s => (
                <DropdownMenuItem key={s} onClick={() => setSort(s)} className="cursor-pointer focus:bg-primary/20 focus:text-primary rounded-lg font-medium">
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-[320px] rounded-3xl bg-muted/30" />
          ))}
        </div>
      ) : !history || history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute inset-0 glass-card rounded-full border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              <Activity className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-3 text-foreground">No scans yet</h3>
          <p className="text-muted-foreground mb-8 max-w-sm">Start building your nutritional profile by scanning your first meal.</p>
          <Link href="/">
            <Button size="lg" className="rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black border-none glow-green">
              Scan Now <ChevronDown className="w-4 h-4 ml-2 -rotate-90" />
            </Button>
          </Link>
        </div>
      ) : filteredAndSortedHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <Search className="w-10 h-10 mb-4 opacity-20" />
          <p className="text-lg">No foods match "{search}"</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAndSortedHistory.map((scan) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={scan.id} 
                className="glass-card-hover rounded-3xl overflow-hidden cursor-pointer group flex flex-col"
                onClick={() => setSelectedScan(scan)}
              >
                <div className="relative h-52 bg-card w-full shrink-0 flex items-center justify-center overflow-hidden">
                  {scan.imageUrl ? (
                    <img src={scan.imageUrl} alt={scan.foodName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-card to-muted flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center font-black border-2 ${getHealthColor(scan.healthScore)}`}>
                      {scan.healthScore}
                    </div>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 z-10" />
                  
                  <div className="absolute bottom-4 left-5 right-5 text-white z-20">
                    <h3 className="font-black text-xl truncate capitalize drop-shadow-md">{scan.foodName}</h3>
                    <div className="text-xs text-white/70 font-medium drop-shadow-md mt-1">{format(new Date(scan.createdAt), 'MMM d, yyyy • h:mm a')}</div>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-4 flex-1 justify-between bg-card/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-black text-lg text-foreground">
                      <Flame className="w-5 h-5 text-primary" />
                      {scan.calories} <span className="text-xs text-muted-foreground font-medium">kcal</span>
                    </div>
                    <div className="flex gap-2.5 text-xs font-bold">
                      <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-md border border-secondary/20">{parseNum(scan.protein)}<span className="opacity-60 font-medium">P</span></span>
                      <span className="bg-warning/10 text-warning px-2 py-1 rounded-md border border-warning/20">{parseNum(scan.carbs)}<span className="opacity-60 font-medium">C</span></span>
                      <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md border border-destructive/20">{parseNum(scan.fat)}<span className="opacity-60 font-medium">F</span></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/40">
                    <span className="text-xs text-muted-foreground font-medium truncate pr-4">{scan.servingSize}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={(e) => handleDelete(scan.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog open={!!selectedScan} onOpenChange={(open) => !open && setSelectedScan(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:hover:bg-black/80 [&>button]:backdrop-blur-md [&>button]:p-2 [&>button]:rounded-full [&>button]:right-4 [&>button]:top-4 [&>button]:z-50">
          {selectedScan && (
            <div className="max-h-[90vh] overflow-y-auto rounded-3xl scrollbar-none">
              <Dashboard data={selectedScan} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function parseNum(s: string) {
  const match = s.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}