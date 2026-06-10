import { useState } from "react";
import { 
  ShieldCheck, 
  EyeOff, 
  Sliders, 
  Terminal, 
  CheckCircle,
  Database,
  Lock
} from "lucide-react";

const PrivacyPolicy = () => {
  // Telemetry Setting State
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  const [syncLogs, setSyncLogs] = useState([]);

  const toggleTelemetry = () => {
    const nextState = !telemetryEnabled;
    setTelemetryEnabled(nextState);
    
    // Generate simulation log
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] TELEMETRY_STATE_SYNC: Changed to ${nextState ? "ENABLED" : "DISABLED"} - Network node updated.`;
    setSyncLogs((prev) => [newLog, ...prev.slice(0, 4)]);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-4xl">
      
      {/* Page Header */}
      <section className="text-center space-y-4 py-4">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-orange-400 font-mono text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Security Ledger / Privacy</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider text-white">
          Data Encryption <span className="text-orange-400">&amp; Privacy</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Review our secure protocols, telemetry logging policies, and cookies cache data mappings.
        </p>
      </section>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Core Policies Columns */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Policy Section 1: Payment Security */}
          <div className="bg-gray-950 border border-orange-950/60 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <Lock className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-wider">SHA-256 Payment Security</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              All financial transaction channels are tunnelled through encrypted tokens using industry-standard Secure Socket Layers (SSL). We do not record or retain card verification values or credit credentials. Your authorization signatures are parsed directly by our PCI-DSS compliant ledger nodes.
            </p>
          </div>

          {/* Policy Section 2: Local Node Storage */}
          <div className="bg-gray-950 border border-orange-950/60 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <Database className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Cookie Nodes &amp; LocalStorage</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              To guarantee persistence of your shopping cart modules and order status ledgers without requiring persistent database logs, our website stores lightweight session hashes in your local browser storage (`localStorage` &amp; `sessionStorage`). No behavioral tracking cookies are injected into your system.
            </p>
          </div>

          {/* Policy Section 3: Telemetry Collection */}
          <div className="bg-gray-950 border border-orange-950/60 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <EyeOff className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Telemetry &amp; Hardware Logs</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              We gather non-identifiable system telemetry (such as screen dimensions, graphics processor profiles, and page load latency logs) to maintain high visual standard performance across all hardware terminals. This data is processed anonymously and cannot be associated with individual users.
            </p>
          </div>

        </div>

        {/* Sidebar: Interactive Settings */}
        <div className="md:col-span-1 space-y-6">
          
          <div className="bg-gray-950 border border-orange-950 rounded-3xl p-6 space-y-6">
            <div className="flex items-center space-x-2 border-b border-orange-950/40 pb-3 text-white">
              <Sliders className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold uppercase tracking-wide text-sm">Telemetry Control</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Configure whether this browser node transmits anonymous rendering and latency logs to our tech store operations desk.
            </p>

            {/* Toggle Component */}
            <div className="flex items-center justify-between p-3.5 bg-gray-900/50 border border-gray-900 rounded-2xl">
              <span className="text-xs font-mono uppercase text-gray-400">Telemetry Sync</span>
              <button
                onClick={toggleTelemetry}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none relative cursor-pointer ${
                  telemetryEnabled ? "bg-orange-500" : "bg-gray-800"
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 absolute top-1 ${
                    telemetryEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Status indicators */}
            <div className="text-[10px] font-mono text-gray-500 flex justify-between">
              <span>STATUS:</span>
              <span className={telemetryEnabled ? "text-orange-400 font-bold" : "text-gray-600"}>
                {telemetryEnabled ? "TRANSMITTING ACTIVE" : "TRANSMISSIONS MUTED"}
              </span>
            </div>

            {/* Simulated System Console Log */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-mono">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span>Sync Activity Stream</span>
              </div>
              <div className="bg-black border border-gray-900 rounded-xl p-3 h-32 overflow-y-auto text-[9px] font-mono text-orange-400/80 space-y-1.5 custom-scrollbar">
                {syncLogs.length === 0 ? (
                  <div className="text-gray-700 italic text-center py-6">Console listening...</div>
                ) : (
                  syncLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-1">
                      <span className="text-orange-600">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {telemetryEnabled && (
              <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center space-x-2 text-[10px] text-gray-400">
                <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Dynamic telemetry node online.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default PrivacyPolicy;
