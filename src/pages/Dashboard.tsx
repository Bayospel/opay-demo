import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/constants";
import { Eye, EyeOff, Plus, ArrowLeftRight, Receipt, Phone, PiggyBank, Landmark, Bell } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { balance, loading: walletLoading } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => setProfile(data));
    supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5).then(({ data }) => setTransactions(data || []));
    supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false).then(({ count }) => setUnreadCount(count || 0));
  }, [user]);

  const quickActions = [
    { label: "Add Money", icon: Plus, path: "/add-money", color: "bg-primary/10 text-primary" },
    { label: "Transfer", icon: ArrowLeftRight, path: "/transfer", color: "bg-blue-100 text-blue-600" },
    { label: "Pay Bills", icon: Receipt, path: "/bills", color: "bg-orange-100 text-orange-600" },
    { label: "Airtime", icon: Phone, path: "/airtime", color: "bg-purple-100 text-purple-600" },
    { label: "Savings", icon: PiggyBank, path: "/savings", color: "bg-yellow-100 text-yellow-600" },
    { label: "Loans", icon: Landmark, path: "#", color: "bg-red-100 text-red-500" },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <img src="/opay-logo.png" alt="OPay" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <button onClick={() => navigate("/notifications")} className="relative p-2">
          <Bell className="w-6 h-6 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Greeting */}
      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground">Hello,</p>
        <h2 className="text-lg font-bold text-foreground">{profile?.full_name || "User"} 👋</h2>
      </div>

      {/* Balance Card */}
      <div className="px-4 pb-4">
        <Card className="opay-gradient p-5 border-0 rounded-2xl text-primary-foreground">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm opacity-90">Wallet Balance</p>
            <button onClick={() => setShowBalance(!showBalance)} className="opacity-80 hover:opacity-100">
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-3xl font-bold">
            {walletLoading ? "..." : showBalance ? formatNaira(balance) : "₦****"}
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ label, icon: Icon, path, color }) => (
            <button
              key={label}
              onClick={() => path !== "#" && navigate(path)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-foreground">Recent Transactions</h3>
          <button onClick={() => navigate("/history")} className="text-sm text-primary font-semibold">See All</button>
        </div>
        {transactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No transactions yet</p>
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
                  <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <p className={`text-sm font-bold ${tx.type === "credit" ? "text-primary" : "text-destructive"}`}>
                  {tx.type === "credit" ? "+" : "-"}{formatNaira(tx.amount)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
