import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BILL_CATEGORIES, formatNaira } from "@/lib/constants";

export default function Bills() {
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { balance, deductMoney } = useWallet();
  const navigate = useNavigate();

  const selectedCategory = BILL_CATEGORIES.find((c) => c.name === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!category || !provider) { toast.error("Select category and provider"); return; }
    if (!meterNumber) { toast.error("Enter meter/card number"); return; }
    if (isNaN(num) || num < 100) { toast.error("Minimum amount is ₦100"); return; }
    if (num > balance) { toast.error("Insufficient balance"); return; }
    setLoading(true);
    try {
      await deductMoney(num, `${category} bill - ${provider}`, "bills");
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
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">{formatNaira(parseFloat(amount))} paid for {category}</p>
          <Button onClick={() => navigate("/dashboard")} className="w-full max-w-xs h-12 text-base font-semibold">Done</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground mb-4">
          <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Pay Bills</span>
        </button>
        <Card className="p-5 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); setProvider(""); }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {BILL_CATEGORIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedCategory && (
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                  <SelectContent>
                    {selectedCategory.providers.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Meter/Smart Card Number</Label>
              <Input placeholder="Enter number" value={meterNumber} onChange={(e) => setMeterNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Amount (₦)</Label>
              <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <p className="text-xs text-muted-foreground">Balance: {formatNaira(balance)}</p>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
