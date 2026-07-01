import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Category from "../components/Category.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import Loading from "../components/Loading.jsx";
import { Cpu, Terminal, ChevronLeft, ChevronRight, Star, Quote, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter deck state
  const [filters, setFilters] = useState({
    search: "",
    maxPrice: 3000,
    sortBy: "popularity",
    inStockOnly: false,
  });

  // Reset page to 1 when filters or category parameter shifts
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, filters]);

  // Synchronize category param in URL with component category state
  const handleCategoryChange = (category) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);

    // Smooth scroll down to catalog grid when category is clicked
    setTimeout(() => {
      const catalogEl = document.getElementById("catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Handle updates from SearchFilter side panel
  const handleFilterChange = (updatedFields) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Fetch products dynamically when filters, category, or page shifts
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const params = {
      category: categoryParam,
      search: filters.search,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy,
      inStockOnly: filters.inStockOnly,
      page: currentPage,
      limit: 6, // Show 6 products per page
    };

    apiClient
      .get("/products", { params })
      .then((res) => {
        if (active) {
          setProducts(res.data.products || []);
          setTotalPages(res.data.pages || 1);
          setTotalProducts(res.data.total || 0);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        if (active) {
          toast.error(err.message || "Failed to query products from DB.");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [categoryParam, filters, currentPage]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Welcome aboard! Your 15% discount credit has been synchronized.");
    e.target.reset();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-16 animate-fadeIn">
      
      {/* 1. HERO BANNER: Elegant orange card mirroring 'ELEVATE YOUR SELF' */}
      <section className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-[36px] overflow-hidden p-8 md:p-14 lg:p-20 shadow-xl border border-orange-400/20 text-white flex flex-col lg:flex-row items-center gap-12 lg:gap-8 justify-between">
        
        {/* Glow and grid details */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Left text column */}
        <div className="relative space-y-6 max-w-xl text-left">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Premium Hardware Matrix</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[0.9] font-serif-lux">
            ELEVATE <br />
            YOUR SYSTEM
          </h2>

          <p className="text-sm md:text-base text-orange-50 leading-relaxed font-sans max-w-md">
            Acquire developer rigs, cellular folding nodes, high-fidelity acoustics, and custom gaming engines. Synchronized dynamically.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#catalog"
              className="bg-white hover:bg-orange-50 text-orange-600 px-7 py-4 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleCategoryChange("gaming")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-7 py-4 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            >
              Shop Gaming
            </button>
          </div>
        </div>

        {/* Right image cutout column */}
        <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:scale-[1.01] transition-transform duration-300 bg-amber-500/10">
          <img
            src="/hero_tech_collage.jpg"
            alt="Hardware Collage"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to stock image in case of filesystem delay
              e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop";
            }}
          />
        </div>

      </section>

      {/* 2. POLICY HIGHLIGHTS BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-stone-200">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-100/50 rounded-2xl text-orange-600">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase text-stone-900 tracking-wider">Free Shipping</h4>
            <p className="text-[10px] text-stone-400 font-mono">For orders exceeding $500</p>
          </div>
        </div>
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-100/50 rounded-2xl text-orange-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase text-stone-900 tracking-wider">30-Day Exchange</h4>
            <p className="text-[10px] text-stone-400 font-mono">Telemetry swap protocol</p>
          </div>
        </div>
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-100/50 rounded-2xl text-orange-600">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase text-stone-900 tracking-wider">Secure Checkout</h4>
            <p className="text-[10px] text-stone-400 font-mono">Encrypted matrix checks</p>
          </div>
        </div>
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-100/50 rounded-2xl text-orange-600">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase text-stone-900 tracking-wider">Certified Core</h4>
            <p className="text-[10px] text-stone-400 font-mono">100% factory verification</p>
          </div>
        </div>
      </section>

      {/* 3. VISUAL CATEGORIES GRID: Fashion composition overlay */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-stone-900 tracking-tight">
            Our Categories
          </h3>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">Select hardware sectors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Laptops Tall Left Card */}
          <div 
            onClick={() => handleCategoryChange("laptops")}
            className="md:col-span-5 relative group rounded-[28px] overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"
              alt="Laptops category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white space-y-1 text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 font-bold">Premium Nodes</span>
              <h4 className="text-2xl font-bold uppercase tracking-wide">Workstations</h4>
              <p className="text-xs text-stone-300 font-sans">Laptops &amp; Developer Rigs</p>
            </div>
          </div>

          {/* Right Cards Stack */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Top Wide Gaming Card */}
            <div 
              onClick={() => handleCategoryChange("gaming")}
              className="sm:col-span-2 relative group rounded-[28px] overflow-hidden aspect-[16/9] cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop"
                alt="Gaming Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 font-bold">Accelerators</span>
                <h4 className="text-2xl font-bold uppercase tracking-wide">Gaming &amp; Graphics Gear</h4>
                <p className="text-xs text-stone-300 font-sans">GPUs, custom engines, consoles</p>
              </div>
            </div>

            {/* Phones Card */}
            <div 
              onClick={() => handleCategoryChange("smartphones")}
              className="relative group rounded-[28px] overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop"
                alt="Phones Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 font-bold">Cellular</span>
                <h4 className="text-xl font-bold uppercase tracking-wide">Mobile Nodes</h4>
                <p className="text-xs text-stone-300 font-sans">Phones &amp; folding arrays</p>
              </div>
            </div>

            {/* Audio Card */}
            <div 
              onClick={() => handleCategoryChange("audio")}
              className="relative group rounded-[28px] overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop"
                alt="Audio Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 font-bold">Acoustics</span>
                <h4 className="text-xl font-bold uppercase tracking-wide">Sound Nodes</h4>
                <p className="text-xs text-stone-300 font-sans font-medium">Headphones &amp; Earbuds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN STOREFRONT CATALOG */}
      <section id="catalog" className="scroll-mt-24 pt-6">
        
        {/* Category horizontal scroller */}
        <div className="border-b border-stone-200 pb-2 mb-8">
          <Category activeCategory={categoryParam} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Sidebar + Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <SearchFilter filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* Catalog items */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono pb-2 border-b border-stone-150">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-orange-655" />
                <span className="font-semibold">FOUND: {totalProducts} MODULE(S)</span>
              </div>
              <span>SECTOR: <span className="text-orange-600 uppercase font-bold">{categoryParam}</span></span>
            </div>

            {isLoading ? (
              <Loading type="grid" count={6} />
            ) : products.length > 0 ? (
              <div className="space-y-8">
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-3 pt-6 border-t border-stone-205 font-mono text-xs">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white hover:bg-stone-50 disabled:opacity-30 border border-stone-200 rounded-xl cursor-pointer text-stone-550 hover:text-stone-800 shadow-sm transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-1.5">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? "bg-orange-50 border-orange-500 text-orange-600"
                                : "bg-white hover:bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 bg-white hover:bg-stone-50 disabled:opacity-30 border border-stone-200 rounded-xl cursor-pointer text-stone-550 hover:text-stone-800 shadow-sm transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-stone-200 rounded-3xl bg-white shadow-sm">
                <p className="text-stone-400 font-mono text-sm">
                  No matching product signatures found in database.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      maxPrice: 3000,
                      sortBy: "popularity",
                      inStockOnly: false,
                    });
                    searchParams.delete("category");
                    setSearchParams(searchParams);
                  }}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-100 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. BRANDED BILLBOARD CARD: Mimicking gold 'Frolax' middle section banner */}
      <section className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-[36px] p-8 md:p-14 lg:p-20 overflow-hidden shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
        {/* Giant brand text in background */}
        <div className="absolute inset-0 select-none flex items-center justify-center pointer-events-none opacity-15">
          <span className="text-[120px] md:text-[240px] font-extrabold uppercase font-serif-lux tracking-tight scale-110">
            TECH
          </span>
        </div>

        <div className="relative space-y-6 max-w-md text-left z-10">
          <span className="bg-white/10 border border-white/20 text-amber-100 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full font-mono">
            FEATURED EXCLUSIVE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-serif-lux leading-tight">
            Premium Rigs <br />
            For Power Users
          </h2>
          <p className="text-xs text-amber-50 leading-relaxed font-sans font-medium">
            Explore elite GPU components, liquid cooled modules, and workstations crafted for developers and gaming enthusiasts. Built to excel.
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center space-x-2 bg-white text-orange-655 font-mono text-xs font-bold uppercase tracking-wide px-6 py-3.5 rounded-2xl hover:bg-stone-50 transition-colors shadow-md"
          >
            <span>Acquire Module</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </a>
        </div>

        {/* Overlapping floating image */}
        <div className="relative w-full max-w-xs md:max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 hover:rotate-1 transition-transform duration-350 bg-stone-100">
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop"
            alt="Tech specifications"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 6. CLIENT TALK (Testimonials module) */}
      <section className="space-y-8 py-4">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-stone-900 tracking-tight font-serif-lux">
            Client Talk
          </h3>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">Verification credentials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white border border-stone-100 p-6 rounded-[28px] space-y-4 shadow-sm relative text-left">
            <Quote className="w-8 h-8 text-orange-200 absolute top-6 right-6" />
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-stone-500 font-sans italic">
              "The custom developer workstation I ordered compiled my compiler matrices in half the expected time. Shipping packaging included full static shieldings."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                JD
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-850">John Doe</h5>
                <span className="text-[9px] text-stone-400 font-mono">Software Architect</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-stone-100 p-6 rounded-[28px] space-y-4 shadow-sm relative text-left">
            <Quote className="w-8 h-8 text-orange-200 absolute top-6 right-6" />
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-stone-500 font-sans italic">
              "Outstanding audio modules. Dynamic range response curves are completely flat, matching spatial acoustic vectors. Recommended node."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                SC
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-850">Sarah Connor</h5>
                <span className="text-[9px] text-stone-400 font-mono">Acoustic Architect</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-stone-100 p-6 rounded-[28px] space-y-4 shadow-sm relative text-left">
            <Quote className="w-8 h-8 text-orange-200 absolute top-6 right-6" />
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-stone-500 font-sans italic">
              "The administrative controls dashboard is incredibly intuitive. Stock changes are synced immediately, and shipping address logs are cleanly accessible."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                MK
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-850">Marcus Kaiser</h5>
                <span className="text-[9px] text-stone-400 font-mono">Lead Developer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GET 15% OFF NEWSLETTER FORM: Split warm card */}
      <section className="bg-white border border-stone-100 rounded-[36px] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-0 max-w-5xl mx-auto">
        {/* Left Form */}
        <div className="p-8 md:p-14 space-y-6 text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-stone-900 tracking-tight font-serif-lux">
            Get 15% Off Your <br />
            First Purchase
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed font-semibold uppercase">
            Sync details to claim clearance discount vouchers.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="name@matrix.com"
              className="flex-grow bg-stone-50 border border-stone-200 rounded-2xl py-3 px-4 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 active:bg-orange-850 text-white font-mono text-xs uppercase font-bold px-6 py-3 rounded-2xl transition-colors cursor-pointer"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Right Visual Image */}
        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-stone-100 overflow-hidden">
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

export default ProductList;