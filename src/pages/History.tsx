import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, ArrowLeftRight } from "lucide-react";
import { formatNaira } from "@/lib/constants";

export default function History() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setTransactions(data || []); setLoading(false); });
  }, [user]);

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold">Transaction History</h1>
        </div>
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => navigate(`/transaction/${tx.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:shadow-sm transition-shadow text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "bg-primary/10" : "bg-destructive/10"}`}>
                  {tx.type === "credit" ? <Plus className="w-5 h-5 text-primary" /> : <ArrowLeftRight className="w-5 h-5 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "credit" ? "text-primary" : "text-destructive"}`}>
                    {tx.type === "credit" ? "+" : "-"}{formatNaira(tx.amount)}
                  </p>
                  <Badge variant="secondary" className="text-[10px]">{tx.status}</Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
