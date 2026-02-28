import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User, Settings, Eye, EyeOff, ChevronRight, FileText, Shield,
  CreditCard, Store, Users, MessageCircle, Gift, Lock
} from "lucide-react";
import { toast } from "sonner";
import { formatNaira } from "@/lib/constants";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { balance } = useWallet();
  const [profile, setProfile] = useState<any>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [changingPin, setChangingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single()
      .then(({ data }) => { setProfile(data); setFullName(data?.full_name || ""); setPhone(data?.phone || ""); });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ full_name: fullName, phone }).eq("user_id", user.id);
    setEditing(false);
    toast.success("Profile updated");
    setProfile({ ...profile, full_name: fullName, phone });
  };

  const changePin = async () => {
    if (newPin.length !== 4) { toast.error("PIN must be 4 digits"); return; }
    if (!user) return;
    await supabase.from("profiles").update({ transaction_pin: newPin }).eq("user_id", user.id);
    setChangingPin(false); setNewPin("");
    toast.success("PIN changed successfully");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const menuItems = [
    { label: "Transaction History", desc: null, icon: FileText, path: "/history", badge: null },
    { label: "Account Limits", desc: "View your transaction limits", icon: Shield, path: "#", badge: null },
    { label: "Bank Card/Account", desc: "Linked card/account", icon: CreditCard, path: "#", badge: null },
    { label: "My BizPayment", desc: "Receive payment for business", icon: Store, path: "#", badge: "Fast TFR" },
    { label: "Share OPay with Others", desc: "Help a loved one get an account", icon: Users, path: "#", badge: "New" },
  ];

  const bottomMenu = [
    { label: "Security Center", desc: "Protect your funds", icon: Shield, path: "#" },
    { label: "Customer Service Center", desc: null, icon: MessageCircle, path: "#" },
    { label: "Invitation", desc: "Invite friends and earn up to ₦6,300 Bonus", icon: Gift, path: "#" },
  ];

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{profile?.full_name || "User"}</h2>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">Tier 3</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)}>
            <Settings className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Edit Profile Inline */}
        {editing && (
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3 mb-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveProfile} className="flex-1" size="sm">Save</Button>
              <Button variant="ghost" onClick={() => setEditing(false)} className="flex-1" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* Balance */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground">Total Balance</span>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {showBalance ? formatNaira(balance) : "₦****"}
          </p>
        </div>

        {/* Safety Tips Banner */}
        <div className="opay-gradient rounded-2xl p-4 flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground font-bold text-sm">⚠️ 7 Safety Tips</p>
            <p className="text-primary-foreground text-xs opacity-90">Make your account more secure.</p>
          </div>
          <button className="bg-primary-foreground text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
            View
          </button>
        </div>

        {/* Main Menu */}
        <div className="bg-card rounded-2xl border border-border mb-4 overflow-hidden">
          {menuItems.map(({ label, desc, icon: Icon, path, badge }, i) => (
            <button
              key={label}
              onClick={() => path !== "#" && navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${i < menuItems.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              </div>
              {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === "New" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                  {badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Bottom Menu */}
        <div className="bg-card rounded-2xl border border-border mb-4 overflow-hidden">
          {bottomMenu.map(({ label, desc, icon: Icon, path }, i) => (
            <button
              key={label}
              onClick={() => path !== "#" && navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${i < bottomMenu.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Change PIN */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-sm">Transaction PIN</span>
          </div>
          {changingPin ? (
            <div className="space-y-2">
              <Input type="password" maxLength={4} placeholder="New 4-digit PIN" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))} />
              <div className="flex gap-2">
                <Button size="sm" onClick={changePin}>Save PIN</Button>
                <Button size="sm" variant="ghost" onClick={() => setChangingPin(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setChangingPin(true)}>Change PIN</Button>
          )}
        </div>

        {/* Sign Out */}
        <Button variant="destructive" className="w-full h-12 gap-2 mb-4" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
