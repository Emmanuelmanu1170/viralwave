import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[#0070F3] rounded-full blur-[120px] opacity-20 top-0 right-1/4 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#0070F3] rounded-full blur-[100px] opacity-15 bottom-0 left-1/4"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            <span className="block bg-gradient-to-r from-white via-white to-[#0070F3] bg-clip-text text-transparent">
              Scale Your Socials
            </span>
            <span className="block bg-gradient-to-r from-[#0070F3] to-white bg-clip-text text-transparent">
              with Gigantic Precision
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Accelerate your social media growth with instant delivery, secure payments, and proven results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="group relative px-10 py-5 text-lg overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0070F3]/80 via-[#0070F3]/60 to-[#0070F3]/40 backdrop-blur-xl"></div>
            
            {/* Border gradient */}
            <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-[#0070F3] to-white/20">
              <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-[#0070F3]/60 to-[#0070F3]/30 backdrop-blur-xl"></div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* 3D shadow effect */}
            <div className="absolute inset-0 rounded-2xl bg-[#0070F3] blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10"></div>
            
            <span className="relative z-10 font-semibold text-white">Order Now</span>
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border border-[#0070F3]/30 rounded-lg rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 border border-[#0070F3]/30 rounded-full hidden lg:block"></div>
      </div>
    </section>
  );
}
