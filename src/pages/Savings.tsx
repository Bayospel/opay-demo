import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { formatNaira } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export default function Savings() {
  const { user } = useAuth();
  const { balance, deductMoney, addMoney } = useWallet();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [fundGoalId, setFundGoalId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchGoals = async () => {
    if (!user) return;
    const { data } = await supabase.from("savings_goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setGoals(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchGoals(); }, [user]);

  const createGoal = async () => {
    if (!user || !newName || !newTarget) { toast.error("Fill in all fields"); return; }
    const target = parseFloat(newTarget);
    if (isNaN(target) || target < 100) { toast.error("Min target is ₦100"); return; }
    await supabase.from("savings_goals").insert({
      user_id: user.id,
      name: newName,
      target_amount: target,
      deadline: newDeadline || null,
    });
    setNewName(""); setNewTarget(""); setNewDeadline("");
    setDialogOpen(false);
    toast.success("Savings goal created!");
    fetchGoals();
  };

  const fundGoal = async (goalId: string) => {
    const num = parseFloat(fundAmount);
    if (isNaN(num) || num < 1) { toast.error("Enter a valid amount"); return; }
    if (num > balance) { toast.error("Insufficient balance"); return; }
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || !user) return;
    try {
      await deductMoney(num, `Savings - ${goal.name}`, "savings");
      await supabase.from("savings_goals").update({ current_amount: goal.current_amount + num }).eq("id", goalId);
      setFundGoalId(null); setFundAmount("");
      toast.success("Savings funded!");
      fetchGoals();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const withdrawGoal = async (goal: any) => {
    if (!user || goal.current_amount <= 0) return;
    await supabase.from("savings_goals").update({ current_amount: 0 }).eq("id", goal.id);
    await addMoney(goal.current_amount, `Savings withdrawal - ${goal.name}`);
    toast.success(`₦${goal.current_amount.toLocaleString()} withdrawn to wallet`);
    fetchGoals();
  };

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Savings</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> New Goal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Savings Goal</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Goal Name</Label>
                  <Input placeholder="e.g. New Phone" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Target Amount (₦)</Label>
                  <Input type="number" placeholder="e.g. 50000" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Deadline (optional)</Label>
                  <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
                </div>
                <Button onClick={createGoal} className="w-full">Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : goals.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <PiggyBank className="w-16 h-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No savings goals yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;
              return (
                <Card key={goal.id} className="p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">{goal.name}</h3>
                    {goal.deadline && <span className="text-xs text-muted-foreground">{new Date(goal.deadline).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saved: {formatNaira(goal.current_amount)}</span>
                    <span className="font-semibold text-foreground">Target: {formatNaira(goal.target_amount)}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{pct.toFixed(0)}%</p>
                  {fundGoalId === goal.id ? (
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} className="flex-1" />
                      <Button size="sm" onClick={() => fundGoal(goal.id)}>Fund</Button>
                      <Button size="sm" variant="ghost" onClick={() => setFundGoalId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => setFundGoalId(goal.id)}>Fund</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => withdrawGoal(goal)}>Withdraw</Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
