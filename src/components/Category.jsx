import { Laptop, Smartphone, Headphones, Watch, Cpu, Home, LayoutGrid } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Tech", icon: LayoutGrid },
  { id: "laptops", name: "Laptops", icon: Laptop },
  { id: "smartphones", name: "Phones", icon: Smartphone },
  { id: "audio", name: "Audio", icon: Headphones },
  { id: "wearables", name: "Wearables", icon: Watch },
  { id: "gaming", name: "Gaming & PC", icon: Cpu },
  { id: "smarthome", name: "Smart Home", icon: Home },
];

const Category = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
      {CATEGORIES.map((cat) => {
        const IconComponent = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-mono text-sm uppercase tracking-wider font-bold transition-all duration-200 border cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-orange-500/15 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10"
                : "bg-gray-950/40 border-gray-900 text-gray-500 hover:text-white hover:border-gray-800"
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-gray-500"}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Category;