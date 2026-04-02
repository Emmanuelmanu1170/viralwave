import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Zap, 
  Trash2, 
  Search,
  Clock,
  Circle
} from 'lucide-react';

// Firebase Imports
import { db, auth } from "../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // --- REAL-TIME NOTIFICATION STREAM ---
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt?.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) || "Just now"
      }));
      setNotifications(logs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    const navRef = doc(db, "notifications", id);
    await updateDoc(navRef, { read: true });
  };

  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, "notifications", id));
  };

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "alerts") return n.type === "error" || n.type === "warning";
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* 1. HEADER & CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#00D9FF]/10 border border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
            <Bell className="text-[#00D9FF] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">System Logs</h2>
            <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em]">Neural Network // Notifications</p>
          </div>
        </div>

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
          {["all", "unread", "alerts"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                filter === t ? 'bg-[#00D9FF] text-[#0b0e14]' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. NOTIFICATION FEED */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Syncing Node Logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl">
            <Bell className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">No active transmissions in this sector</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative p-5 rounded-2xl border transition-all ${
                  note.read ? 'bg-[#0f1419]/40 border-white/5' : 'bg-[#00D9FF]/5 border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.05)]'
                }`}
                onClick={() => !note.read && markAsRead(note.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Mapping */}
                  <div className={`mt-1 shrink-0 ${getTypeColor(note.type)}`}>
                    {getTypeIcon(note.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-xs font-black uppercase tracking-tight ${note.read ? 'text-gray-400' : 'text-white'}`}>
                        {note.title}
                      </h4>
                      {!note.read && <Circle size={6} fill="#00D9FF" className="text-[#00D9FF]" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {note.message}
                    </p>
                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock size={10} /> {note.time}</span>
                      <span className="flex items-center gap-1"><Zap size={10} /> Protocol: {note.protocol || "SYS-01"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-500 text-gray-600 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// Helper Functions
function getTypeIcon(type) {
  switch (type) {
    case 'success': return <CheckCircle2 size={20} />;
    case 'error': return <AlertCircle size={20} />;
    case 'info': return <Info size={20} />;
    default: return <Zap size={20} />;
  }
}

function getTypeColor(type) {
  switch (type) {
    case 'success': return 'text-green-500';
    case 'error': return 'text-red-500';
    case 'info': return 'text-cyan-500';
    default: return 'text-purple-500';
  }
}