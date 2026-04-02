import React from 'react';
import { User, Wallet, Bell, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function Header({ userData, onTabChange }) {
  // Fallback values if userData is still loading from Firebase
  const balance = userData?.balance ?? 0;
  const username = userData?.username || "AGENT";
  const role = userData?.role || "User";

  return (
    <header
      className="h-20 border-b flex items-center justify-between px-8 sticky top-0 z-50"
      style={{
        background: "rgba(11, 14, 20, 0.8)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* 1. BRANDING / NODE STATUS */}
      <div 
        className="flex items-center gap-6 cursor-pointer group"
        onClick={() => onTabChange('new-order')}
      >
        <div>
          <h1 className="text-xl font-black italic tracking-tighter group-hover:text-white transition-colors" style={{ color: "#00D9FF" }}>
            VIRALWAVE
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: "rgba(255, 255, 255, 0.3)" }}>
              Node Online // SECURE_SESSION
            </p>
          </div>
        </div>
      </div>

      {/* 2. USER DATA CLUSTER */}
      <div className="flex items-center gap-4">
        
        {/* REAL-TIME BALANCE (Navigates to Top Up) */}
        <motion.div
          className="px-5 py-2 rounded-xl flex items-center gap-3 relative overflow-hidden cursor-pointer"
          style={{
            background: "rgba(0, 217, 255, 0.03)",
            border: "1px solid rgba(0, 217, 255, 0.1)",
          }}
          whileHover={{ scale: 1.02, borderColor: "rgba(0, 217, 255, 0.3)" }}
          onClick={() => onTabChange('top-up')}
        >
          <Wallet className="w-4 h-4 text-[#00D9FF]" />
          <div>
            <div className="text-[8px] font-black uppercase tracking-widest text-gray-500">
              Credits Available
            </div>
            <div className="text-sm font-black font-mono text-[#00FF88]">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(90deg, transparent 0%, rgba(0,217,255,0) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.05) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(0,217,255,0) 50%, transparent 100%)",
              ],
              x: ["-100%", "100%"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* NOTIFICATIONS (Explicitly navigates to 'notifications') */}
        <motion.button
          onClick={() => onTabChange('notifications')}
          className="w-10 h-10 rounded-xl flex items-center justify-center relative group cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
          whileHover={{ scale: 1.05, background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(0, 217, 255, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-4 h-4 text-gray-400 group-hover:text-[#00D9FF] transition-colors" />
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" />
        </motion.button>

        <div className="w-[1px] h-8 bg-white/5 mx-2" />

        {/* PROFILE IDENTIFIER (Explicitly navigates to 'profile') */}
        <motion.div
          onClick={() => onTabChange('profile')}
          className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl border border-transparent hover:border-[#00D9FF]/20 hover:bg-[#00D9FF]/5 transition-all cursor-pointer group"
          whileHover={{ x: 2 }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(0,217,255,0.2)]"
            style={{
              background: "linear-gradient(135deg, #00D9FF, #0099CC)",
              color: "#0b0e14",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-[#00D9FF] transition-colors">
              {username}
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={10} className="text-[#00D9FF]" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                {role} Account
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}