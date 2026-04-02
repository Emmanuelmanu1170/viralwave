import React from 'react';
import { 
  ShoppingCart, 
  Grid3x3, 
  History, 
  Key, 
  HelpCircle, 
  LogOut, 
  PlusCircle, 
  ListOrdered,
  LifeBuoy,
  UserCircle
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { id: "new-order", icon: ShoppingCart, label: "New Order" },
  { id: "services-grids", icon: Grid3x3, label: "Services" },
  { id: "order-history", icon: ListOrdered, label: "Order History" },
  { id: "history", icon: History, label: "Transaction History" },
  { id: "top-up", icon: PlusCircle, label: "Top Up Wallet" },
  { id: "api", icon: Key, label: "API Key" },
  { id: "support", icon: LifeBuoy, label: "Support Tickets" }, // Updated icon/label
  { id: "profile", icon: UserCircle, label: "Agent Profile" }, // Added Profile
];

export function Sidebar({ activeTab, onTabChange, setView }) {
  return (
    <div
      className="w-20 h-screen fixed left-0 top-0 border-r flex flex-col items-center py-6 gap-4 z-[100]"
      style={{
        background: "rgba(11, 14, 20, 0.8)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* 1. BRANDING LOGO */}
      <div className="mb-8">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg italic tracking-tighter cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #00D9FF, #0099CC)",
            color: "#0b0e14",
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
          }}
          onClick={() => onTabChange('new-order')}
        >
          GB
        </motion.div>
      </div>

      {/* 2. DYNAMIC NAVIGATION ENGINE */}
      <nav className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all group cursor-pointer"
              style={{
                background: isActive ? "rgba(0, 217, 255, 0.1)" : "transparent",
                border: isActive ? "1px solid rgba(0, 217, 255, 0.2)" : "1px solid transparent",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                className="w-5 h-5 transition-colors duration-300"
                style={{ color: isActive ? "#00D9FF" : "rgba(255, 255, 255, 0.3)" }}
              />
              
              {/* Active Slide Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-6 rounded-r-full"
                  style={{ background: "#00D9FF", boxShadow: "0 0 10px #00D9FF" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Cyberpunk Tooltip */}
              <div
                className="absolute left-[75px] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap text-[10px] font-black uppercase tracking-widest z-[110] bg-[#0f1419] text-[#00D9FF] border border-white/10 shadow-2xl translate-x-[-10px] group-hover:translate-x-0"
              >
                {item.label}
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* 3. SYSTEM TERMINATION (Logout) */}
      <div className="mt-auto">
        <motion.button 
          onClick={() => {
            if(window.confirm("Terminate secure session?")) {
              setView('login');
            }
          }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer group relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <LogOut size={20} />
          <div className="absolute left-[65px] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all bg-red-500 text-white text-[9px] font-black uppercase tracking-widest whitespace-nowrap pointer-events-none">
            Terminate Session
          </div>
        </motion.button>
      </div>
    </div>
  );
}