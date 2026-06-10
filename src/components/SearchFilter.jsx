import { Search, SlidersHorizontal, ArrowUpDown, ShieldAlert } from "lucide-react";

const SearchFilter = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    onFilterChange({ maxPrice: value });
  };

  const handleStockToggle = () => {
    onFilterChange({ inStockOnly: !filters.inStockOnly });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      maxPrice: 3000,
      sortBy: "popularity",
      inStockOnly: false,
    });
  };

  return (
    <div className="bg-gray-950/40 backdrop-blur-sm border border-gray-900 rounded-3xl p-6 space-y-6 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-900">
        <div className="flex items-center space-x-2 text-white font-mono font-bold uppercase tracking-wider text-sm">
          <SlidersHorizontal className="w-4 h-4 text-orange-400" />
          <span>Filter Terminal</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-gray-500 hover:text-orange-400 font-mono transition-colors cursor-pointer"
        >
          RESET
        </button>
      </div>

      {/* Text Search Box */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase text-gray-500 tracking-wider">Search Catalog</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Type code, item, brand..."
            className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase text-gray-500 tracking-wider flex items-center space-x-1.5">
          <ArrowUpDown className="w-3 h-3 text-orange-400" />
          <span>Sort Sequence</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="w-full bg-gray-900/50 border border-gray-800 focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
        >
          <option value="popularity">Popularity (Most Reviews)</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating">Rating (Highest Stars)</option>
        </select>
      </div>

      {/* Price Limit Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-mono uppercase text-gray-500 tracking-wider">
          <span>Max Cost Limit</span>
          <span className="text-orange-400 font-bold font-mono">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="50"
          max="3000"
          step="50"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-orange-500 bg-gray-900 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
          <span>$50</span>
          <span>$3,000</span>
        </div>
      </div>

      {/* Stock Availability Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-900/40">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">Active Stock</span>
          <span className="text-[10px] text-gray-600">Exclude sold out nodes</span>
        </div>
        <button
          onClick={handleStockToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
            filters.inStockOnly ? "bg-orange-500" : "bg-gray-850 border border-gray-800"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              filters.inStockOnly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Tech Disclaimer */}
      <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-gray-600 font-mono uppercase">
          Catalog prices are synchronized dynamically. Shipping rates computed dynamically at terminal checkout.
        </p>
      </div>
    </div>
  );
};

export default SearchFilter;