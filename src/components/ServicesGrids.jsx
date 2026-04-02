import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap } from 'lucide-react';

// MAKE SURE THIS SAYS "export function ServicesGrids"
export function ServicesGrids({ onTabChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const services = [
    { id: "27270", category: "TikTok", name: "Tiktok Views [Instant]", rate: 0.0667 },
    { id: "14566", category: "TikTok", name: "TikTok - Reposts | HQ - Real", rate: 2.3273 },
    { id: "2422", category: "TikTok", name: "TikTok - Followers | HQ - Real", rate: 9.3080 },
    { id: "1812", category: "TikTok", name: "TikTok - Likes | MQ 100K | Recommended", rate: 1.95 },
    { id: "2432", category: "Instagram", name: "Instagram - Likes | HQ - Real", rate: 4.6927 },
    { id: "27288", category: "Instagram", name: "Instagram Followers [365 Days Refill]", rate: 4.0560 },
  ];

  const filteredData = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 p-8 bg-[#0f1419]/60 backdrop-blur-xl"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black italic uppercase text-white">Service Protocol</h2>
        <input 
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <tbody>
            {filteredData.map((s) => (
              <tr key={s.id} className="group">
                <td className="px-6 py-4 bg-black/20 rounded-l-2xl border-y border-l border-white/5">
                  <span className="font-mono text-[10px] text-gray-500">#{s.id}</span>
                </td>
                <td className="px-6 py-4 bg-black/20 border-y border-white/5 text-white font-bold text-xs uppercase">
                  {s.name}
                </td>
                <td className="px-6 py-4 bg-black/20 border-y border-white/5 text-cyan-500 font-black">
                  ${s.rate.toFixed(3)}
                </td>
                <td className="px-6 py-4 bg-black/20 rounded-r-2xl border-y border-r border-white/5 text-right">
                  <button 
                    onClick={() => onTabChange('new-order')}
                    className="bg-white text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-cyan-500 cursor-pointer"
                  >
                    Deploy <Zap size={10} className="inline ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}