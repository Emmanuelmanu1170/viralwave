import { motion } from "motion/react";
import { Zap, Shield, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Delivery",
    description: "Lightning-fast processing with results appearing within minutes of your order",
    color: "#0070F3",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure Payments",
    description: "Accept payments via MoMo and Crypto with enterprise-grade encryption",
    color: "#00D9FF",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Round-the-clock customer service to help you achieve your growth goals",
    color: "#0070F3",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Premium Quality",
    description: "Real, high-quality engagement from authentic accounts worldwide",
    color: "#00D9FF",
  },
];

export function WhyUsSection() {
  return (
    <section className="relative py-24 px-6">
      {/* Grid pattern background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(#0070F3 1px, transparent 1px), linear-gradient(90deg, #0070F3 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0B0E14]/50 to-[#0B0E14]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-[#0070F3] bg-clip-text text-transparent">
            Why Choose Giganticboost?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We're not just another growth service. We're your partner in digital success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#0B0E14] to-[#0B0E14]/80 border border-[#0070F3]/20 hover:border-[#0070F3]/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0070F3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative flex items-start gap-4">
                {/* Icon with neon effect */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="p-3 rounded-xl bg-gradient-to-br from-[#0070F3]/20 to-[#0070F3]/10 border border-[#0070F3]/30"
                    style={{ color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"
                    style={{ backgroundColor: feature.color }}
                  ></div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0070F3]/20 via-transparent to-[#0070F3]/20 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment methods highlight */}
        <motion.div
          className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0070F3]/10 via-[#0B0E14] to-[#0070F3]/10 border border-[#0070F3]/30 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0070F3]/5 to-transparent animate-pulse"></div>

          <div className="relative text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-[#0070F3]" />
            <h3 className="text-2xl mb-3 text-white">Trusted Payment Options</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We accept multiple payment methods including MoMo (Mobile Money) and cryptocurrency for maximum convenience and security
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070F3]/20 to-[#0070F3]/10 border border-[#0070F3]/30 text-white">
                MoMo
              </div>
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070F3]/20 to-[#0070F3]/10 border border-[#0070F3]/30 text-white">
                Bitcoin
              </div>
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070F3]/20 to-[#0070F3]/10 border border-[#0070F3]/30 text-white">
                Ethereum
              </div>
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070F3]/20 to-[#0070F3]/10 border border-[#0070F3]/30 text-white">
                USDT
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
