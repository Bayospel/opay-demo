import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sender_name, recipient_account, recipient_bank, amount } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Try to find a user on the platform whose phone matches the recipient account number
    const { data: recipientProfile } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .eq("phone", recipient_account)
      .maybeSingle();

    if (recipientProfile) {
      // Insert notification for the recipient
      await supabase.from("notifications").insert({
        user_id: recipientProfile.user_id,
        title: "Money Received! 💰",
        message: `You received ₦${Number(amount).toLocaleString()} from ${sender_name} via ${recipient_bank}.`,
      });

      return new Response(
        JSON.stringify({ success: true, notified: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, notified: false, reason: "Recipient not found on platform" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending transfer notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
