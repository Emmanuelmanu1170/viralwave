import React from 'react';
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function StatsCard({ title, value, icon: Icon, trend, color }) {
  // Map trend array to Recharts format
  const chartData = trend.map((val, index) => ({ value: val, index }));

  return (
    <motion.div
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        background: "rgba(15, 20, 30, 0.6)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
      whileHover={{ 
        scale: 1.02,
        borderColor: `${color}40`,
        boxShadow: `0 0 20px ${color}10`
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Icon and Trend Badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        
        {/* Subtle Trend Indicator */}
        <div 
          className="text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-md"
          style={{ color: color, background: `${color}05` }}
        >
          Live Feed
        </div>
      </div>

      {/* Title & Info */}
      <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
        {title}
      </div>

      {/* Value with Glow */}
      <div className="text-3xl font-black italic tracking-tighter mb-4 text-white">
        {value}
      </div>

      {/* Sparkline Chart - FIXED: Added height constraints */}
      <div className="h-12 w-full -mx-2 opacity-80" style={{ minWidth: "100px", minHeight: "48px" }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false} // Prevents calculation lag on initial load
              strokeOpacity={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Glow Effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${color}10, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}