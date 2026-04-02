import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  MessageCircle, 
  Zap,
  ShieldCheck,
  ChevronLeft,
  Loader2
} from "lucide-react";

// Firebase Imports
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// UI Components
import { DataGridBackground } from "./DataGridBackground";
import { OrderTicker } from "./OrderTicker";

export function SignupScreen({ setView }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // --- DATABASE CONNECTION LOGIC ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Initialize User Profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: formData.name.toUpperCase(),
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        balance: 0.00,
        role: "user",
        createdAt: serverTimestamp(),
        stats: {
          totalOrders: 0,
          totalSpent: 0
        }
      });

      alert("Protocol Activated: Account Created Successfully!");
      setView('login'); // Redirect to login after database write
      
    } catch (error) {
      console.error("Auth Error:", error.code);
      let errorMessage = "Registration Failed.";
      
      if (error.code === 'auth/email-already-in-use') errorMessage = "Email already registered in ViralWave.";
      if (error.code === 'auth/weak-password') errorMessage = "Security risk: Password too weak.";
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello ViralWave Support, I need assistance with my account activation.");
    window.open(`https://wa.me/233549055308?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-[#0b0e14] font-sans selection:bg-[#00D9FF] selection:text-[#0b0e14]">
      <DataGridBackground />
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="p-2 bg-[#00D9FF]/10 rounded-lg border border-[#00D9FF]/20">
                <Zap className="w-8 h-8 text-[#00D9FF]" fill="currentColor" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-[#00D9FF] to-[#00A8CC] bg-clip-text text-transparent uppercase">
                VIRALWAVE
              </h1>
            </motion.div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Activate Growth Protocol // v2.0.6
            </p>
          </div>

          {/* Registration Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D9FF] to-[#00A8CC] rounded-2xl blur opacity-20 transition duration-1000"></div>
            
            <div className="relative bg-[#0f1419]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-8">
                
                {/* Step Progress Bar */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex-1 relative flex items-center">
                        <div className={`h-[2px] w-full transition-all duration-500 ${step <= currentStep ? 'bg-[#00D9FF]' : 'bg-gray-800'}`} />
                        <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-4 border-[#0f1419] transition-all duration-500 ${step <= currentStep ? 'bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]' : 'bg-gray-800'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (currentStep === totalSteps) handleSignup(e);
                  else handleNextStep();
                }}>
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="text" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-[#00D9FF] text-white outline-none" placeholder="EMMANUEL MANU" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Email & Contact</label>
                          <div className="relative mb-4">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="email" required value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-[#00D9FF] text-white outline-none" placeholder="AGENT@VIRALWAVE.COM" />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-[#00D9FF] text-white outline-none" placeholder="+233 XXX XXX XXX" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Security Key</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="password" required value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-[#00D9FF] text-white outline-none" placeholder="••••••••" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-6 flex flex-col gap-3">
                    <motion.button
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-[#00D9FF] text-[#0b0e14] rounded-xl font-black text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(0,217,255,0.3)] flex items-center justify-center gap-2 cursor-pointer uppercase transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : (currentStep === totalSteps ? "Establish Identity" : "Next Protocol")}
                      {!loading && <ArrowRight size={16} />}
                    </motion.button>

                    {currentStep > 1 && (
                      <button type="button" onClick={handlePrevStep} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer">
                        <ChevronLeft size={12} /> Back
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="border-t border-white/5 bg-white/5 p-6 text-center">
                <button onClick={openWhatsApp} className="flex items-center justify-center gap-2 w-full text-[10px] font-black text-[#25D366] tracking-[0.2em] uppercase cursor-pointer">
                  <MessageCircle size={14} /> Connect WhatsApp Support
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase">
              Existing Agent? <button onClick={() => setView('login')} className="text-[#00D9FF] hover:underline cursor-pointer">Log In Here</button>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10">
        <OrderTicker />
      </div>
    </div>
  );
}