import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, TrendingUp, DollarSign, LogOut, MessageCircle } from "lucide-react";

// Firebase Imports
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Component Imports
import { GrowthProtocolModal } from "./GrowthProtocolModal";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { StatsCard } from "./StatsCard";
import { OrderTerminal } from "./OrderTerminal";
import { RecentActivity } from "./RecentActivity";
import { TransactionHistory } from "./TransactionHistory";
import { ServicesGrids } from "./ServicesGrids";
import { OrderHistory } from "./OrderHistory";
import { TopUp } from "./TopUp";
import { Notifications } from "./Notifications";
import { Profile } from "./Profile";
import { SupportTickets } from "./SupportTickets";

export function DashboardScreen({ setView }) {
  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState("new-order");
  const [userData, setUserData] = useState({
    username: "AGENT",
    balance: 0,
    stats: { totalOrders: 0, totalSpent: 0 }
  });

  // 1. REAL-TIME DATA SYNC
  useEffect(() => {
    if (!auth.currentUser) return;

    // Listens to Firestore changes (Balance, Orders, etc.)
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    return () => unsub();
  }, []);

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello ViralWave Support, I need assistance with my dashboard.");
    window.open(`https://wa.me/233549055308?text=${message}`, "_blank");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "new-order":
        return (
          <motion.div key="new-order" {...pageTransition} className="space-y-10">
            <OrderTerminal userData={userData} />
            <RecentActivity onTabChange={setActiveTab} />
          </motion.div>
        );
      
      case "services-grids":
        return (
          <motion.div key="services" {...pageTransition}>
            <ServicesGrids onTabChange={setActiveTab} />
          </motion.div>
        );

      case "order-history":
        return (
          <motion.div key="order-history" {...pageTransition}>
            <OrderHistory />
          </motion.div>
        );

      case "history":
        return (
          <motion.div key="history" {...pageTransition}>
            <TransactionHistory />
          </motion.div>
        );

      case "top-up":
        return (
          <motion.div key="top-up" {...pageTransition}>
            <TopUp />
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div key="notifications" {...pageTransition}>
            <Notifications />
          </motion.div>
        );

      case "profile":
        return (
          <motion.div key="profile" {...pageTransition}>
            <Profile userData={userData} />
          </motion.div>
        );

      case "support":
        return (
          <motion.div key="support" {...pageTransition}>
            <SupportTickets />
          </motion.div>
        );

      default:
        return (
          <motion.div key="default" {...pageTransition} className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Initializing {activeTab}...</h3>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white relative overflow-x-hidden font-sans">
      <GrowthProtocolModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} setView={setView} />

      <div className="ml-20 relative z-10">
        {/* Pass userData AND onTabChange to Header for TopUp/Notifications/Profile navigation */}
        <Header userData={userData} onTabChange={setActiveTab} />
        
        <main className="p-8 max-w-[1600px] mx-auto">
          {/* STATS MONITOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatsCard 
              title="Total Orders" 
              value={userData.stats?.totalOrders || 0} 
              icon={ShoppingCart} 
              trend={[0, 2, 5, userData.stats?.totalOrders]} 
              color="#00D9FF" 
            />
            <StatsCard 
              title="Wallet Balance" 
              value={`$${userData.balance?.toFixed(2)}`} 
              icon={TrendingUp} 
              trend={[0, userData.balance]} 
              color="#00FF88" 
            />
            <StatsCard 
              title="Total Spent" 
              value={`$${userData.stats?.totalSpent?.toFixed(2) || "0.00"}`} 
              icon={DollarSign} 
              trend={[0, userData.stats?.totalSpent]} 
              color="#FF6B9D" 
            />
          </div>

          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
            <button 
              onClick={() => {
                auth.signOut();
                setView('login');
              }}
              className="group flex items-center gap-3 text-gray-600 hover:text-red-500 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer"
            >
              <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
              Terminate Session
            </button>
          </div>
        </main>
      </div>

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(0, 217, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D9FF] opacity-[0.04] blur-[150px] rounded-full" />
      </div>
    </div>
  );
}