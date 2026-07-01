import { useState, useEffect, useRef } from "react";
import { 
  HelpCircle, 
  Cpu, 
  Terminal, 
  Truck, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Activity, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const Help = () => {
  // 1. FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How do I check my hardware shipment dispatch status?",
      a: "All dispatches are tracked via our Order Ledger. Once your transaction node completes block verification, a tracking signature will be sent to your terminal. Priority dispatches for systems above $500 are routed via hyper-freight channels at no charge."
    },
    {
      q: "What is the 30-Day Hardware Exchange policy?",
      a: "If a component presents telemetry anomalies within 30 days of acquisition, you may request an RMA. We authorize dynamic swaps for matching modules. Initiating a scan in the Terminal Diagnostics module below can help accelerate your diagnostic check."
    },
    {
      q: "Are the matrix network transactions secure?",
      a: "Absolutely. All checkouts are processed through standard SHA-256 encrypted tunnels. We do not store your core banking coordinates; only temporary tokenized ledger mappings are kept to authorize transactions."
    },
    {
      q: "Do you ship nodes to international sectors?",
      a: "We currently support sectors in North America, European Union, and select Asian terminals. Custom clearance and port taxes are computed automatically at checkout based on your delivery coordinates."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // 2. RMA Form State
  const [rmaForm, setRmaForm] = useState({
    orderId: "",
    hardwareType: "gpu",
    issueDescription: ""
  });
  const [rmaResult, setRmaResult] = useState(null);

  const handleRmaSubmit = (e) => {
    e.preventDefault();
    if (!rmaForm.orderId.trim()) return;

    // Generate simulated RMA code
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, "0");
    const rmaCode = `RMA-${rmaForm.hardwareType.toUpperCase()}-${randomHex}`;
    
    setRmaResult({
      code: rmaCode,
      status: "TELEMETRY SCAN REQUESTED",
      date: new Date().toLocaleDateString(),
      instructions: "Pack your node in anti-static shielding. Affix the generated ticket. Drop off at any sector shipping terminal."
    });
  };

  // 3. Diagnostics Terminal State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalEndRef = useRef(null);

  const diagnosticScans = [
    "Initializing tech store diagnostic array...",
    "Querying browser agent configuration... [OK]",
    "Analyzing connection latency to central database...",
    "Matrix ping: 42ms. Latency within bounds.",
    "Checking client session cryptographic state... [SECURE]",
    "Scanning localStorage cart cache integrity... [VERIFIED]",
    "Verifying CSS rendering engine compatibility... [OK]",
    "Detecting hardware graphic acceleration: WebGL 2.0 active.",
    "Testing API response times... [OK] status 200",
    "Running checksum integrity checks on system modules...",
    "All local components operational. Diagnostic sequence complete."
  ];

  const runDiagnostics = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setTerminalLogs([diagnosticScans[0]]);

    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep < diagnosticScans.length) {
        setTerminalLogs((prev) => [...prev, diagnosticScans[currentStep]]);
        setScanProgress(Math.floor((currentStep / (diagnosticScans.length - 1)) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 450);
  };

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-5xl text-stone-800 animate-fadeIn">
      
      {/* Page Header */}
      <section className="text-center space-y-4 py-4">
        <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-full text-orange-655 font-mono text-xs uppercase tracking-widest font-semibold shadow-sm">
          <HelpCircle className="w-4 h-4 text-orange-600" />
          <span>Support Deck / Help Center</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-stone-900 leading-none">
          Diagnostics & <span className="text-orange-655">Help Core</span>
        </h1>
        <p className="text-sm text-stone-500 max-w-lg mx-auto">
          Troubleshoot hardware exchanges, verify system telemetry, or consult our FAQ matrix.
        </p>
      </section>

      {/* Main Grid: FAQ and Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: FAQs Accordion */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-150 pb-3">
            <HelpCircle className="w-6 h-6 text-orange-655" />
            <h2 className="text-xl font-bold uppercase tracking-wide text-stone-850">FAQ Nodes</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-stone-100 hover:border-orange-500/20 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-sans font-semibold text-stone-800 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm md:text-base pr-4">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-orange-600 shrink-0" />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-sm text-stone-505 border-t border-stone-100 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right: Dynamic Diagnostics Terminal */}
        <section id="diagnostics" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-stone-150 pb-3">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-orange-655" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-stone-850">Terminal Diagnostics</h2>
            </div>
            <span className="flex items-center space-x-1.5 text-xs font-mono text-stone-450">
              <Activity className={`w-3.5 h-3.5 ${isScanning ? "animate-pulse text-orange-600" : ""}`} />
              <span>{isScanning ? "SCANNING" : "STANDBY"}</span>
            </span>
          </div>

          <div className="bg-stone-950 border border-stone-900 rounded-3xl p-5 font-mono shadow-xl relative text-stone-100 text-left">
            {/* Terminal Window Chrome */}
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-stone-900 text-xs text-stone-650">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></span>
              <span className="ml-2 font-mono text-[10px]">diagnostics@techstore.matrix.sh</span>
            </div>

            {/* Scrollable logs area */}
            <div className="h-64 overflow-y-auto space-y-2 text-xs md:text-sm custom-scrollbar text-emerald-400 leading-relaxed">
              {terminalLogs.length === 0 ? (
                <div className="text-stone-600 italic py-10 text-center">
                  Diagnostic console idle. Trigger scan module to begin packet validation.
                </div>
              ) : (
                terminalLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-emerald-600 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Scan Progress Bar */}
            {isScanning && (
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>ANALYZING SYSTEM ARRAYS</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Terminal CTA */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={runDiagnostics}
                disabled={isScanning}
                className={`flex items-center space-x-2 font-mono text-xs uppercase px-4 py-2.5 rounded-xl border font-bold transition-all duration-200 cursor-pointer ${
                  isScanning 
                    ? "bg-stone-900 border-stone-850 text-stone-600 cursor-not-allowed" 
                    : "bg-orange-655 hover:bg-orange-755 text-white shadow-sm border border-orange-500/20"
                }`}
              >
                <Cpu className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Running Scan..." : "Initialize Scan"}</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Sections: RMA & Delivery Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Simulated RMA returns portal */}
        <section id="rma" className="bg-white border border-stone-100 rounded-3xl p-6 space-y-6 shadow-sm scroll-mt-24 text-left">
          <div className="flex items-center space-x-3 border-b border-stone-150 pb-3">
            <RefreshCw className="w-6 h-6 text-orange-655" />
            <h2 className="text-xl font-bold uppercase tracking-wide text-stone-800">RMA Module Registry</h2>
          </div>

          <form onSubmit={handleRmaSubmit} className="space-y-4 font-sans text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Order Reference Signature</label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-8012-Y4"
                value={rmaForm.orderId}
                onChange={(e) => setRmaForm({ ...rmaForm, orderId: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/30 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Hardware Sector Type</label>
              <select
                value={rmaForm.hardwareType}
                onChange={(e) => setRmaForm({ ...rmaForm, hardwareType: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/30 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-stone-805 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="gpu">Gaming Graphics Unit (GPU)</option>
                <option value="cpu">Processing Unit (CPU)</option>
                <option value="phone">Cellular Foldable</option>
                <option value="laptop">Workstation / Laptop</option>
                <option value="audio">Audio Node / Earbuds</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Telemetry Description</label>
              <textarea
                rows="3"
                required
                placeholder="Describe component failure symptoms..."
                value={rmaForm.issueDescription}
                onChange={(e) => setRmaForm({ ...rmaForm, issueDescription: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 focus:border-orange-500/30 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:bg-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs uppercase font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm hover:shadow border border-orange-500/20"
            >
              Generate RMA Ticket
            </button>
          </form>

          {rmaResult && (
            <div className="bg-orange-50 border border-orange-150 p-5 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-orange-655 font-mono text-xs uppercase font-semibold">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span>TICKET GENERATED SUCCESSFULLY</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-stone-400 block uppercase text-[10px]">RMA Sign ID</span>
                  <span className="text-stone-800 font-bold">{rmaResult.code}</span>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase text-[10px]">Status</span>
                  <span className="text-orange-600 font-bold">{rmaResult.status}</span>
                </div>
              </div>
              <div className="text-xs text-stone-505 border-t border-orange-150 pt-2 font-sans">
                <span className="text-stone-400 font-mono text-[10px] block uppercase">Instructions</span>
                {rmaResult.instructions}
              </div>
            </div>
          )}
        </section>

        {/* Right: Delivery Nodes info */}
        <section id="delivery" className="bg-white border border-stone-100 rounded-3xl p-6 space-y-6 shadow-sm scroll-mt-24 text-left">
          <div className="flex items-center space-x-3 border-b border-stone-150 pb-3">
            <Truck className="w-6 h-6 text-orange-655" />
            <h2 className="text-xl font-bold uppercase tracking-wide text-stone-850">Delivery Port Rates</h2>
          </div>

          <p className="text-sm text-stone-500 leading-relaxed font-medium font-sans">
            All system dispatches originate from central warehouses. Dynamic rates are computed at transit portals.
          </p>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center p-4 bg-stone-50 border border-stone-150 rounded-2xl">
              <div>
                <span className="text-stone-850 block font-bold text-sm uppercase">Standard Delivery</span>
                <span className="text-stone-400 text-xs">Sectors 1-4 transit nodes</span>
              </div>
              <span className="text-orange-600 text-sm font-bold">$15.00</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-stone-50 border border-stone-150 rounded-2xl">
              <div>
                <span className="text-stone-855 block font-bold text-sm uppercase">Priority Hyper-Freight</span>
                <span className="text-stone-400 text-xs">Direct beam to sector core</span>
              </div>
              <span className="text-orange-600 text-sm font-bold">$45.00</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-orange-55 border border-orange-100 rounded-2xl">
              <div>
                <span className="text-orange-655 block font-bold text-sm uppercase">Free Priority Option</span>
                <span className="text-stone-400 text-xs">For modules orders exceeding $500</span>
              </div>
              <span className="text-orange-600 text-sm font-bold uppercase">FREE</span>
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-100/50 rounded-2xl flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-505 leading-relaxed font-sans uppercase font-bold">
              All dispatches include electronic serial confirmation signatures. Transit insurance is automatically applied.
            </p>
          </div>
        </section>

      </div>

    </div>
  );
};

export default Help;
