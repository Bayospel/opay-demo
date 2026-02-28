import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, CheckCircle2, ChevronRight, Search, X, Building2 } from "lucide-react";
import { toast } from "sonner";
import { NIGERIAN_BANKS, getRandomName, formatNaira } from "@/lib/constants";

type Step = "form" | "confirm" | "pin" | "success";

export default function Transfer() {
  const [step, setStep] = useState<Step>("form");
  const [bank, setBank] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [showBankList, setShowBankList] = useState(false);
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

  const selectedBank = NIGERIAN_BANKS.find(b => b.code === bank);

  const filteredBanks = NIGERIAN_BANKS.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const frequentBanks = NIGERIAN_BANKS.filter(b =>
    ["OPay", "Access Bank", "United Bank for Africa (UBA)", "First Bank of Nigeria", "Guaranty Trust Bank (GTBank)", "Zenith Bank"].includes(b.name) ||
    b.code === "044" || b.code === "033" || b.code === "011" || b.code === "058" || b.code === "057"
  ).slice(0, 6);

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

  // Bank Selection Sheet
  if (showBankList) {
    return (
      <AppLayout>
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setShowBankList(false)}><X className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Select Bank</h1>
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search Bank Name"
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
            />
          </div>

          {!bankSearch && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">Frequently Used Bank</p>
              <div className="grid grid-cols-3 gap-3 bg-muted/50 rounded-2xl p-3">
                {frequentBanks.map(b => (
                  <button
                    key={b.code}
                    onClick={() => { setBank(b.code); setShowBankList(false); }}
                    className="flex flex-col items-center gap-2 py-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground text-center leading-tight">{b.name.split("(")[0].trim()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-0">
            {filteredBanks.map(b => (
              <button
                key={b.code}
                onClick={() => { setBank(b.code); setShowBankList(false); }}
                className="w-full flex items-center gap-3 py-3 border-b border-border text-left"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

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

  // Main Form
  return (
    <AppLayout>
      <div className="px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">Transfer to Bank Account</h1>
          </div>
          <button onClick={() => navigate("/history")} className="text-primary font-semibold text-sm">History</button>
        </div>

        {/* Free Transfers Banner */}
        <div className="bg-secondary rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
          <span className="text-primary font-bold">🌐</span>
          <span className="text-sm text-primary font-medium">Free transfers for the day: <strong>3</strong></span>
        </div>

        {/* Recipient Account Card */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <h3 className="font-bold text-foreground mb-4">Recipient Account</h3>

          <div className="space-y-0">
            <Input
              className="border-0 border-b border-border rounded-none px-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
              placeholder="Enter 10 digits Account Number"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
            {accountName && (
              <p className="text-sm text-primary font-semibold py-2 animate-in fade-in">{accountName}</p>
            )}
            <button
              onClick={() => setShowBankList(true)}
              className="w-full flex items-center justify-between py-3 border-b border-border"
            >
              <span className={`text-sm ${selectedBank ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {selectedBank?.name || "Select Bank"}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Amount & Narration */}
          <div className="mt-4 space-y-3">
            <Input
              type="number"
              placeholder="Amount (₦)"
              className="text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Balance: {formatNaira(balance)}</p>
            <Input
              placeholder="Narration (optional)"
              className="text-sm"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>

          <Button onClick={handleContinue} className="w-full h-12 text-base font-semibold mt-4 rounded-xl">
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
