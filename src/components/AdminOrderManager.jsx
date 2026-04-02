import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  MoreVertical,
  Trash2,
  Edit3
} from 'lucide-react';

// Firebase
import { db } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

export function AdminOrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 1. GLOBAL ORDER STREAM
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. ACTION: MANUALLY OVERRIDE STATUS
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { 
        status: newStatus,
        lastUpdated: new Status() // Log the manual change
      });
      alert(`Mission ${orderId.substring(0,5)} updated to ${newStatus}`);
    } catch (err) {
      console.error("Override Failed:", err);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.service?.toLowerCase().includes(search.toLowerCase()) || 
                          o.id?.toLowerCase().includes(search.toLowerCase()) ||
                          o.username?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* 1. CONTROL PANEL */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
            <ShoppingCart className="text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Mission Logs</h2>
            <p className="text-[10px] font-bold text-purple-500/50 uppercase tracking-[0.3em]">Global Order Management</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search Order/Agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-purple-500 transition-all font-bold"
            />
          </div>

          {/* STATUS FILTER */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500 font-black uppercase tracking-widest cursor-pointer"
          >
            <option value="all">ALL MISSIONS</option>
            <option value="pending">PENDING</option>
            <option value="processing">PROCESSING</option>
            <option value="completed">COMPLETED</option>
            <option value="failed">FAILED</option>
          </select>
        </div>
      </div>

      {/* 2. DATA GRID */}
      <div className="bg-[#0f1419]/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-5">Mission ID</th>
                <th className="px-6 py-5">Agent / Service</th>
                <th className="px-6 py-5">Target Link</th>
                <th className="px-6 py-5">Volume/Cost</th>
                <th className="px-6 py-5 text-right">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* ID */}
                  <td className="px-6 py-5 font-mono text-[10px] text-purple-400 font-bold">
                    #{order.id.substring(0, 8)}
                  </td>

                  {/* USER & SERVICE */}
                  <td className="px-6 py-5">
                    <div className="text-xs font-black text-white uppercase mb-0.5">{order.service}</div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{order.username || 'System Agent'}</div>
                  </td>

                  {/* LINK */}
                  <td className="px-6 py-5">
                    <a 
                      href={order.link} target="_blank" rel="noreferrer"
                      className="text-[10px] text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1 truncate max-w-[200px]"
                    >
                      {order.link} <ExternalLink size={10} />
                    </a>
                  </td>

                  {/* QUANTITY / COST */}
                  <td className="px-6 py-5">
                    <div className="text-xs font-black text-white">{order.quantity?.toLocaleString()}</div>
                    <div className="text-[9px] text-green-500 font-bold font-mono">${parseFloat(order.cost).toFixed(2)}</div>
                  </td>

                  {/* ACTION DROPDOWN */}
                  <td className="px-6 py-5 text-right">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border cursor-pointer outline-none transition-all ${
                        order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        order.status === 'processing' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' :
                        order.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="canceled">Canceled</option>
                    </select>
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