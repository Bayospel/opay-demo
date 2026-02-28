import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { formatNaira } from "@/lib/constants";
import {
  Eye, EyeOff, Plus, ArrowLeftRight, Bell, ChevronRight,
  Phone, MonitorSmartphone, Gamepad2, Tv, PiggyBank, Landmark, Users, MoreHorizontal,
  Send, Building2, Wallet
} from "lucide-react";

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
    supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3).then(({ data }) => setTransactions(data || []));
    supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false).then(({ count }) => setUnreadCount(count || 0));
  }, [user]);

  const transferActions = [
    { label: "To OPay", icon: Send, path: "/transfer" },
    { label: "To Bank", icon: Building2, path: "/transfer" },
    { label: "Withdraw", icon: Wallet, path: "/transfer" },
  ];

  const services = [
    { label: "Airtime", icon: Phone, path: "/airtime", badge: null },
    { label: "Data", icon: MonitorSmartphone, path: "/airtime", badge: null },
    { label: "Betting", icon: Gamepad2, path: "#", badge: null },
    { label: "TV", icon: Tv, path: "/bills", badge: null },
    { label: "SafeBox", icon: PiggyBank, path: "/savings", badge: null },
    { label: "Loan", icon: Landmark, path: "#", badge: null },
    { label: "Invitation", icon: Users, path: "#", badge: null },
    { label: "More", icon: MoreHorizontal, path: "#", badge: null },
  ];

  const getCategoryIcon = (tx: any) => {
    if (tx.type === "credit") return <Plus className="w-4 h-4 text-primary" />;
    return <ArrowLeftRight className="w-4 h-4 text-primary" />;
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <img src="/opay-logo.png" alt="OPay" className="w-6 h-6" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <span className="text-base font-bold text-foreground">Hi, {profile?.full_name?.split(" ")[0] || "User"}</span>
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

      {/* Balance Card */}
      <div className="px-4 pb-3">
        <div className="opay-gradient p-4 rounded-2xl text-primary-foreground">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">Available Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="opacity-80 hover:opacity-100">
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={() => navigate("/history")} className="text-sm opacity-90 flex items-center gap-1">
              Transaction History <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold">
                {walletLoading ? "..." : showBalance ? formatNaira(balance) : "₦****"}
              </p>
              <ChevronRight className="w-5 h-5 opacity-70" />
            </div>
            <button
              onClick={() => navigate("/add-money")}
              className="bg-primary-foreground text-primary px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1"
            >
              + Add Money
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions (on dashboard, small list) */}
      {transactions.length > 0 && (
        <div className="px-4 pb-3">
          <div className="bg-card rounded-2xl border border-border p-3 space-y-3">
            {transactions.slice(0, 2).map((tx) => (
              <button
                key={tx.id}
                onClick={() => navigate(`/transaction/${tx.id}`)}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
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
        </div>
      )}

      {/* Transfer Actions */}
      <div className="px-4 pb-3">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="grid grid-cols-3 gap-4">
            {transferActions.map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 pb-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="grid grid-cols-4 gap-4">
            {services.map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => path !== "#" && navigate(path)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Saving Challenge */}
      <div className="px-4 pb-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="text-base font-bold text-foreground mb-2">Saving Challenge 2026</h3>
          <button onClick={() => navigate("/savings")} className="flex items-center gap-3 w-full text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Special Target</p>
              <p className="text-xs text-muted-foreground">Start small daily, finish big in 2026</p>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
