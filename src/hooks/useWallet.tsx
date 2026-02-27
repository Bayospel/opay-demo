import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single();
    if (data) setBalance(Number(data.balance));
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance();

    if (!user) return;

    const channel = supabase
      .channel("wallet-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallets", filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new?.balance !== undefined) {
            setBalance(Number(payload.new.balance));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const updateBalance = async (newBalance: number) => {
    if (!user) return;
    await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", user.id);
  };

  const addMoney = async (amount: number, description: string = "Wallet top-up") => {
    if (!user) return;
    const newBalance = balance + amount;
    await updateBalance(newBalance);
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "credit",
      category: "add_money",
      description,
      amount,
    });
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Money Added",
      message: `₦${amount.toLocaleString()} has been added to your wallet.`,
    });
    setBalance(newBalance);
  };

  const deductMoney = async (
    amount: number,
    description: string,
    category: string,
    extra?: { recipient_name?: string; recipient_bank?: string; recipient_account?: string; narration?: string }
  ) => {
    if (!user) return;
    if (amount > balance) throw new Error("Insufficient balance");
    const newBalance = balance - amount;
    await updateBalance(newBalance);
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "debit",
      category,
      description,
      amount,
      ...extra,
    });
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Transaction Successful",
      message: `₦${amount.toLocaleString()} - ${description}`,
    });
    setBalance(newBalance);
  };

  return { balance, loading, addMoney, deductMoney, refetch: fetchBalance };
}
