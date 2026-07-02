import { useNavigate } from "react-router-dom";
import { Cpu, Terminal, Star, Quote, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const About = () => {
  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    if (category === "all") {
      navigate("/collections");
    } else {
      navigate(`/collections?category=${category}`);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Welcome aboard! Your 15% discount credit has been synchronized.");
    e.target.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-16 animate-fadeIn">
      
      {/* 1. HERO BANNER: Clean and Premium Apple-style Slate Hero */}
      <section className="relative bg-slate-900 rounded-xl overflow-hidden p-8 md:p-14 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-12 justify-between">
        {/* Glow detail */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.1),transparent_50%)] pointer-events-none"></div>
        
        {/* Left text column */}
        <div className="relative space-y-6 max-w-xl text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Premium</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight">
            ELEVATE <br />
            YOUR SYSTEM
          </h2>

          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans max-w-md">
            Acquire developer rigs, cellular folding nodes, high-fidelity acoustics, and custom gaming engines. Redefined professionally.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/collections")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase transition-all duration-150 flex items-center space-x-2 cursor-pointer border-none shadow-sm"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleCategoryChange("gaming")}
              className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase transition-all cursor-pointer"
            >
              Shop Gaming
            </button>
          </div>
        </div>

        {/* Right image cutout column */}
        <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
          <img
            src="/hero_tech_collage.jpg"
            alt="Hardware Collage"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop";
            }}
          />
        </div>
      </section>

      {/* 2. POLICY HIGHLIGHTS BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-xs uppercase text-gray-900 tracking-wider">Free Shipping</h4>
            <p className="text-[11px] text-gray-400 font-medium">On orders exceeding $500</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-xs uppercase text-gray-900 tracking-wider">30-Day Exchange</h4>
            <p className="text-[11px] text-gray-400 font-medium">Telemetry swap protocol</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-xs uppercase text-gray-900 tracking-wider">Secure Checkout</h4>
            <p className="text-[11px] text-gray-400 font-medium">Encrypted matrix checks</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
            <Star className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-xs uppercase text-gray-900 tracking-wider">Certified Core</h4>
            <p className="text-[11px] text-gray-400 font-medium">100% factory verification</p>
          </div>
        </div>
      </section>

      {/* 3. VISUAL CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold uppercase text-gray-900 tracking-tight">
            Our Categories
          </h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Select hardware sectors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Laptops Tall Left Card */}
          <div 
            onClick={() => handleCategoryChange("laptops")}
            className="md:col-span-5 relative group rounded-xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"
              alt="Laptops category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/10 to-transparent"></div>
            <div className="absolute bottom-5 left-5 text-white space-y-1 text-left">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">Premium Nodes</span>
              <h4 className="text-xl font-bold uppercase tracking-wide">Workstations</h4>
              <p className="text-xs text-gray-300 font-sans">Laptops &amp; Developer Rigs</p>
            </div>
          </div>

          {/* Right Cards Stack */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Top Wide Gaming Card */}
            <div 
              onClick={() => handleCategoryChange("gaming")}
              className="sm:col-span-2 relative group rounded-xl overflow-hidden aspect-[16/9] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop"
                alt="Gaming Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/10 to-transparent"></div>
              <div className="absolute bottom-5 left-5 text-white space-y-1 text-left">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">Accelerators</span>
                <h4 className="text-xl font-bold uppercase tracking-wide">Gaming &amp; Graphics</h4>
                <p className="text-xs text-gray-300 font-sans">GPUs, custom engines, consoles</p>
              </div>
            </div>

            {/* Phones Card */}
            <div 
              onClick={() => handleCategoryChange("smartphones")}
              className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop"
                alt="Phones Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/10 to-transparent"></div>
              <div className="absolute bottom-5 left-5 text-white space-y-1 text-left">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">Cellular</span>
                <h4 className="text-lg font-bold uppercase tracking-wide">Mobile Nodes</h4>
                <p className="text-xs text-gray-300 font-sans">Phones &amp; folding arrays</p>
              </div>
            </div>

            {/* Audio Card */}
            <div 
              onClick={() => handleCategoryChange("audio")}
              className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop"
                alt="Audio Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/10 to-transparent"></div>
              <div className="absolute bottom-5 left-5 text-white space-y-1 text-left">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400">Acoustics</span>
                <h4 className="text-lg font-bold uppercase tracking-wide">Sound Nodes</h4>
                <p className="text-xs text-gray-300 font-sans font-medium">Headphones &amp; Earbuds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRANDED BILLBOARD CARD: Clean slate-100 layout */}
      <section className="relative bg-gray-100 border border-gray-200 rounded-xl p-8 md:p-14 lg:p-16 overflow-hidden shadow-sm text-gray-900 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="relative space-y-6 max-w-md text-left z-10">
          <span className="bg-blue-600/10 text-blue-600 border border-blue-500/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
            FEATURED EXCLUSIVE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Premium Rigs <br />
            For Power Users
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed font-sans font-medium">
            Explore elite GPU components, liquid cooled modules, and workstations crafted for developers and gaming enthusiasts. Built to excel.
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold uppercase px-6 py-3 rounded-lg border-none shadow-sm transition-colors cursor-pointer"
          >
            <span>Acquire Module</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Floating image */}
        <div className="relative w-full max-w-xs md:max-w-sm aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-200 z-10 hover:scale-[1.01] transition-transform duration-300 bg-white">
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop"
            alt="Tech specifications"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 5. CLIENT TALK (Testimonials module) */}
      <section className="space-y-8 py-4">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold uppercase text-gray-900 tracking-tight">
            Client Reviews
          </h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Verification credentials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-4 shadow-sm relative text-left">
            <Quote className="w-8 h-8 text-blue-100 absolute top-6 right-6" />
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-500 font-sans italic">
              "The custom developer workstation I ordered compiled my compiler matrices in half the expected time. Shipping packaging included full static shieldings."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                JD
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-900">John Doe</h5>
                <span className="text-xs text-gray-400">Software Architect</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-4 shadow-sm relative text-left">
            <Quote className="w-8 h-8 text-blue-100 absolute top-6 right-6" />
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-500 font-sans italic">
              "Outstanding audio modules. Dynamic range response curves are completely flat, matching spatial acoustic vectors. Recommended node."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                SC
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-900">Sarah Connor</h5>
                <span className="text-xs text-gray-400">Acoustic Architect</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-4 shadow-sm relative text-left">
            <Quote className="w-8 h-8 text-blue-100 absolute top-6 right-6" />
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-500 font-sans italic">
              "The administrative controls dashboard is incredibly intuitive. Stock changes are synced immediately, and shipping address logs are cleanly accessible."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                MK
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-900">Marcus Kaiser</h5>
                <span className="text-xs text-gray-400">Lead Developer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GET 15% OFF NEWSLETTER FORM */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-0 max-w-5xl mx-auto">
        {/* Left Form */}
        <div className="p-8 md:p-14 space-y-6 text-left">
          <h3 className="text-2xl md:text-3xl font-bold uppercase text-gray-900 tracking-tight">
            Get 15% Off Your <br />
            First Purchase
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase">
            Subscribe to claim clearance discount vouchers.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="name@matrix.com"
              className="flex-grow bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs uppercase font-bold px-6 py-3 rounded-lg transition-colors border-none cursor-pointer"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Right Visual Image */}
        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-gray-50 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&auto=format&fit=crop"
            alt="Subscribe node"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

    </div>
  );
};

export default About;
