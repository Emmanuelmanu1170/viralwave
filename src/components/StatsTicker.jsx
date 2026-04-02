import { motion } from "motion/react";
import { TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsTicker() {
  const [orders, setOrders] = useState(500000);
  const [users, setUsers] = useState(10000);

  useEffect(() => {
    const orderInterval = setInterval(() => {
      setOrders((prev) => prev + Math.floor(Math.random() * 5));
    }, 3000);

    const userInterval = setInterval(() => {
      setUsers((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(userInterval);
    };
  }, []);

  return (
    <section className="relative py-8 px-6 border-y border-[#0070F3]/20">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0070F3]/5 to-transparent"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Total Orders */}
          <motion.div
            className="flex items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-[#0070F3]/10 to-transparent border border-[#0070F3]/20 backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-3 bg-[#0070F3]/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-[#0070F3]" />
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Total Orders</div>
              <motion.div
                className="text-3xl md:text-4xl bg-gradient-to-r from-white to-[#0070F3] bg-clip-text text-transparent"
                key={orders}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {orders.toLocaleString()}+
              </motion.div>
            </div>
          </motion.div>

          {/* Active Users */}
          <motion.div
            className="flex items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-[#0070F3]/10 to-transparent border border-[#0070F3]/20 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-3 bg-[#0070F3]/20 rounded-lg">
              <Users className="w-8 h-8 text-[#0070F3]" />
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Users</div>
              <motion.div
                className="text-3xl md:text-4xl bg-gradient-to-r from-white to-[#0070F3] bg-clip-text text-transparent"
                key={users}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {users.toLocaleString()}+
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
