import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

// Firebase Imports
import { auth, db } from "../lib/firebase";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export function Profile({ userData }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Form States
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: ""
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (passwords.new !== passwords.confirm) {
      return setError("Passwords do not match.");
    }
    if (passwords.new.length < 6) {
      return setError("Security risk: Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      
      // 1. Update Firebase Authentication
      await updatePassword(user, passwords.new);

      // 2. Update Firestore Database Archive
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastPasswordChange: serverTimestamp(),
        securityLevel: "High"
      });

      setSuccess(true);
      setPasswords({ new: "", confirm: "" });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError("Security Protocol: Please log out and back in to change password.");
      } else {
        setError("System Error: Failed to update security credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
          <User className="text-[#00D9FF] w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Agent Profile</h2>
          <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em]">Identity // Security Terminal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Identity Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f1419]/60 border border-white/10 rounded-3xl p-6 text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-[#0099CC] mx-auto mb-4 flex items-center justify-center text-3xl font-black text-[#0b0e14] shadow-[0_0_30px_rgba(0,217,255,0.2)]">
              {userData?.username?.charAt(0)}
            </div>
            <h3 className="text-lg font-black text-white uppercase italic">{userData?.username}</h3>
            <p className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase mb-4">{userData?.role || 'Premium Agent'}</p>
            
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-left">
                <Mail size={14} className="text-gray-600" />
                <span className="text-[10px] text-gray-400 font-mono truncate">{userData?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Smartphone size={14} className="text-gray-600" />
                <span className="text-[10px] text-gray-400 font-mono">{userData?.phone || "+233 -- --- ----"}</span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-cyan-500 shrink-0" size={18} />
            <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed tracking-tight">
              Your account is protected by <span className="text-cyan-400">ViralWave Encryption</span>. All identity changes are logged for security.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Security Settings */}
        <div className="lg:col-span-2">
          <div className="bg-[#0f1419]/60 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Lock className="text-[#00D9FF]" size={20} />
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Credential Management</h4>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertTriangle size={14} /> {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} /> Security Credentials Updated Successfully
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block ml-1">New Password</label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-cyan-500 outline-none transition-all font-mono"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-[34px] text-gray-600 hover:text-white"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="relative group">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block ml-1">Confirm New Password</label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-cyan-500 outline-none transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full py-4 bg-[#00D9FF] text-[#0b0e14] rounded-xl font-black text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:bg-white transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Security Protocol"}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}