import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Send,
  Loader2,
  User,
  ArrowRight
} from 'lucide-react';

// Firebase
import { db } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";

export function AdminTicketManager() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // 1. Fetch All Global Tickets
  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Action: Resolve/Close Ticket
  const updateStatus = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
      // Also send a system notification to the user
      await addDoc(collection(db, "notifications"), {
        uid: selectedTicket.uid,
        title: "Ticket Update",
        message: `Your ticket #${ticketId.substring(0,5)} has been marked as ${newStatus}.`,
        type: newStatus === "resolved" ? "success" : "info",
        read: false,
        createdAt: serverTimestamp()
      });
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
      
      {/* LEFT: Ticket List (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Inbound Tickets</h2>
          <span className="bg-cyan-500/10 text-cyan-500 text-[10px] font-black px-2 py-1 rounded border border-cyan-500/20">
            {tickets.length} ACTIVE
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
          {tickets.map(ticket => (
            <motion.div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedTicket?.id === ticket.id 
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(0,217,255,0.1)]' 
                : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-gray-500 uppercase">#{ticket.id.substring(0,6)}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <h3 className="text-xs font-black text-white uppercase mb-1 truncate">{ticket.subject}</h3>
              <p className="text-[10px] text-gray-500 line-clamp-1">{ticket.message}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT: Ticket Details & Response (8 cols) */}
      <div className="lg:col-span-8 bg-[#0f1419]/60 border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden">
        {selectedTicket ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedTicket.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full"
            >
              {/* Ticket Meta */}
              <div className="border-b border-white/5 pb-6 mb-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-cyan-500" />
                    <span className="text-xs font-black text-white uppercase">{selectedTicket.username}</span>
                  </div>
                  <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                    {selectedTicket.subject}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateStatus(selectedTicket.id, 'resolved')}
                    className="px-4 py-2 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-lg border border-green-500/20 hover:bg-green-500 hover:text-black transition-all cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>

              {/* User Message */}
              <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar mb-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{selectedTicket.message}"</p>
                  {selectedTicket.orderId && (
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/5 w-fit px-3 py-1 rounded-md">
                      Target Mission: {selectedTicket.orderId} <ExternalLink size={10} />
                    </div>
                  )}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-4">
                <textarea 
                  placeholder="Draft neural response..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500 resize-none h-24 transition-all"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button 
                  className="w-full py-4 bg-white text-[#0b0e14] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#00D9FF] transition-all cursor-pointer"
                >
                  <Send size={14} /> Dispatch Response
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
            <MessageSquare size={60} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.5em]">No Terminal Selected</p>
          </div>
        )}

        {/* Decorative background glow */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    open: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    resolved: "bg-green-500/10 text-green-500 border-green-500/20",
    closed: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${styles[status] || styles.open}`}>
      {status}
    </span>
  );
}