import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2, Copy, ChevronRight } from "lucide-react";
import { formatNaira } from "@/lib/constants";
import { toast } from "sonner";

export default function TransactionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tx, setTx] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;
    supabase.from("transactions").select("*").eq("id", id).eq("user_id", user.id).single()
      .then(({ data }) => setTx(data));
  }, [user, id]);

  const shareReceipt = () => {
    if (!tx) return;
    const text = `OPay Receipt\nRef: ${tx.reference}\nType: ${tx.type}\nAmount: ${formatNaira(tx.amount)}\nDescription: ${tx.description}\n${tx.recipient_name ? `Recipient: ${tx.recipient_name}\nBank: ${tx.recipient_bank}\nAccount: ${tx.recipient_account}\n` : ""}Date: ${new Date(tx.created_at).toLocaleString()}\nStatus: ${tx.status}`;
    navigator.clipboard.writeText(text);
    toast.success("Receipt copied to clipboard");
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (!tx) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto">
          <p className="text-center text-muted-foreground py-20">Loading...</p>
        </div>
      </div>
    );
  }

  const fee = tx.type === "debit" && tx.category === "transfer" ? 10 : 0;
  const amountPaid = tx.amount + fee;
  const txDate = new Date(tx.created_at);
  const formatDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${mm}-${dd} ${hh}:${min}:${ss}`;
  };
  const formatFullDate = (d: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = d.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const initial = tx.recipient_name ? tx.recipient_name.charAt(0).toUpperCase() : tx.type === "credit" ? "+" : "-";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-base">Transaction Details</span>
          </button>
        </div>

        {/* Main receipt card */}
        <div className="mx-4 mt-2 rounded-2xl bg-card border border-border overflow-hidden">
          {/* Avatar & title */}
          <div className="flex flex-col items-center pt-6 pb-4 px-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">{initial}</span>
            </div>
            <p className="text-sm text-foreground text-center font-medium px-4">
              {tx.type === "credit" ? tx.description : `Transfer to ${tx.recipient_name || tx.description}`}
            </p>
            <p className="text-3xl font-extrabold text-foreground mt-2">
              {formatNaira(tx.amount)}
            </p>
            <p className="text-primary font-semibold text-sm mt-1">Successful</p>
          </div>

          {/* Progress steps */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center flex-1">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <div className="h-0.5 bg-primary flex-1 mx-1" />
              </div>
              <div className="flex items-center flex-1">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <div className="h-0.5 bg-primary flex-1 mx-1" />
              </div>
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <div className="text-center">
                <p className="font-medium text-foreground">Payment</p>
                <p>successful</p>
                <p className="mt-0.5">{formatDate(txDate)}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Processing</p>
                <p>by bank</p>
                <p className="mt-0.5">{formatDate(txDate)}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Received</p>
                <p>by bank</p>
                <p className="mt-0.5">{formatDate(new Date(txDate.getTime() + 67000))}</p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="mx-4 mb-4 p-3 rounded-xl bg-muted">
            <p className="text-xs text-muted-foreground italic">
              The recipient account is expected to be credited within 5 minutes, subject to notification by the bank.
            </p>
          </div>

          {/* Amount breakdown */}
          <div className="px-4 pb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">{formatNaira(tx.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-semibold text-foreground">{formatNaira(fee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold text-foreground">{formatNaira(amountPaid)}</span>
            </div>
          </div>
        </div>

        {/* Transaction details card */}
        <div className="mx-4 mt-3 rounded-2xl bg-card border border-border p-4 space-y-3">
          <p className="font-bold text-foreground text-sm">Transaction Details</p>

          {tx.recipient_name && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recipient Details</span>
              <span className="font-semibold text-foreground text-right max-w-[60%] uppercase text-xs tracking-wide">
                {tx.recipient_name} – {tx.recipient_bank} | {tx.recipient_account}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Transaction No.</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-xs tracking-wide">{tx.reference}</span>
              <button onClick={() => copyText(tx.reference)} className="text-muted-foreground">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Payment Method</span>
            <div className="flex items-center gap-0.5">
              <span className="font-semibold text-foreground">Wallet</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction Date</span>
            <span className="font-semibold text-foreground text-xs">{formatFullDate(txDate)}</span>
          </div>

          {tx.narration && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Narration</span>
              <span className="font-semibold text-foreground text-right max-w-[60%]">{tx.narration}</span>
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="mx-4 mt-4 mb-8 flex gap-3">
          <button className="flex-1 h-12 rounded-full border border-primary text-primary font-semibold text-sm">
            Report Issue
          </button>
          <button onClick={shareReceipt} className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            Share Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
