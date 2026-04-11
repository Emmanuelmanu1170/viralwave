import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, User, Lock, ArrowLeft, Loader2, ShieldAlert, 
  Eye, EyeOff, Mail, X, Send, ShieldCheck 
} from 'lucide-react';
import { DataGridBackground } from './DataGridBackground';

// Firebase
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function LoginPage({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password.trim()
      );
      const user = userCredential.user;

      // 2. FETCH ROLE FROM FIRESTORE (The Secure Way)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        console.log("Root Identity Verified.");
        setView('admin'); 
      } else {
        setView('dashboard'); 
      }

    } catch (err) {
      console.error('Auth Error:', err.code);
      switch (err.code) {
        case 'auth/invalid-credential':
          setError('Access Denied: Invalid Credentials.');
          break;
        case 'auth/user-not-found':
          setError('Identity Error: Node not registered.');
          break;
        default:
          setError('Protocol Error: Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);
    try {
      await sendPasswordResetEmail(auth, recoveryEmail.trim().toLowerCase());
      setRecoverySuccess(true);
      setTimeout(() => setShowRecovery(false), 3000);
    } catch (err) {
      setError("Recovery Error: Target not found.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#0b0e14] overflow-hidden">
      <DataGridBackground />
      
      <button onClick={() => setView('home')} className="absolute top-8 left-8 z-20 flex items-center gap-2 text-cyan-500/50 hover:text-cyan-400 transition-colors font-mono text-[10px] uppercase tracking-[0.3em]">
        <ArrowLeft size={14} /> Back to Terminal
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-[#0f1419]/80 backdrop-blur-3xl border border-cyan-500/20 rounded-3xl p-8 md:p-10 shadow-2xl">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="mb-4 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
              <Zap className="w-10 h-10 text-[#00D9FF]" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">VIRALWAVE</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500/40 mt-3">Secure Entry Portal</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                  <ShieldAlert size={14} /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30" />
              <input type="email" required placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14]/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-xs font-mono outline-none focus:border-cyan-500/50" />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/30" />
              <input type={showPassword ? "text" : "password"} required placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14]/60 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white text-xs font-mono outline-none focus:border-cyan-500/50" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button disabled={loading} className="w-full bg-[#00D9FF] text-[#0b0e14] font-black uppercase tracking-[0.2em] py-4 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white transition-all">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><ShieldCheck size={16} /> Authenticate Session</>}
            </button>
          </form>

          <div className="mt-10 flex flex-col gap-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            <button onClick={() => setShowRecovery(true)} className="text-gray-600 hover:text-cyan-400">Recovery Access</button>
            <p>New Agent? <button onClick={() => setView('signup')} className="text-cyan-500">Establish Identity</button></p>
          </div>
        </div>
      </motion.div>

      {/* RECOVERY MODAL (Simplified) */}
      <AnimatePresence>
        {showRecovery && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div onClick={() => setShowRecovery(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm bg-[#0f1419] border border-cyan-500/30 rounded-3xl p-8">
              <h2 className="text-xl font-black italic uppercase text-white mb-6">Recovery</h2>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <input type="email" required placeholder="EMAIL" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-white text-xs" />
                <button className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  {recoveryLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
