import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  User, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Mail,
  X,
  Send
} from 'lucide-react';
import { DataGridBackground } from './DataGridBackground';

// Firebase Connection
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export function LoginPage({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Recovery States
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setView('dashboard'); 
    } catch (err) {
      console.error('Login Error:', err.code);
      switch (err.code) {
        case 'auth/invalid-credential':
          setError('Access Denied: Invalid Credentials.');
          break;
        case 'auth/user-not-found':
          setError('Identity Error: Node not registered.');
          break;
        case 'auth/too-many-requests':
          setError('Security Alert: Account temporarily locked.');
          break;
        default:
          setError('Protocol Error: Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- PASSWORD RESET LOGIC ---
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setRecoverySuccess(false);
    setError('');

    try {
      await sendPasswordResetEmail(auth, recoveryEmail.trim());
      setRecoverySuccess(true);
      setTimeout(() => {
        setShowRecovery(false);
        setRecoverySuccess(false);
      }, 3000);
    } catch (err) {
      setError("Recovery Error: Target identity not found.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#0b0e14] overflow-hidden">
      <DataGridBackground />
      
      {/* TERMINAL NAV */}
      <button 
        onClick={() => setView('home')}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-cyan-500/50 hover:text-cyan-400 transition-colors font-mono text-[10px] uppercase tracking-[0.3em] cursor-pointer group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Terminal
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0f1419]/80 backdrop-blur-3xl border border-cyan-500/20 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div
              animate={{ filter: ['drop-shadow(0 0 5px rgba(0, 217, 255, 0.2))', 'drop-shadow(0 0 15px rgba(0, 217, 255, 0.5))'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-4 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10"
            >
              <Zap className="w-10 h-10 text-[#00D9FF]" fill="currentColor" />
            </motion.div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">VIRALWAVE</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500/40 mt-3">Authentication Portal</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                  <ShieldAlert size={14} className="shrink-0" /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30 group-focus-within:text-cyan-400" />
              <input type="email" required placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14]/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 text-xs font-mono focus:border-cyan-500/50 outline-none transition-all" />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30 group-focus-within:text-cyan-400" />
              <input type={showPassword ? "text" : "password"} required placeholder="SECURITY PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14]/60 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder:text-gray-700 text-xs font-mono focus:border-cyan-500/50 outline-none transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-cyan-400 cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button disabled={loading} className="w-full bg-[#00D9FF] text-[#0b0e14] font-black uppercase tracking-[0.2em] py-4 rounded-xl text-xs shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:bg-white transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Initialize Session"}
            </button>
          </form>

          <div className="mt-10 flex flex-col gap-4 text-center">
            <button 
              onClick={() => setShowRecovery(true)} 
              className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Request Access Recovery
            </button>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              New Agent? <button onClick={() => setView('signup')} className="text-cyan-500 hover:text-white cursor-pointer">Establish Identity</button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* --- RECOVERY POPUP (MODAL) --- */}
      <AnimatePresence>
        {showRecovery && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRecovery(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#0f1419] border border-cyan-500/30 rounded-3xl p-8 shadow-2xl"
            >
              <button onClick={() => setShowRecovery(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                  <Mail className="text-cyan-500" size={24} />
                </div>
                <h2 className="text-xl font-black italic uppercase text-white">Recovery Protocol</h2>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Reset link will be sent to your uplink</p>
              </div>

              {recoverySuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                  <div className="text-[#00FF88] text-xs font-black uppercase tracking-widest">Protocol Executed</div>
                  <p className="text-gray-400 text-[10px] mt-2">Check your email inbox for the reset link.</p>
                </motion.div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30" />
                    <input 
                      type="email" required placeholder="AGENT EMAIL" 
                      value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-xs outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <button disabled={recoveryLoading} className="w-full bg-white text-[#0b0e14] font-black uppercase tracking-widest py-4 rounded-xl text-[10px] flex items-center justify-center gap-2 hover:bg-[#00D9FF] transition-all">
                    {recoveryLoading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} /> Send Reset Link</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}