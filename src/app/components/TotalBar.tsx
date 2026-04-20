import { Calculator } from "lucide-react";

interface TotalBarProps {
  totalWeight: number;
  hydration: number;
}

export default function TotalBar({ totalWeight, hydration }: TotalBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-accent/30 shadow-2xl px-4 py-5">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Calculator className="w-5 h-5 text-accent" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Dough Weight</p>
            <p className="font-medium text-primary">
              {totalWeight.toFixed(1)}g
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
