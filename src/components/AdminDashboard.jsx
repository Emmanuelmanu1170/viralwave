import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  AlertCircle, 
  ArrowUpRight, 
  Activity,
  ShieldCheck,
  Zap
} from 'lucide-react';

// Firebase
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrders: 0,
    totalRevenue: 0,
    pendingTickets: 0
  });

  useEffect(() => {
    // 1. Listen for Total Users
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      let revenue = 0;
      snap.docs.forEach(doc => revenue += (doc.data().stats?.totalDeposited || 0));
      setStats(prev => ({ ...prev, totalUsers: snap.size, totalRevenue: revenue }));
    });

    // 2. Listen for Active Orders (Pending/Processing)
    const qOrders = query(collection(db, "orders"), where("status", "in", ["pending", "processing"]));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setStats(prev => ({ ...prev, activeOrders: snap.size }));
    });

    // 3. Listen for Open Tickets
    const qTickets = query(collection(db, "tickets"), where("status", "==", "open"));
    const unsubTickets = onSnapshot(qTickets, (snap) => {
      setStats(prev => ({ ...prev, pendingTickets: snap.size }));
    });

    return () => { unsubUsers(); unsubOrders(); unsubTickets(); };
  }, []);

  const adminCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "#00FF88", desc: "Total Agent Deposits" },
    { label: "Neural Nodes", value: stats.totalUsers, icon: Users, color: "#00D9FF", desc: "Registered Agents" },
    { label: "Active Missions", value: stats.activeOrders, icon: ShoppingCart, color: "#FFB800", desc: "Orders in Progress" },
    { label: "Open Alerts", value: stats.pendingTickets, icon: AlertCircle, color: "#FF4444", desc: "Unresolved Tickets" },
  ];

  return (
    <div className="space-y-10">
      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0f1419]/60 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-[#00FF88] uppercase">
                <TrendingUp size={12} /> Live
              </div>
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">{card.value}</h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{card.label}</p>
            <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-bold text-gray-600 uppercase tracking-tight">
              {card.desc}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. SYSTEM STATUS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* API Latency / Health */}
        <div className="lg:col-span-2 bg-[#0f1419]/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="text-cyan-500" size={20} />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">External Node Latency</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-500/50">V.4.0.1_STABLE</span>
          </div>
          
          <div className="space-y-6">
            <HealthBar label="Main API Gateway" status="Operational" latency="142ms" />
            <HealthBar label="Firestore Database" status="Secure" latency="24ms" />
            <HealthBar label="Auth Protocol" status="Encrypted" latency="8ms" />
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-gradient-to-br from-[#00D9FF]/10 to-transparent border border-[#00D9FF]/20 rounded-3xl p-8">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Zap size={16} className="text-[#00D9FF]" /> Quick Commands
          </h3>
          <div className="space-y-3">
            <AdminButton label="Export Monthly Ledger" />
            <AdminButton label="Purge Failed Missions" />
            <AdminButton label="Broadcast System Alert" />
            <div className="mt-6 p-4 bg-black/40 rounded-2xl border border-white/5">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={14} className="text-[#00FF88]" />
                 <span className="text-[10px] font-black text-white uppercase">Root Protection</span>
               </div>
               <p className="text-[9px] text-gray-500 font-bold leading-relaxed uppercase">
                 Emmanuel, your session is hardware-locked to this Lenovo T550 node.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function HealthBar({ label, status, latency }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
        <span className="text-[11px] font-black text-white uppercase tracking-tight">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-bold text-gray-500 font-mono">{latency}</span>
        <span className="text-[9px] font-black text-[#00FF88] uppercase tracking-widest">{status}</span>
      </div>
    </div>
  );
}

function AdminButton({ label }) {
  return (
    <button className="w-full py-3.5 bg-white/5 hover:bg-[#00D9FF] hover:text-[#0b0e14] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer">
      {label}
    </button>
  );
}