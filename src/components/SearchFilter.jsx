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
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 sticky top-28 shadow-sm text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-150">
        <div className="flex items-center space-x-2 text-gray-800 font-bold uppercase tracking-wider text-xs">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors cursor-pointer border-none bg-transparent"
        >
          Reset All
        </button>
      </div>

      {/* Text Search Box */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Search Catalog</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Type search terms..."
            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg py-2.5 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center space-x-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
          <span>Sort Sequence</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors appearance-none cursor-pointer"
        >
          <option value="popularity">Popularity (Most Reviews)</option>
          <option value="newest">Newest Releases</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating">Rating (Highest Stars)</option>
        </select>
      </div>

      {/* Price Limit Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider">
          <span>Max Cost Limit</span>
          <span className="text-blue-600 font-bold font-mono">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="50"
          max="3000"
          step="50"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-blue-600 bg-gray-100 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>$50</span>
          <span>$3,000</span>
        </div>
      </div>

      {/* Stock Availability Toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-150">
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">In Stock Only</span>
          <span className="text-[10px] text-gray-400">Exclude sold out nodes</span>
        </div>
        <button
          onClick={handleStockToggle}
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 cursor-pointer border-none ${
            filters.inStockOnly ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
              filters.inStockOnly ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Tech Disclaimer */}
      <div className="bg-blue-50/40 border border-blue-100/40 rounded-lg p-4 flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-gray-500 uppercase font-medium">
          Catalog prices are synchronized dynamically. Shipping rates computed dynamically at checkout.
        </p>
      </div>
    </div>
  );
};

export default SearchFilter;