import React, { useEffect, useState } from 'react';
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, ShieldAlert, LogOut, LayoutDashboard, Users, ShoppingCart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// Replace this with your actual admin email
const ADMIN_EMAIL = "coachemmanuel@gmail.com"; 

export function AdminLayout({ children, setView }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // If not admin, wait 2 seconds then kick back to login
        setTimeout(() => setView('login'), 2000);
      }
    });
    return () => unsub();
  }, [setView]);

  if (authorized === null) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0b0e14] gap-4">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Decrypting Admin Clearance...</p>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0b0e14] p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <ShieldAlert className="text-red-500" size={40} />
        </div>
        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Access Denied</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold max-w-xs leading-relaxed">
          Your identity does not have Root Clearance. Redirecting to standard terminal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] flex">
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-[#0b0e14]/50 backdrop-blur-xl flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h2 className="text-xl font-black italic text-[#00D9FF] tracking-tighter">VIRALWAVE_HQ</h2>
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.3em]">Administrator Mode</p>
        </div>

        <nav className="flex-1 space-y-2">
          <AdminNavItem icon={LayoutDashboard} label="Dashboard" active />
          <AdminNavItem icon={Users} label="Agents Control" />
          <AdminNavItem icon={ShoppingCart} label="Mission Logs" />
          <AdminNavItem icon={MessageSquare} label="Support Tickets" />
        </nav>

        <button 
          onClick={() => { auth.signOut(); setView('login'); }}
          className="mt-auto flex items-center gap-3 p-4 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
        >
          <LogOut size={16} /> Terminate Root Session
        </button>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 p-10 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
}

function AdminNavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all cursor-pointer group ${
      active ? 'bg-cyan-500 text-[#0b0e14]' : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}>
      <Icon size={18} className={active ? '' : 'group-hover:text-cyan-400'} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}