import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";
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

  if (!tx) {
    return <AppLayout><p className="text-center text-muted-foreground py-20">Loading...</p></AppLayout>;
  }

  const details = [
    ["Reference", tx.reference],
    ["Type", tx.type === "credit" ? "Credit" : "Debit"],
    ["Category", tx.category],
    ["Amount", formatNaira(tx.amount)],
    ["Description", tx.description],
    ...(tx.recipient_name ? [
      ["Recipient", tx.recipient_name],
      ["Bank", tx.recipient_bank],
      ["Account", tx.recipient_account],
    ] : []),
    ...(tx.narration ? [["Narration", tx.narration]] : []),
    ["Date", new Date(tx.created_at).toLocaleString()],
    ["Status", tx.status],
  ];

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground mb-4">
          <ArrowLeft className="w-5 h-5" /> <span className="font-semibold">Transaction Details</span>
        </button>
        <div className="flex flex-col items-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${tx.type === "credit" ? "bg-primary/10" : "bg-destructive/10"}`}>
            <CheckCircle2 className={`w-8 h-8 ${tx.type === "credit" ? "text-primary" : "text-destructive"}`} />
          </div>
          <p className={`text-2xl font-bold ${tx.type === "credit" ? "text-primary" : "text-destructive"}`}>
            {tx.type === "credit" ? "+" : "-"}{formatNaira(tx.amount)}
          </p>
        </div>
        <Card className="p-4 rounded-2xl space-y-3">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </Card>
        <Button onClick={shareReceipt} variant="outline" className="w-full mt-4 h-12 gap-2">
          <Copy className="w-4 h-4" /> Share Receipt
        </Button>
      </div>
    </AppLayout>
  );
}
