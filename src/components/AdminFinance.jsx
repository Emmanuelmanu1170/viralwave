import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ArrowUpRight, 
  ShieldCheck,
  Loader2,
  DollarSign
} from 'lucide-react';

// Firebase
import { db } from "../lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  increment, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

export function AdminFinance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 1. FETCH PENDING TOP-UPS
  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. ACTION: APPROVE TOP-UP (The "Payday" Function)
  const approveTopUp = async (tx) => {
    if (!window.confirm(`Confirm receipt of ${tx.currency} ${tx.amount}?`)) return;
    
    setProcessingId(tx.id);
    try {
      // Step A: Update Transaction Status
      await updateDoc(doc(db, "transactions", tx.id), { status: "completed" });

      // Step B: Increment User Balance
      const userRef = doc(db, "users", tx.uid);
      await updateDoc(userRef, {
        balance: increment(tx.amount),
        "stats.totalDeposited": increment(tx.amount)
      });

      // Step C: Send Notification to User
      await addDoc(collection(db, "notifications"), {
        uid: tx.uid,
        title: "Wallet Funded!",
        message: `Your deposit of ${tx.currency} ${tx.amount} has been verified and added to your balance.`,
        type: "success",
        read: false,
        createdAt: serverTimestamp()
      });

      alert("Node Funded: Balance updated and user notified.");
    } catch (err) {
      console.error("Finance Error:", err);
      alert("Protocol Failed: Check Firebase permissions.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 border border-green-500/20">
            <DollarSign className="text-[#00FF88] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Financial Ledger</h2>
            <p className="text-[10px] font-bold text-green-500/50 uppercase tracking-[0.3em]">ViralWave // Transaction Verification</p>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="bg-[#0f1419]/60 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-5">TX Identifier</th>
                <th className="px-6 py-5">Agent / Method</th>
                <th className="px-6 py-5">Deposit Amount</th>
                <th className="px-6 py-5">Current Status</th>
                <th className="px-6 py-5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 font-mono text-[10px] text-cyan-500 font-bold">
                    #{tx.id.substring(0, 10)}
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="text-xs font-black text-white uppercase">{tx.method}</div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{tx.username || 'System Agent'}</div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">
                        {tx.currency === 'USD' ? '$' : '₵'}{parseFloat(tx.amount).toFixed(2)}
                      </span>
                      <ArrowUpRight size={12} className="text-green-500" />
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      tx.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {tx.status}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    {tx.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => approveTopUp(tx)}
                          disabled={processingId === tx.id}
                          className="p-2 bg-green-500 text-[#0b0e14] rounded-lg hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)] disabled:opacity-50"
                        >
                          {processingId === tx.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        </button>
                        <button 
                          className="p-2 bg-white/5 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    {tx.status === 'completed' && (
                      <ShieldCheck className="ml-auto text-gray-700" size={20} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}