import AppLayout from "@/components/AppLayout";
import { CreditCard } from "lucide-react";

export default function Cards() {
  return (
    <AppLayout>
      <div className="px-4 pt-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">Cards</h1>
        <p className="text-sm text-muted-foreground text-center">Coming soon! Request and manage your debit cards.</p>
      </div>
    </AppLayout>
  );
}
