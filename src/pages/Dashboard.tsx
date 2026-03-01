import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Bell, Scan, HelpCircle, ChevronRight, Send, Building2, Landmark, Smartphone, BarChart3, Settings, Tv, Shield, Banknote, Mail, MoreHorizontal, Target, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, loading } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (!user) return;
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);
      if (data) setRecentTransactions(data);
    };
    fetchRecent();
  }, [user]);

  const quickActions = [
    { icon: Send, label: 'To OPay', color: 'bg-primary', action: () => navigate('/transfer') },
    { icon: Building2, label: 'To Bank', color: 'bg-primary', action: () => navigate('/transfer') },
    { icon: Landmark, label: 'Withdraw', color: 'bg-primary', action: () => navigate('/transfer') },
  ];

  const services = [
    { icon: BarChart3, label: 'Airtime', badge: 'Up to 6%', action: () => navigate('/airtime') },
    { icon: BarChart3, label: 'Data', badge: 'Up to 6%', action: () => navigate('/bills') },
    { icon: Settings, label: 'Betting', action: () => navigate('/bills') },
    { icon: Tv, label: 'TV', action: () => navigate('/bills') },
    { icon: Shield, label: 'SafeBox', action: () => navigate('/savings') },
    { icon: Banknote, label: 'Loan', action: () => navigate('/bills') },
    { icon: Mail, label: 'Invitation', action: () => navigate('/bills') },
    { icon: MoreHorizontal, label: 'More', action: () => {} },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const time = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${month} ${day}${suffix}, ${time}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'airtime': return Smartphone;
      case 'betting': return Settings;
      case 'transfer': return Send;
      default: return ShoppingCart;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="px-4 pt-3 pb-2 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center text-white font-bold text-sm relative">
                {firstName[0]}
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[8px] text-primary-foreground flex items-center justify-center font-bold">
                  3
                </span>
              </div>
              <span className="text-foreground font-semibold text-base">Hi, {firstName}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative">
                <HelpCircle className="w-6 h-6 text-foreground" />
                <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[8px] px-1 rounded font-bold">HELP</span>
              </button>
              <button>
                <Scan className="w-6 h-6 text-foreground" />
              </button>
              <button onClick={() => navigate('/notifications')} className="relative">
                <Bell className="w-6 h-6 text-foreground" />
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-destructive rounded-full text-[9px] text-destructive-foreground flex items-center justify-center font-bold px-1">
                  91
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="px-4 mt-2">
          <div className="opay-gradient rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-primary-foreground/90 text-sm font-medium">Available Balance</span>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? (
                    <Eye className="w-4 h-4 text-primary-foreground/70" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-primary-foreground/70" />
                  )}
                </button>
              </div>
              <button onClick={() => navigate('/history')} className="text-primary-foreground/90 text-xs flex items-center gap-1">
                Transaction History <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-primary-foreground text-2xl font-bold">
                  {showBalance ? `₦${(balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦****'}
                </span>
                <ChevronRight className="w-5 h-5 text-primary-foreground/70" />
              </div>
              <button
                onClick={() => navigate('/add-money')}
                className="bg-primary-foreground text-primary px-5 py-2 rounded-full text-sm font-semibold"
              >
                + Add Money
              </button>
            </div>
            {/* Business Service Bar */}
            <div className="bg-primary-foreground/10 rounded-xl px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary-foreground/80" />
                <span className="text-primary-foreground/90 text-xs">
                  Business Service - Today's Sales: <span className="text-primary-foreground font-semibold">₦0.00</span>
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-primary-foreground/60" />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 mt-3">
          <div className="bg-card rounded-2xl p-4">
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((tx) => {
                  const Icon = getCategoryIcon(tx.category);
                  const isCredit = tx.type === 'credit';
                  return (
                    <button
                      key={tx.id}
                      onClick={() => navigate(`/transaction/${tx.id}`)}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-purple-100' : 'bg-secondary'}`}>
                          <Icon className={`w-5 h-5 ${isCredit ? 'text-purple-500' : 'text-primary'}`} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isCredit ? 'text-primary' : 'text-foreground'}`}>
                          {isCredit ? '+' : '-'}₦{Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-primary font-medium">Successful</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-3">
          <div className="bg-card rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action, i) => (
                <button key={i} onClick={action.action} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="px-4 mt-3">
          <div className="bg-card rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-4">
              {services.map((service, i) => (
                <button key={i} onClick={service.action} className="flex flex-col items-center gap-2 relative">
                  {service.badge && (
                    <span className="absolute -top-1 left-1/2 translate-x-1 bg-destructive text-destructive-foreground text-[8px] px-1.5 py-0.5 rounded-sm font-bold z-10">
                      {service.badge}
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saving Challenge Banner */}
        <div className="px-4 mt-3 mb-4">
          <div className="bg-secondary rounded-2xl p-4">
            <h3 className="text-foreground font-bold text-base mb-3">Saving Challenge 2026</h3>
            <div className="border-t border-dashed border-primary/30 pt-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Special Target</p>
                  <p className="text-xs text-muted-foreground italic">Start small daily, finish big in 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
