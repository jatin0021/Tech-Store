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
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-sans text-sm font-medium transition-all duration-150 border cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-500 shadow-sm"
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Category;