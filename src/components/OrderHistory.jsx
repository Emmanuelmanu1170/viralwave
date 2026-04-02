import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ListOrdered, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy,
  Check,
  Loader2
} from 'lucide-react';

// Firebase Imports
import { db, auth } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export function OrderHistory() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- REAL-TIME FIREBASE SYNC ---
  useEffect(() => {
    if (!auth.currentUser) return;

    // Query: Get orders for THIS user, newest first
    const q = query(
      collection(db, "orders"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to readable date
        date: doc.data().createdAt?.toDate().toLocaleDateString() || "Recent"
      }));
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Order Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOrders = orders.filter(order => 
    order.service?.toLowerCase().includes(search.toLowerCase()) || 
    order.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 p-6 md:p-8 bg-[#0f1419]/60 backdrop-blur-xl"
    >
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
            <ListOrdered className="text-[#00D9FF] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Order History</h2>
            <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em]">Deployment // Archives</p>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search Mission ID or Protocol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-cyan-500 transition-all font-bold"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto no-scrollbar rounded-2xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-cyan-500 animate-spin" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Syncing Deployment Logs...</p>
          </div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-6 py-2 whitespace-nowrap">Mission ID</th>
                <th className="px-6 py-2 whitespace-nowrap">Protocol / Full Link</th>
                <th className="px-6 py-2 whitespace-nowrap">Quantity</th>
                <th className="px-6 py-2 whitespace-nowrap">Cost (USD)</th>
                <th className="px-6 py-2 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    {/* ID */}
                    <td className="px-6 py-5 bg-black/20 rounded-l-2xl border-y border-l border-white/5 font-mono text-xs text-cyan-500/80 font-bold">
                      {order.id.substring(0, 8)}
                    </td>

                    {/* Service & Full Link */}
                    <td className="px-6 py-5 bg-black/20 border-y border-white/5 min-w-[320px]">
                      <div className="space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-tight">{order.service}</p>
                        <div className="flex items-center gap-2 max-w-xs md:max-w-md">
                          <a 
                            href={order.link?.startsWith('http') ? order.link : `https://${order.link}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[10px] text-gray-400 font-mono break-all hover:text-cyan-400 transition-colors leading-relaxed"
                          >
                            {order.link}
                          </a>
                          <button 
                            onClick={() => handleCopy(order.link, order.id)}
                            className="p-1 hover:bg-white/5 rounded transition-colors text-gray-600 hover:text-cyan-500 shrink-0"
                          >
                            {copiedId === order.id ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                          <ExternalLink size={10} className="text-gray-700 shrink-0" />
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-5 bg-black/20 border-y border-white/5">
                      <span className="text-xs font-black text-white">{order.quantity?.toLocaleString()}</span>
                    </td>

                    {/* Cost */}
                    <td className="px-6 py-5 bg-black/20 border-y border-white/5">
                      <span className="text-xs font-black text-cyan-400 font-mono">${parseFloat(order.cost).toFixed(2)}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5 bg-black/20 rounded-r-2xl border-y border-r border-white/5 text-right">
                      <StatusBadge status={order.status} />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">No Archives Found Matching Query</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    completed: { color: "#00FF88", icon: CheckCircle2, bg: "rgba(0, 255, 136, 0.1)" },
    processing: { color: "#00D9FF", icon: RefreshCw, bg: "rgba(0, 217, 255, 0.1)" },
    pending: { color: "#FFAA00", icon: Clock, bg: "rgba(255, 170, 0, 0.1)" },
    failed: { color: "#FF4444", icon: AlertCircle, bg: "rgba(255, 68, 68, 0.1)" },
  };

  const currentStatus = status?.toLowerCase() || "pending";
  const { color, icon: Icon, bg } = styles[currentStatus] || styles.pending;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all duration-300 hover:brightness-125`}
      style={{ color, backgroundColor: bg }}
    >
      <Icon size={11} className={currentStatus === "processing" ? "animate-spin" : ""} />
      {currentStatus}
    </div>
  );
}