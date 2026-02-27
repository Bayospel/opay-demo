import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, LogOut, User, Lock, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [changingPin, setChangingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
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

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold">Profile</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-lg font-bold">{profile?.full_name || "User"}</h2>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>

        {/* Profile Details */}
        <Card className="p-4 rounded-2xl space-y-4 mb-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveProfile} className="flex-1">Save</Button>
                <Button variant="ghost" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold">{profile?.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-semibold">{profile?.phone || "Not set"}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setEditing(true)} className="w-full">Edit Profile</Button>
            </>
          )}
        </Card>

        {/* Change PIN */}
        <Card className="p-4 rounded-2xl space-y-3 mb-4">
          <div className="flex items-center gap-3">
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
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full h-12 gap-2" onClick={handleLogout}>
          <LogOut className="w-5 h-5" /> Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
