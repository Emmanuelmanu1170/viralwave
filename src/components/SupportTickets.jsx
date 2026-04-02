import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, 
  Send, 
  RefreshCw, 
  Zap, 
  MessageSquare, 
  History, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';

// Firebase Imports
import { db, auth } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";

export function SupportTickets() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTickets, setActiveTickets] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    subject: "Order Refill",
    orderId: "",
    message: ""
  });

  // --- FETCH EXISTING TICKETS ---
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "tickets"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setActiveTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "tickets"), {
        uid: auth.currentUser.uid,
        username: auth.currentUser.email,
        subject: formData.subject,
        orderId: formData.orderId,
        message: formData.message,
        status: "open",
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setFormData({ subject: "Order Refill", orderId: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Ticket Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-10">
      
      {/* 1. HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#00D9FF]/10 border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
          <LifeBuoy className="text-[#00D9FF] w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Support Terminal</h2>
          <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em]">Direct Communication // Ticket System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* 2. TICKET CREATION FORM (Left) */}
        <div className="lg:col-span-3">
          <div className="bg-[#0f1419]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare size={14} className="text-cyan-500" /> Open New Protocol
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Inquiry Subject</label>
                  <div className="relative">
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-xs text-white outline-none focus:border-cyan-500 appearance-none cursor-pointer font-bold"
                    >
                      <option value="Order Refill">Order Refill Request</option>
                      <option value="Speed Up">Speed Up Deployment</option>
                      <option value="Cancellation">Order Cancellation</option>
                      <option value="Payment">Payment / Top-up Issue</option>
                      <option value="Other">General Technical Support</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                  </div>
                </div>

                {/* Order ID Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Mission ID (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. GB-7721"
                    value={formData.orderId}
                    onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Detailed Log / Message</label>
                <textarea 
                  rows="5"
                  required
                  placeholder="Describe your issue in detail so our agents can assist..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-xs text-white outline-none focus:border-cyan-500 resize-none leading-relaxed"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full py-5 bg-[#00D9FF] text-[#0b0e14] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,217,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} /> Dispatch Ticket</>}
              </motion.button>

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={16} /> Ticket Dispatched Successfully
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* 3. TICKET HISTORY (Right) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <History size={14} className="text-cyan-500" /> Active Communications
          </h3>

          <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
            {activeTickets.length === 0 ? (
              <div className="p-8 border border-dashed border-white/5 rounded-3xl text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 leading-relaxed">No active protocol logs found in this sector</p>
              </div>
            ) : (
              activeTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-tighter">#{ticket.id.substring(0,6)}</span>
                    <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                      ticket.status === 'open' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white uppercase mb-1">{ticket.subject}</h4>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mb-3">{ticket.message}</p>
                  <div className="flex items-center justify-between text-[8px] font-black text-gray-600 uppercase">
                     <span>Order: {ticket.orderId || 'N/A'}</span>
                     <span>Sync Status: Verified</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}