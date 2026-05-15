import { useGetScanHistory, useDeleteScan, getGetScanHistoryQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Trash2, Image as ImageIcon, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Dashboard } from "@/components/dashboard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import type { ScanResult } from "@workspace/api-client-react";

export default function History() {
  const { data: history, isLoading } = useGetScanHistory({ query: { queryKey: getGetScanHistoryQueryKey() } });
  const deleteScan = useDeleteScan();
  const queryClient = useQueryClient();
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteScan.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetScanHistoryQueryKey() });
      }
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-primary border-primary";
    if (score >= 40) return "text-warning border-warning";
    return "text-destructive border-destructive";
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
        <p className="text-muted-foreground">Your past food analyses and health data.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-[280px] rounded-2xl" />
          ))}
        </div>
      ) : !history || history.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No scans yet</h3>
          <p className="text-muted-foreground">Scan your first meal to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((scan) => (
            <div 
              key={scan.id} 
              className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] transition-all duration-300 group flex flex-col"
              onClick={() => setSelectedScan(scan)}
            >
              <div className="relative h-48 bg-muted/30 w-full shrink-0 flex items-center justify-center">
                {scan.imageUrl ? (
                  <img src={scan.imageUrl} alt={scan.foodName} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <div className={`w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center font-bold border ${getHealthColor(scan.healthScore)}`}>
                    {scan.healthScore}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg truncate drop-shadow-md capitalize">{scan.foodName}</h3>
                  <div className="text-xs text-white/80 drop-shadow-md">{format(new Date(scan.createdAt), 'MMM d, yyyy h:mm a')}</div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4 flex-1 justify-between">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Flame className="w-4 h-4 text-primary" />
                    {scan.calories} kcal
                  </div>
                  <div className="flex gap-3 text-muted-foreground text-xs">
                    <span>{parseNum(scan.protein)}g P</span>
                    <span>{parseNum(scan.carbs)}g C</span>
                    <span>{parseNum(scan.fat)}g F</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{scan.servingSize}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(scan.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedScan} onOpenChange={(open) => !open && setSelectedScan(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          {selectedScan && (
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl">
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
