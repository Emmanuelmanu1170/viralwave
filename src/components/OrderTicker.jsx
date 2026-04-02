import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

export function OrderTicker() {
  const [orderCount, setOrderCount] = useState(247891);
  const [recentOrders, setRecentOrders] = useState([
    { id: 1, service: "Instagram Followers", amount: "2.5K", time: "2s ago" },
    { id: 2, service: "YouTube Views", amount: "10K", time: "5s ago" },
    { id: 3, service: "TikTok Likes", amount: "5K", time: "8s ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrderCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      
      // Rotate orders
      const services = [
        "Instagram Followers", "YouTube Views", "TikTok Likes", 
        "Twitter Followers", "Facebook Likes", "Spotify Plays"
      ];
      const amounts = ["1K", "2.5K", "5K", "10K", "15K", "25K"];
      
      setRecentOrders((prev) => [
        {
          id: Date.now(),
          service: services[Math.floor(Math.random() * services.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          time: "just now"
        },
        ...prev.slice(0, 2)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/40 border-t border-[#00D9FF]/30 backdrop-blur-sm py-3 px-6">
      <div className="flex items-center justify-between gap-6">
        {/* Total Orders Counter */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00D9FF]" />
          <span className="text-xs text-gray-400 font-mono">TOTAL ORDERS:</span>
          <motion.span
            key={orderCount}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-mono text-[#00D9FF] font-semibold"
          >
            {orderCount.toLocaleString()}
          </motion.span>
        </div>

        {/* Recent Orders Ticker */}
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-6">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-xs font-mono whitespace-nowrap"
              >
                <span className="text-gray-500">{order.time}</span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-300">{order.service}</span>
                <span className="text-[#00D9FF] font-semibold">{order.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
