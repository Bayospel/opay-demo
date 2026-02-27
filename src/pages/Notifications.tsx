import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Notifications</h1>
          </div>
          <Button size="sm" variant="ghost" onClick={markAllRead} className="text-primary text-xs">Mark all read</Button>
        </div>
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${n.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${n.read ? "bg-muted" : "bg-primary/10"}`}>
                    {n.read ? <Check className="w-4 h-4 text-muted-foreground" /> : <Bell className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
