import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, Plus, ArrowLeftRight, ChevronDown, Gift, Percent } from "lucide-react";
import { formatNaira } from "@/lib/constants";

export default function History() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setTransactions(data || []); setLoading(false); });
  }, [user]);

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  const { totalIn, totalOut } = useMemo(() => {
    let totalIn = 0, totalOut = 0;
    transactions.forEach(tx => {
      if (tx.type === "credit") totalIn += tx.amount;
      else totalOut += tx.amount;
    });
    return { totalIn, totalOut };
  }, [transactions]);

  const getCategoryIcon = (tx: any) => {
    if (tx.category === "bonus" || tx.category === "interest") return <Gift className="w-4 h-4 text-primary" />;
    if (tx.type === "credit") return <Percent className="w-4 h-4 text-accent-foreground" />;
    return <ArrowLeftRight className="w-4 h-4 text-primary" />;
  };

  const getIconBg = (tx: any) => {
    if (tx.category === "bonus" || tx.category === "interest") return "bg-primary/10";
    if (tx.type === "credit") return "bg-accent";
    return "bg-secondary";
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Transactions</h1>
          </div>
          <button className="text-primary font-semibold text-sm">Download</button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground">
            {categoryFilter} <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground">
            {statusFilter} <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Month Summary */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h2 className="text-base font-bold text-foreground">{monthLabel}</h2>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
              Analysis
            </button>
          </div>
          <div className="flex gap-6">
            <p className="text-sm">
              <span className="text-muted-foreground italic">In: </span>
              <span className="font-semibold text-foreground">{formatNaira(totalIn)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground italic">Out: </span>
              <span className="font-semibold text-foreground">{formatNaira(totalOut)}</span>
            </p>
          </div>
        </div>

        {/* Transaction List */}
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No transactions yet</p>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => navigate(`/transaction/${tx.id}`)}
                className="w-full flex items-center gap-3 py-3 text-left"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(tx)}`}>
                  {getCategoryIcon(tx)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}, {new Date(tx.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "credit" ? "text-primary" : "text-foreground"}`}>
                    {tx.type === "credit" ? "+" : "-"}{formatNaira(tx.amount)}
                  </p>
                  <span className="text-xs text-primary font-medium">Successful</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
