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
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-200 border cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-orange-50 border-orange-500 text-orange-655 shadow-sm shadow-orange-100"
                : "bg-white border-stone-100 text-stone-550 hover:text-stone-850 hover:border-stone-200/80 shadow-sm"
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-stone-400"}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Category;