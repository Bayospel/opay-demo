import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { formatNaira } from "@/lib/constants";

export default function AddMoney() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addMoney } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num < 100) { toast.error("Minimum amount is ₦100"); return; }
    setLoading(true);
    try {
      await addMoney(num, note || "Wallet top-up");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Success!</h2>
          <p className="text-muted-foreground mb-6">{formatNaira(parseFloat(amount))} added to your wallet</p>
          <Button onClick={() => navigate("/dashboard")} className="w-full max-w-xs h-12 text-base font-semibold">
            Back to Home
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground mb-4">
          <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Add Money</span>
        </button>
        <Card className="p-5 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (₦)</Label>
              <Input type="number" placeholder="Enter amount (min ₦100)" value={amount} onChange={(e) => setAmount(e.target.value)} min={100} required />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000, 10000].map((v) => (
                <button key={v} type="button" onClick={() => setAmount(v.toString())}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  ₦{v.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Input placeholder="e.g. Salary" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? "Adding..." : "Add Money"}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
