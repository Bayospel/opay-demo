import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function PinSetup() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = async () => {
    if (step === "create") {
      if (pin.length < 4) { toast.error("Enter a 4-digit PIN"); return; }
      setStep("confirm");
      return;
    }
    if (confirmPin !== pin) { toast.error("PINs don't match"); setConfirmPin(""); return; }
    setLoading(true);
    if (user) {
      await supabase.from("profiles").update({ transaction_pin: pin }).eq("user_id", user.id);
    }
    toast.success("Transaction PIN set successfully!");
    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <img src="/opay-logo.png" alt="OPay" className="h-12 mx-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <h1 className="text-2xl font-bold">{step === "create" ? "Set Transaction PIN" : "Confirm PIN"}</h1>
          <p className="text-muted-foreground text-sm">
            {step === "create" ? "Create a 4-digit PIN for transactions" : "Re-enter your PIN to confirm"}
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP maxLength={4} value={step === "create" ? pin : confirmPin} onChange={step === "create" ? setPin : setConfirmPin}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button onClick={handleNext} className="w-full h-12 text-base font-semibold" disabled={loading}>
          {loading ? "Setting up..." : step === "create" ? "Next" : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
