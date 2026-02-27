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
import { NETWORKS, AIRTIME_AMOUNTS, formatNaira } from "@/lib/constants";

export default function Airtime() {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { balance, deductMoney } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!network) { toast.error("Select a network"); return; }
    if (phone.length !== 11) { toast.error("Enter a valid 11-digit phone number"); return; }
    const num = parseFloat(amount);
    if (isNaN(num) || num < 50) { toast.error("Minimum is ₦50"); return; }
    if (num > balance) { toast.error("Insufficient balance"); return; }
    setLoading(true);
    try {
      await deductMoney(num, `${network} Airtime - ${phone}`, "airtime");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message);
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
          <h2 className="text-2xl font-bold mb-2">Airtime Sent!</h2>
          <p className="text-muted-foreground mb-6">{formatNaira(parseFloat(amount))} {network} airtime to {phone}</p>
          <Button onClick={() => navigate("/dashboard")} className="w-full max-w-xs h-12 text-base font-semibold">Done</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground mb-4">
          <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Buy Airtime</span>
        </button>
        <Card className="p-5 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Network</Label>
              <div className="grid grid-cols-4 gap-2">
                {NETWORKS.map((n) => (
                  <button key={n.name} type="button" onClick={() => setNetwork(n.name)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-colors ${network === n.name ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary"}`}>
                    {n.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" maxLength={11} placeholder="080XXXXXXXX" value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} />
            </div>
            <div className="space-y-2">
              <Label>Amount (₦)</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {AIRTIME_AMOUNTS.map((v) => (
                  <button key={v} type="button" onClick={() => setAmount(v.toString())}
                    className={`py-2 rounded-xl border text-sm font-semibold transition-colors ${amount === v.toString() ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary"}`}>
                    ₦{v.toLocaleString()}
                  </button>
                ))}
              </div>
              <Input type="number" placeholder="Or enter custom amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <p className="text-xs text-muted-foreground">Balance: {formatNaira(balance)}</p>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? "Processing..." : "Buy Airtime"}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
