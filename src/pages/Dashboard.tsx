import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Bell, Scan, HelpCircle, Send, Building2, Landmark, Smartphone, Zap, Wifi, Tv, Receipt, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import AppLayout from '@/components/AppLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, loading } = useWallet();
  const [showBalance, setShowBalance] = useState(true);

  const firstName = user?.email?.split('@')[0] || 'User';

  const quickActions = [
    { icon: Send, label: 'To OPay', color: 'bg-emerald-500', action: () => navigate('/transfer') },
    { icon: Building2, label: 'To Bank', color: 'bg-blue-500', action: () => navigate('/transfer') },
    { icon: Landmark, label: 'Withdraw', color: 'bg-orange-500', action: () => navigate('/transfer') },
  ];

  const services = [
    { icon: Smartphone, label: 'Airtime', action: () => navigate('/airtime') },
    { icon: Zap, label: 'Electricity', action: () => navigate('/bills') },
    { icon: Wifi, label: 'Internet', action: () => navigate('/bills') },
    { icon: Tv, label: 'TV', action: () => navigate('/bills') },
    { icon: Receipt, label: 'Bills', action: () => navigate('/bills') },
    { icon: Send, label: 'Betting', action: () => navigate('/bills') },
    { icon: Landmark, label: 'Savings', action: () => navigate('/savings') },
    { icon: MoreHorizontal, label: 'More', action: () => {} },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="opay-gradient px-4 pt-3 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {firstName[0]}
              </div>
              <div>
                <p className="text-white/80 text-xs">Hello,</p>
                <p className="text-white font-semibold text-sm">{firstName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Scan className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => navigate('/notifications')}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative"
              >
                <Bell className="w-4 h-4 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/70 text-xs">Available Balance</p>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? (
                  <Eye className="w-4 h-4 text-white/70" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/70" />
                )}
              </button>
            </div>
            <p className="text-white text-2xl font-bold mb-3">
              {showBalance ? `₦${(balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦****'}
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/add-money')}
                className="bg-white text-emerald-600 px-6 py-2 rounded-full text-sm font-semibold"
              >
                + Add Money
              </button>
              <button
                onClick={() => navigate('/history')}
                className="text-white/80 text-xs underline"
              >
                Transaction History →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 -mt-3">
          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action, i) => (
                <button key={i} onClick={action.action} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="px-4 mt-4">
          <div className="grid grid-cols-4 gap-4">
            {services.map((service, i) => (
              <button key={i} onClick={service.action} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">{service.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
