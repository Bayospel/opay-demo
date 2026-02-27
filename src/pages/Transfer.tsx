import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { NIGERIAN_BANKS, getRandomName, formatNaira } from "@/lib/constants";

type Step = "form" | "confirm" | "pin" | "success";

export default function Transfer() {
  const [step, setStep] = useState<Step>("form");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const { balance, deductMoney } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accountNumber.length === 10 && bank) {
      setAccountName(getRandomName());
    } else {
      setAccountName("");
    }
  }, [accountNumber, bank]);

  const handleContinue = () => {
    const num = parseFloat(amount);
    if (!bank) { toast.error("Select a bank"); return; }
    if (accountNumber.length !== 10) { toast.error("Enter a valid 10-digit account number"); return; }
    if (isNaN(num) || num < 1) { toast.error("Enter a valid amount"); return; }
    if (num > balance) { toast.error("Insufficient balance"); return; }
    setStep("confirm");
  };

  const handleConfirm = () => setStep("pin");

  const handlePinSubmit = async () => {
    if (pin.length < 4) { toast.error("Enter your 4-digit PIN"); return; }
    setLoading(true);
    try {
      // Verify PIN
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("transaction_pin").eq("user_id", user.id).single();
        if (profile?.transaction_pin && profile.transaction_pin !== pin) {
          toast.error("Incorrect PIN"); setPin(""); setLoading(false); return;
        }
      }
      const bankName = NIGERIAN_BANKS.find(b => b.code === bank)?.name || bank;
      await deductMoney(parseFloat(amount), `Transfer to ${accountName}`, "transfer", {
        recipient_name: accountName,
        recipient_bank: bankName,
        recipient_account: accountNumber,
        narration,
      });
      setStep("success");
    } catch (err: any) {
      toast.error(err.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Transfer Successful!</h2>
          <p className="text-muted-foreground mb-1">{formatNaira(parseFloat(amount))} sent to</p>
          <p className="font-semibold text-foreground mb-6">{accountName}</p>
          <Button onClick={() => navigate("/dashboard")} className="w-full max-w-xs h-12 text-base font-semibold">Done</Button>
        </div>
      </AppLayout>
    );
  }

  if (step === "pin") {
    return (
      <AppLayout>
        <div className="px-4 pt-4">
          <button onClick={() => setStep("confirm")} className="flex items-center gap-2 text-foreground mb-4">
            <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Enter PIN</span>
          </button>
          <div className="flex flex-col items-center space-y-6 mt-12">
            <p className="text-muted-foreground">Enter your transaction PIN</p>
            <InputOTP maxLength={4} value={pin} onChange={setPin}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <Button onClick={handlePinSubmit} className="w-full max-w-xs h-12 text-base font-semibold" disabled={loading}>
              {loading ? "Processing..." : "Confirm Transfer"}
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (step === "confirm") {
    const bankName = NIGERIAN_BANKS.find(b => b.code === bank)?.name || bank;
    return (
      <AppLayout>
        <div className="px-4 pt-4">
          <button onClick={() => setStep("form")} className="flex items-center gap-2 text-foreground mb-4">
            <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Confirm Transfer</span>
          </button>
          <Card className="p-5 rounded-2xl space-y-4">
            <div className="text-center pb-2 border-b border-border">
              <p className="text-sm text-muted-foreground">You are sending</p>
              <p className="text-3xl font-bold text-primary">{formatNaira(parseFloat(amount))}</p>
            </div>
            {[
              ["Recipient", accountName],
              ["Bank", bankName],
              ["Account", accountNumber],
              ["Narration", narration || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
            <Button onClick={handleConfirm} className="w-full h-12 text-base font-semibold">Continue</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground mb-4">
          <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Transfer</span>
        </button>
        <Card className="p-5 rounded-2xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bank</Label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_BANKS.map((b) => (
                    <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input type="text" maxLength={10} placeholder="10-digit account number" value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} />
              {accountName && (
                <p className="text-sm text-primary font-semibold animate-in fade-in">{accountName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Amount (₦)</Label>
              <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <p className="text-xs text-muted-foreground">Balance: {formatNaira(balance)}</p>
            </div>
            <div className="space-y-2">
              <Label>Narration (optional)</Label>
              <Input placeholder="e.g. For rent" value={narration} onChange={(e) => setNarration(e.target.value)} />
            </div>
            <Button onClick={handleContinue} className="w-full h-12 text-base font-semibold">Continue</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
