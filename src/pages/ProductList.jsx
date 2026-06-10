import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../data/product.js";
import ProductCard from "../components/ProductCard.jsx";
import Category from "../components/Category.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import Loading from "../components/Loading.jsx";
import { Cpu, Terminal } from "lucide-react";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter deck state
  const [filters, setFilters] = useState({
    search: "",
    maxPrice: 3000,
    sortBy: "popularity",
    inStockOnly: false,
  });

  // Synchronize category param in URL with component category state
  const handleCategoryChange = (category) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  // Handle updates from SearchFilter side panel
  const handleFilterChange = (updatedFields) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Fetch products dynamically when filters or category parameter changes
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    getProducts({
      category: categoryParam,
      ...filters,
    })
      .then((data) => {
        if (active) {
          setProducts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [categoryParam, filters]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Cyberpunk Hero Banner */}
      <section className="relative overflow-hidden bg-gray-950 border border-orange-950 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0a09_1px,transparent_1px),linear-gradient(to_bottom,#0c0a09_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Content */}
        <div className="relative space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-orange-400 font-mono text-xs uppercase tracking-widest">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>Terminal V1.0 Online</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
            UPGRADE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-sm">
              HARDWARE MATRIX
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            Acquire developer rigs, cellular folding nodes, high-fidelity acoustics, and custom components. Synchronized dynamically.
          </p>
        </div>
      </section>

      {/* 2. Interactive Category Navigation */}
      <section className="border-b border-gray-900/60 pb-2">
        <Category activeCategory={categoryParam} onCategoryChange={handleCategoryChange} />
      </section>

      {/* 3. Main Catalog Shop Layout */}
      <div id="catalog" className="grid grid-cols-1 lg:grid-cols-4 gap-8 scroll-mt-24">
        
        {/* Sidebar Controllers */}
        <aside className="lg:col-span-1">
          <SearchFilter filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Main Grid Floor */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono pb-2 border-b border-gray-900/40">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span>LOG: Found {products.length} Node(s)</span>
            </div>
            <span>Category: <span className="text-orange-400 uppercase font-bold">{categoryParam}</span></span>
          </div>

          {isLoading ? (
            <Loading type="grid" count={6} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-gray-900 rounded-3xl bg-gray-950/10">
              <p className="text-gray-500 font-mono text-sm">
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
                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/35 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

      </div>
      
    </div>
  );
};

export default ProductList;