import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';

// Firebase Imports
import { db, auth } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";

export function RecentActivity({ onTabChange }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- REAL-TIME FIREBASE CONNECTION ---
  useEffect(() => {
    if (!auth.currentUser) return;

    // Query: Get the latest 4 orders for this user
    const q = query(
      collection(db, "orders"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Logic to determine percentage based on status
        let progress = 0;
        if (data.status === "completed") progress = 100;
        else if (data.status === "processing") progress = data.progress || 65;
        else if (data.status === "pending") progress = 15;

        return {
          id: doc.id.substring(0, 5).toUpperCase(),
          service: data.service,
          status: data.status || "pending",
          progress: progress,
          // Calculate time ago or use formatted string
          time: data.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "Just now",
        };
      });

      setActivities(liveOrders);
      setLoading(false);
    }, (error) => {
      console.error("Activity Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      className="rounded-2xl border p-6 overflow-hidden h-full"
      style={{
        background: "rgba(15, 20, 30, 0.6)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(0, 217, 255, 0.15)",
              border: "1px solid rgba(0, 217, 255, 0.3)",
            }}
          >
            <Clock className="w-5 h-5" style={{ color: "#00D9FF" }} />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
              Recent Activity
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Live Order Tracking
            </p>
          </div>
        </div>
        <button
          onClick={() => onTabChange('order-history')}
          className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            color: "#0b0e14",
            background: "#00D9FF",
            boxShadow: "0 0 15px rgba(0, 217, 255, 0.3)",
          }}
        >
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {loading ? (
           <div className="py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-cyan-500" />
             <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Syncing Feed...</p>
           </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/5 rounded-xl">
             <p className="text-[9px] font-black uppercase tracking-widest text-white/20">No active protocols detected</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="p-4 rounded-xl relative overflow-hidden"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Order Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#00D9FF] uppercase tracking-tighter">
                      Order #{activity.id}
                    </span>
                    <span className="text-[10px] opacity-20 text-white">•</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {activity.time}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight">
                    {activity.service}
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className="px-3 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1.5"
                  style={{
                    background:
                      activity.status === "completed"
                        ? "rgba(0, 255, 136, 0.1)"
                        : "rgba(0, 217, 255, 0.1)",
                    color:
                      activity.status === "completed" ? "#00FF88" : "#00D9FF",
                    border:
                      activity.status === "completed"
                        ? "1px solid rgba(0, 255, 136, 0.2)"
                        : "1px solid rgba(0, 217, 255, 0.2)",
                  }}
                >
                  {activity.status === "processing" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <TrendingUp className="w-2 h-2" />
                    </motion.div>
                  ) : (
                    <CheckCircle className="w-2 h-2" />
                  )}
                  {activity.status}
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-black uppercase mb-1">
                  <span className="text-white/30 tracking-widest">Protocol Progress</span>
                  <span className="text-[#00D9FF]">{activity.progress}%</span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        activity.status === "completed"
                          ? "linear-gradient(90deg, #00FF88, #00CC66)"
                          : "linear-gradient(90deg, #00D9FF, #0099CC)",
                      boxShadow:
                        activity.status === "completed"
                          ? "0 0 10px rgba(0, 255, 136, 0.3)"
                          : "0 0 10px rgba(0, 217, 255, 0.3)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${activity.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}