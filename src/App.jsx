import React, { useState, useEffect } from 'react';

// Explicit Imports to avoid "index.js" errors on your Lenovo T550
import { HeroSection } from "./components/HeroSection";
import { StatsTicker } from "./components/StatsTicker";
import { ServicesGrid } from "./components/ServicesGrid";
import { WhyUsSection } from "./components/WhyUsSection";
import { Footer } from "./components/Footer";
import { SignupScreen } from "./components/SignupScreen";
import { LoginPage } from "./components/LoginPage";
import { DashboardScreen } from "./components/DashboardScreen";

// Firebase Integration
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [view, setView] = useState('home');
  const [initializing, setInitializing] = useState(true);

  // --- GLOBAL SUPPORT CONFIG ---
  const WHATSAPP_NUMBER = "233549055308";
  
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello ViralWave Support, I need assistance with my account.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  // --- FIREBASE AUTH PERSISTENCE ENGINE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to dashboard if logged in
        setView('dashboard');
      } else {
        // If logged out and trying to access dashboard, force home
        setView((prev) => (prev === 'dashboard' ? 'home' : prev));
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  // Show nothing while checking session status
  if (initializing) return null;

  return (
    <div className="dark min-h-screen bg-[#0b0e14] text-white font-sans antialiased selection:bg-cyan-500/30">
      
      {/* NAVBAR: Dynamic logic to hide in Dashboard */}
      {view !== 'dashboard' && (
        <nav className="flex justify-between items-center px-6 md:px-10 py-6 border-b border-white/10 sticky top-0 bg-[#0b0e14]/80 backdrop-blur-md z-[200]">
          <div 
            className="text-2xl font-black italic text-[#00D9FF] cursor-pointer tracking-tighter hover:scale-105 transition-transform" 
            onClick={() => setView('home')}
          >
            VIRALWAVE
          </div>
          
          <div className="flex items-center gap-6">
            {/* Support Link integrated into Nav */}
            <button 
              onClick={openWhatsApp}
              className="hidden md:block text-[10px] font-black uppercase tracking-widest text-cyan-500/50 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Support
            </button>
            <button 
              onClick={() => setView('login')} 
              className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#00D9FF] cursor-pointer transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => setView('signup')} 
              className="bg-[#00D9FF] text-[#0b0e14] px-8 py-2.5 rounded-lg font-black uppercase text-xs tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] active:scale-95 cursor-pointer"
            >
              SIGNUP
            </button>
          </div>
        </nav>
      )}

      <main>
        {/* LANDING PAGE ENGINE */}
        {view === 'home' && (
          <div className="animate-in fade-in duration-700">
            {/* Pass setView to child components to allow navigation from buttons */}
            <HeroSection setView={setView} />
            
            <StatsTicker />
            
            <ServicesGrid setView={setView} />
            
            <WhyUsSection setView={setView} />
          </div>
        )}

        {/* SECURE VIEWS */}
        {view === 'signup' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <SignupScreen setView={setView} />
          </div>
        )}

        {view === 'login' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <LoginPage setView={setView} />
          </div>
        )}

        {view === 'dashboard' && (
          <div className="animate-in zoom-in-95 duration-500">
            <DashboardScreen setView={setView} />
          </div>
        )}
      </main>

      {/* FOOTER */}
      {view !== 'dashboard' && <Footer setView={setView} />}

      {/* GLOBAL BACKGROUND ELEMENTS */}
      {view !== 'dashboard' && (
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D9FF] opacity-[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF6B9D] opacity-[0.02] blur-[150px] rounded-full" />
        </div>
      )}
    </div>
  );
}