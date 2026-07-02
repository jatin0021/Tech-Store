import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Category from "../components/Category.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import Loading from "../components/Loading.jsx";
import { Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter deck state
  const [filters, setFilters] = useState({
    search: searchParam,
    maxPrice: 3000,
    sortBy: "popularity",
    inStockOnly: false,
  });

  // Reset page to 1 when filters or category parameter shifts
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, filters]);

  // Sync state if URL search query changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParam,
    }));
  }, [searchParam]);

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
    
    // If search changed, update the URL
    if (updatedFields.search !== undefined) {
      if (updatedFields.search.trim() === "") {
        searchParams.delete("search");
      } else {
        searchParams.set("search", updatedFields.search.trim());
      }
      setSearchParams(searchParams);
    }
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Title Header */}
      <div className="text-center py-6 space-y-2 border-b border-gray-205">
        <h2 className="text-3xl font-bold uppercase text-gray-900 tracking-tight">Our Collections</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Explore all premium hardware modules</p>
      </div>

      {/* MAIN STOREFRONT CATALOG */}
      <section id="catalog" className="scroll-mt-24 pt-4">
        
        {/* Category horizontal scroller */}
        <div className="border-b border-gray-200 pb-2 mb-6">
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
            <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-200">
              <div className="flex items-center space-x-2 font-medium">
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                <span>Found: {totalProducts} module(s)</span>
              </div>
              <span className="font-medium">Sector: <span className="text-blue-600 uppercase font-semibold">{categoryParam}</span></span>
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
                  <div className="flex items-center justify-center space-x-2 pt-6 border-t border-gray-200 text-xs">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-550 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:pointer-events-none"
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
                            className={`w-9 h-9 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-500"
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
                      className="p-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-550 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
                <p className="text-gray-400 text-sm">
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
                    searchParams.delete("search");
                    setSearchParams(searchParams);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-150 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GET 15% OFF NEWSLETTER FORM */}
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

export default ProductList;