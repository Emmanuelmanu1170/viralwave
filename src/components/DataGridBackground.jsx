export function DataGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f1419] to-[#16213e]" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00D9FF" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Blur Overlay with Data Stats */}
      <div className="absolute inset-0 backdrop-blur-[1px]">
        <div className="absolute top-10 left-10 text-[#00D9FF] opacity-10 font-mono text-xs space-y-1">
          <div>SYSTEM.STATUS: ONLINE</div>
          <div>ACTIVE_USERS: 24,891</div>
          <div>ORDERS_PROCESSING: 1,247</div>
          <div>UPTIME: 99.98%</div>
        </div>
        <div className="absolute bottom-10 right-10 text-[#00D9FF] opacity-10 font-mono text-xs space-y-1 text-right">
          <div>NETWORK.LATENCY: 12ms</div>
          <div>API_CALLS: 459,234</div>
          <div>BANDWIDTH: 847.2 MB/s</div>
          <div>SECURE_CONNECTION: TRUE</div>
        </div>
      </div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF] rounded-full blur-[120px] opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D9FF] rounded-full blur-[120px] opacity-10" />
    </div>
  );
}
