import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const services = [
  {
    name: "TikTok",
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
          fill="url(#tiktok-gradient)"
        />
        <defs>
          <linearGradient id="tiktok-gradient" x1="2" y1="2" x2="22" y2="22">
            <stop offset="0%" stopColor="#00f2ea" />
            <stop offset="100%" stopColor="#ff0050" />
          </linearGradient>
        </defs>
      </svg>
    ),
    description: "Boost views, likes, and followers",
    gradient: "from-[#00f2ea] to-[#ff0050]",
  },
  {
    name: "Instagram",
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#instagram-gradient)" />
        <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
        <defs>
          <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="25%" stopColor="#fa7e1e" />
            <stop offset="50%" stopColor="#d62976" />
            <stop offset="75%" stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
      </svg>
    ),
    description: "Grow your engagement and reach",
    gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
  },
  {
    name: "YouTube",
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="3" fill="url(#youtube-gradient)" />
        <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="white" />
        <defs>
          <linearGradient id="youtube-gradient" x1="2" y1="12" x2="22" y2="12">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="100%" stopColor="#cc0000" />
          </linearGradient>
        </defs>
      </svg>
    ),
    description: "Increase subscribers and views",
    gradient: "from-[#ff0000] to-[#cc0000]",
  },
];

export function ServicesGrid() {
  return (
    <section className="relative py-24 px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-[#0070F3] rounded-full blur-[100px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-[#0070F3] bg-clip-text text-transparent">
            Amplify Your Presence
          </h2>
          <p className="text-lg text-gray-400">Choose your platform and start growing today</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#0B0E14] to-[#0B0E14]/50 border border-[#0070F3]/20 hover:border-[#0070F3]/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`,
                }}
              ></div>

              {/* Neon icon container */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative">
                  {service.icon}
                  {/* Neon glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                </div>
              </div>

              <h3 className="text-2xl mb-3 text-center text-white">{service.name}</h3>
              <p className="text-gray-400 text-center mb-6">{service.description}</p>

              <button className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r ${service.gradient} text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#0070F3]/50 flex items-center justify-center gap-2 group/btn`}>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#0070F3]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
