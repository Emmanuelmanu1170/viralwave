import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Smartphone, Globe, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';

const PAYMENT_METHODS = [
  { 
    id: "mtn", 
    name: "MTN MoMo", 
    color: "#FFCC00", 
    number: "0549055308", 
    nameHolder: "Emmanuel Manu",
    instructions: "Send directly to the number. Use 'Gigantic' as reference." 
  },
  { 
    id: "voda", 
    name: "Vodafone Cash", 
    color: "#E60000", 
    number: "050XXXXXXX", 
    nameHolder: "Emmanuel Manu",
    instructions: "Send via 'Other Networks' or direct Voda-to-Voda." 
  },
  { 
    id: "eversend", 
    name: "Eversend / USD", 
    color: "#00D9FF", 
    number: "@emanu", 
    nameHolder: "Emmanuel Manu",
    instructions: "Internal transfer or USD bank deposit." 
  }
];

export function TopUp() {
  const [selected, setSelected] = useState(PAYMENT_METHODS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
          <PlusCircle className="text-[#00FF88] w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Wallet Top-Up</h2>
          <p className="text-[10px] font-bold text-[#00FF88]/50 uppercase tracking-[0.3em]">Financial Protocol // Credit Injection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Method Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Select Gateway</label>
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelected(method)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all cursor-pointer ${
                selected.id === method.id 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/5 border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: method.color }} />
                <span className="text-xs font-black uppercase tracking-tight text-white">{method.name}</span>
              </div>
              {selected.id === method.id && <ArrowRight size={14} className="text-white" />}
            </button>
          ))}
        </div>

        {/* Right: Payment Card */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#0f1419]/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Receiver Details</span>
                    <h3 className="text-xl font-black text-white uppercase italic">{selected.name}</h3>
                  </div>
                  <ShieldCheck className="text-green-500/50 w-8 h-8" />
                </div>

                <div className="space-y-6">
                  {/* Account Number */}
                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Account Number / ID</p>
                      <p className="text-2xl font-mono font-black text-[#00D9FF]">{selected.number}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(selected.number)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white cursor-pointer"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="flex justify-between px-2">
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Account Holder</p>
                      <p className="text-xs font-bold text-white">{selected.nameHolder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Currency</p>
                      <p className="text-xs font-bold text-white">{selected.id === 'eversend' ? 'USD' : 'GHS / Cedis'}</p>
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 flex gap-4 items-start">
                    <Smartphone className="text-cyan-500 shrink-0 mt-1" size={18} />
                    <p className="text-[10px] leading-relaxed text-gray-400 font-bold uppercase tracking-tight">
                      {selected.instructions} <br />
                      <span className="text-cyan-500/80">Funds will be credited to your dashboard automatically within 5-15 minutes after confirmation.</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 blur-[80px] pointer-events-none" 
                style={{ backgroundColor: selected.color, opacity: 0.1 }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="text-center p-6 border border-dashed border-white/5 rounded-3xl">
         <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
           Need manual assistance? Contact <span className="text-white">Coach Emmanuel Manu</span> via the support tab.
         </p>
      </div>
    </motion.div>
  );
}