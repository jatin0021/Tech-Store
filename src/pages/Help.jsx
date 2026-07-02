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
      q: "How do I check my order shipment status?",
      a: "All shipments are tracked via our Order History. Once your order completes verification, a tracking number will be sent to your email. Priority shipping for orders above $500 is routed via express delivery channels at no charge."
    },
    {
      q: "What is the 30-Day Hardware Exchange policy?",
      a: "If a component presents operational anomalies within 30 days of acquisition, you may request an RMA. We authorize dynamic swaps for matching modules. Initiating a scan in the Diagnostics terminal below can help run a basic check."
    },
    {
      q: "Are the checkout network transactions secure?",
      a: "Absolutely. All checkouts are processed through standard SHA-256 encrypted tunnels. We do not store your credit card information; only temporary tokenized mappings are kept to authorize transactions."
    },
    {
      q: "Do you ship products to international destinations?",
      a: "We currently support addresses in North America, European Union, and select Asian countries. Custom clearance and port taxes are computed automatically at checkout based on your delivery coordinates."
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
      status: "EXCHANGE REQUESTED",
      date: new Date().toLocaleDateString(),
      instructions: "Pack your product in anti-static shielding. Affix the generated ticket. Drop off at any standard shipping center."
    });
  };

  // 3. Diagnostics Terminal State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalEndRef = useRef(null);

  const diagnosticScans = [
    "Initializing diagnostic checks...",
    "Querying browser agent configuration... [OK]",
    "Analyzing connection latency to central database...",
    "Ping: 42ms. Latency within bounds.",
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
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-5xl text-gray-800 animate-fadeIn font-sans">
      
      {/* Page Header */}
      <section className="text-center space-y-4 py-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-blue-600 text-xs uppercase tracking-wider font-semibold shadow-sm">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Support Deck / Help Center</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-gray-900 leading-none">
          Diagnostics &amp; Support
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
          Troubleshoot exchanges, verify system connection status, or consult our FAQ list.
        </p>
      </section>

      {/* Main Grid: FAQ and Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: FAQs Accordion */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">FAQ Section</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 hover:border-blue-500/20 rounded-xl overflow-hidden transition-all duration-150 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-sans font-semibold text-gray-900 focus:outline-none cursor-pointer border-none bg-transparent"
                >
                  <span className="text-sm md:text-base pr-4">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-500 border-t border-gray-200 leading-relaxed font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right: Dynamic Diagnostics Terminal */}
        <section id="diagnostics" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">System Diagnostics</h2>
            </div>
            <span className="flex items-center space-x-1.5 text-xs text-gray-450 font-semibold">
              <Activity className={`w-3.5 h-3.5 ${isScanning ? "animate-pulse text-blue-600" : ""}`} />
              <span>{isScanning ? "SCANNING" : "STANDBY"}</span>
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 font-mono shadow-md relative text-slate-100 text-left">
            {/* Terminal Window Chrome */}
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-900 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></span>
              <span className="ml-2 font-mono text-[10px]">diagnostics@techstore.sh</span>
            </div>

            {/* Scrollable logs area */}
            <div className="h-64 overflow-y-auto space-y-2 text-xs md:text-sm custom-scrollbar text-emerald-400 leading-relaxed no-scrollbar">
              {terminalLogs.length === 0 ? (
                <div className="text-slate-600 italic py-10 text-center">
                  Diagnostic console idle. Click run button to run diagnostics.
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
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>ANALYZING SYSTEM STACK</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
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
                className={`flex items-center space-x-2 font-sans text-xs uppercase px-4 py-2.5 rounded-lg border-none font-bold transition-all duration-150 cursor-pointer ${
                  isScanning 
                    ? "bg-slate-900 text-slate-600 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                <Cpu className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Running..." : "Run Diagnostics"}</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Sections: RMA & Delivery Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Simulated RMA returns portal */}
        <section id="rma" className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm scroll-mt-24 text-left">
          <div className="flex items-center space-x-3 border-b border-gray-250 pb-3">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">RMA Request Portal</h2>
          </div>

          <form onSubmit={handleRmaSubmit} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Reference ID</label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-8012-Y4"
                value={rmaForm.orderId}
                onChange={(e) => setRmaForm({ ...rmaForm, orderId: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hardware Category</label>
              <select
                value={rmaForm.hardwareType}
                onChange={(e) => setRmaForm({ ...rmaForm, hardwareType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="gpu">Gaming Graphics Unit (GPU)</option>
                <option value="cpu">Processing Unit (CPU)</option>
                <option value="phone">Smart Phone / Foldable</option>
                <option value="laptop">Laptop / Workstation</option>
                <option value="audio">Audio Node / Earbuds</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Telemetry Description</label>
              <textarea
                rows="3"
                required
                placeholder="Describe component failure symptoms..."
                value={rmaForm.issueDescription}
                onChange={(e) => setRmaForm({ ...rmaForm, issueDescription: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:bg-white transition-colors resize-none font-normal"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs uppercase font-bold py-3 rounded-lg transition-colors cursor-pointer border-none shadow-sm"
            >
              Generate RMA Ticket
            </button>
          </form>

          {rmaResult && (
            <div className="bg-blue-50/50 border border-blue-100/50 p-5 rounded-lg space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-blue-600 text-xs uppercase font-bold">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>TICKET GENERATED SUCCESSFULLY</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block uppercase text-[10px] font-bold">RMA Reference ID</span>
                  <span className="text-gray-800 font-bold">{rmaResult.code}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px] font-bold">Status</span>
                  <span className="text-blue-600 font-bold">{rmaResult.status}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 border-t border-blue-100 pt-2 font-normal leading-relaxed">
                <span className="text-gray-400 font-bold text-[10px] block uppercase mb-1">Instructions</span>
                {rmaResult.instructions}
              </div>
            </div>
          )}
        </section>

        {/* Right: Delivery options info */}
        <section id="delivery" className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm scroll-mt-24 text-left">
          <div className="flex items-center space-x-3 border-b border-gray-250 pb-3">
            <Truck className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">Delivery Rates</h2>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            All system dispatches originate from central distribution centers. Shipping rates are calculated at checkouts.
          </p>

          <div className="space-y-4 text-sm font-semibold">
            <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <span className="text-gray-900 block font-bold text-sm">Standard Delivery</span>
                <span className="text-gray-400 text-xs font-normal">Delivery in 3-5 business days</span>
              </div>
              <span className="text-blue-600 text-sm font-bold">$15.00</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <span className="text-gray-900 block font-bold text-sm">Express Shipping</span>
                <span className="text-gray-400 text-xs font-normal">Delivery in 1-2 business days</span>
              </div>
              <span className="text-blue-600 text-sm font-bold">$45.00</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div>
                <span className="text-blue-600 block font-bold text-sm">Free Delivery Threshold</span>
                <span className="text-gray-400 text-xs font-normal">Applicable on orders exceeding $500</span>
              </div>
              <span className="text-blue-600 text-sm font-bold uppercase">FREE</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold">
              All dispatches include electronic serial confirmation signatures. Transit insurance is automatically applied.
            </p>
          </div>
        </section>

      </div>

    </div>
  );
};

export default Help;
