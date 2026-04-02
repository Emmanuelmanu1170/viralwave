import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Ban, 
  UserPlus, 
  Loader2,
  DollarSign
} from 'lucide-react';

// Firebase
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, doc, updateDoc, increment } from "firebase/firestore";

export function AdminUserControl() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch All Agents (Users)
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Action: Update Balance (The "MoMo" Button)
  const updateBalance = async (userId, amount) => {
    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, {
        balance: increment(amount),
        "stats.totalDeposited": increment(amount > 0 ? amount : 0)
      });
      alert(`Protocol Success: $${amount} adjusted.`);
    } catch (err) {
      alert("Encryption Error: Could not update node.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20">
            <Users className="text-[#00D9FF] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Agent Directory</h2>
            <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em]">ViralWave // Neural Network</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text"
            placeholder="Search Agent Identity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-cyan-500 font-bold"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0f1419]/60 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Agent Node</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Neural Override (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="animate-spin text-cyan-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-black text-xs">
                        {user.username?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase">{user.username}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-black text-[#00FF88] font-mono">
                      ${user.balance?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[8px] font-black uppercase rounded border border-cyan-500/20">
                      {user.role || 'Agent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* Add Balance Button */}
                    <button 
                      onClick={() => {
                        const amt = prompt(`Enter USD amount to ADD to ${user.username}:`);
                        if(amt) updateBalance(user.id, parseFloat(amt));
                      }}
                      className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-all cursor-pointer"
                      title="Add Balance"
                    >
                      <Plus size={14} />
                    </button>

                    {/* Subtract Balance Button */}
                    <button 
                      onClick={() => {
                        const amt = prompt(`Enter USD amount to SUBTRACT from ${user.username}:`);
                        if(amt) updateBalance(user.id, -parseFloat(amt));
                      }}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                      title="Subtract Balance"
                    >
                      <Minus size={14} />
                    </button>

                    <button className="p-2 bg-white/5 text-gray-500 rounded-lg hover:text-white transition-all cursor-pointer">
                      <Ban size={14} />
                    </button>
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