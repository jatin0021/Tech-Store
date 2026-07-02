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
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-4xl text-gray-800 animate-fadeIn font-sans">
      
      {/* Page Header */}
      <section className="text-center space-y-4 py-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-blue-600 text-xs uppercase tracking-wider font-semibold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Security &amp; Privacy Policy</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-gray-900 leading-none">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
          Review our secure protocols, telemetry logging policies, and data storage details.
        </p>
      </section>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Core Policies Columns */}
        <div className="md:col-span-2 space-y-8 text-left">
          
          {/* Policy Section 1: Payment Security */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-blue-600">
              <Lock className="w-6 h-6" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">Payment Security</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              All financial transaction channels are tunnelled through encrypted tokens using industry-standard Secure Socket Layers (SSL). We do not record or retain card verification values or credit credentials. Your authorization signatures are parsed directly by our PCI-DSS compliant ledger nodes.
            </p>
          </div>

          {/* Policy Section 2: Local Node Storage */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-blue-600">
              <Database className="w-6 h-6" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">Cookie &amp; LocalStorage</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              To guarantee persistence of your shopping cart modules and order status ledgers without requiring persistent database logs, our website stores lightweight session hashes in your local browser storage (`localStorage` &amp; `sessionStorage`). No behavioral tracking cookies are injected into your system.
            </p>
          </div>

          {/* Policy Section 3: Telemetry Collection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-blue-600">
              <EyeOff className="w-6 h-6" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">Telemetry &amp; Logs</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              We gather non-identifiable system telemetry (such as screen dimensions, graphics processor profiles, and page load latency logs) to maintain high performance across all hardware terminals. This data is processed anonymously and cannot be associated with individual users.
            </p>
          </div>

        </div>

        {/* Sidebar: Interactive Settings */}
        <div className="md:col-span-1 space-y-6 text-left">
          
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-gray-150 pb-3 text-gray-900">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold uppercase tracking-wider text-xs">Telemetry Control</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Configure whether this browser node transmits anonymous rendering and latency logs to our tech store operations desk.
            </p>

            {/* Toggle Component */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs font-semibold uppercase text-gray-500">Telemetry Sync</span>
              <button
                onClick={toggleTelemetry}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none relative cursor-pointer border-none ${
                  telemetryEnabled ? "bg-blue-600" : "bg-gray-200"
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
            <div className="text-[10px] font-sans font-semibold text-gray-400 flex justify-between">
              <span>STATUS:</span>
              <span className={telemetryEnabled ? "text-blue-600 font-bold" : "text-gray-400"}>
                {telemetryEnabled ? "TRANSMITTING ACTIVE" : "TRANSMISSIONS MUTED"}
              </span>
            </div>

            {/* Simulated System Console Log */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-sans font-semibold">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Sync Activity Stream</span>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 h-32 overflow-y-auto text-[10px] font-mono text-emerald-400 space-y-1.5 no-scrollbar text-left">
                {syncLogs.length === 0 ? (
                  <div className="text-slate-650 italic text-center py-6">Console listening...</div>
                ) : (
                  syncLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-1">
                      <span className="text-emerald-600">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {telemetryEnabled && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center space-x-2 text-[10px] text-blue-600">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold uppercase text-[9px] tracking-wide">Dynamic telemetry online.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default PrivacyPolicy;
