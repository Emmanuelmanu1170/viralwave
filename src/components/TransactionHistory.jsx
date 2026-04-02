import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, ArrowUpRight, CheckCircle2, Clock, AlertCircle, CreditCard, Loader2 } from 'lucide-react';

// Firebase Imports
import { db, auth } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- REAL-TIME FIREBASE CONNECTION ---
  useEffect(() => {
    if (!auth.currentUser) return;

    // Query: Find transactions for THIS user, ordered by newest first
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firebase Timestamp to readable string
        date: doc.data().createdAt?.toDate().toLocaleString() || "Processing..."
      }));
      
      setTransactions(txData);
      setLoading(false);
    }, (error) => {
      console.error("Ledger Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden"
      style={{
        background: "rgba(15, 20, 30, 0.6)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 border border-green-500/20 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
            <History className="text-[#00FF88] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Top-up Ledger</h2>
            <p className="text-[10px] font-bold text-green-500/50 uppercase tracking-[0.3em]">Protocol // Financial Logs</p>
          </div>
        </div>
        
        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-spin' : 'bg-cyan-500 animate-pulse'}`} />
           <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
             {loading ? "Syncing Nodes..." : "Data Stream Active"}
           </span>
        </div>
      </div>

      {/* 2. TRANSACTION TABLE */}
      <div className="overflow-x-auto no-scrollbar">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-cyan-500 animate-spin" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Accessing Secure Ledger...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">No Transaction Records Found</p>
          </div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-6 py-2">Transaction ID</th>
                <th className="px-6 py-2">Gateway / Method</th>
                <th className="px-6 py-2">Credit Amount</th>
                <th className="px-6 py-2">Timestamp</th>
                <th className="px-6 py-2 text-right">Verification</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-5 rounded-l-2xl border-y border-l border-white/5 bg-black/20">
                    <span className="font-mono text-xs text-[#00D9FF] font-black uppercase truncate max-w-[120px] block">
                      {tx.id.substring(0, 12)}...
                    </span>
                  </td>

                  <td className="px-6 py-5 border-y border-white/5 bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <CreditCard size={14} className="text-gray-400" />
                      </div>
                      <span className="text-xs font-black text-white uppercase tracking-tight">{tx.method || "Wallet Load"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 border-y border-white/5 bg-black/20">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">
                        {tx.currency === 'USD' ? '$' : '₵'}{parseFloat(tx.amount).toFixed(2)}
                      </span>
                      <ArrowUpRight size={12} className="text-green-500" />
                    </div>
                  </td>

                  <td className="px-6 py-5 border-y border-white/5 bg-black/20">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tx.date}</span>
                  </td>

                  <td className="px-6 py-5 rounded-r-2xl border-y border-r border-white/5 bg-black/20 text-right">
                    <StatusBadge status={tx.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. DECORATIVE ELEMENTS */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    completed: { color: "#00FF88", icon: CheckCircle2, bg: "rgba(0, 255, 136, 0.1)", border: "rgba(0, 255, 136, 0.2)" },
    pending: { color: "#FFAA00", icon: Clock, bg: "rgba(255, 170, 0, 0.1)", border: "rgba(255, 170, 0, 0.2)" },
    failed: { color: "#FF4444", icon: AlertCircle, bg: "rgba(255, 68, 68, 0.1)", border: "rgba(255, 68, 68, 0.2)" },
  };

  const currentStatus = status?.toLowerCase() || "pending";
  const { color, icon: Icon, bg, border } = styles[currentStatus] || styles.pending;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all"
      style={{ color, backgroundColor: bg, borderColor: border }}
    >
      <Icon size={11} className={currentStatus === "pending" ? "animate-pulse" : ""} />
      {currentStatus}
    </div>
  );
}