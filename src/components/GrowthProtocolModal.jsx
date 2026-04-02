import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import the entire library to avoid "missing export" errors
import * as Lucide from "lucide-react"; 

export function GrowthProtocolModal({ isOpen, onClose }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCount(0);
      const interval = setInterval(() => {
        setCount((prev) => (prev < 9999 ? prev + 127 : 9999));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Define icons from the Lucide object safely
  const TrendingUp = Lucide.TrendingUp;
  const Instagram = Lucide.Instagram || Lucide.Camera; // Fallback if Instagram fails
  const Youtube = Lucide.Youtube || Lucide.Video;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b0e14]/95"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative max-w-2xl w-full rounded-2xl border border-white/10 p-8 bg-[#0f1419]/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,217,255,0.15)]"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic mb-2 tracking-tighter text-[#00D9FF] drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">
                GROWTH PROTOCOL: ACTIVE
              </h2>
              <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent" />
            </div>

            <div className="flex justify-center gap-8 mb-8">
              {[
                { Icon: TrendingUp, label: "TikTok", delay: 0.4 },
                { Icon: Instagram, label: "Instagram", delay: 0.5 },
                { Icon: Youtube, label: "YouTube", delay: 0.6 },
              ].map(({ Icon, label, delay }) => (
                <motion.div key={label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-cyan-500/10 border border-cyan-500/30">
                      {Icon ? <Icon className="w-8 h-8 text-[#00D9FF]" /> : <Lucide.Zap className="w-8 h-8 text-[#00D9FF]" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-black mb-2 text-[#00FF88]">+{count.toLocaleString()}</div>
              <div className="text-[10px] font-black tracking-widest uppercase opacity-60">ENGAGEMENTS PROCESSED TODAY</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-xl font-black text-xs tracking-widest uppercase bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-[#0b0e14] shadow-[0_0_30px_rgba(0,217,255,0.4)] cursor-pointer"
            >
              DISMISS TO TERMINAL
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}