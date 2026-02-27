import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    if (otp.length < 4) { toast.error("Enter a 4-digit code"); return; }
    setLoading(true);
    setTimeout(() => {
      toast.success("Phone verified successfully!");
      navigate("/pin-setup");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <img src="/opay-logo.png" alt="OPay" className="h-12 mx-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="text-muted-foreground text-sm">Enter the 4-digit code sent to your phone</p>
        </div>
        <div className="flex justify-center">
          <InputOTP maxLength={4} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-xs text-muted-foreground">(Enter any 4 digits — this is simulated)</p>
        <Button onClick={handleVerify} className="w-full h-12 text-base font-semibold" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  );
}
