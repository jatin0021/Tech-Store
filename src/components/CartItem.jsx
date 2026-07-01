import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  // Safeguard if product details are missing
  if (!product) return null;

  // Map backend variables
  const id = product._id || product.id;
  const name = product.title || product.name;
  const image = product.images?.[0] || product.image;
  const category = product.category?.name || product.category;
  
  const { price, discountPrice, stock } = product;
  const hasDiscount = discountPrice > 0;
  const currentPrice = hasDiscount ? price - discountPrice : price;

  const handleIncrement = () => {
    if (quantity < stock) {
      updateQuantity(id, quantity + 1);
    } else {
      toast.error(`Sorry, only ${stock} units of ${name} are currently in stock.`);
    }
  };

  const handleDecrement = () => {
    updateQuantity(id, quantity - 1);
  };

  // Format currency helper
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-stone-100 rounded-3xl gap-4 hover:border-orange-500/20 transition-all duration-200 shadow-sm text-left">
      
      {/* Product Image & Meta */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-105">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 font-sans">
          <Link to={`/product/${id}`} className="hover:text-orange-655 transition-colors">
            <h4 className="text-base font-bold text-stone-800 line-clamp-1">{name}</h4>
          </Link>
          <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider block mt-0.5">
            {category}
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1 font-mono">
            <span className="text-xs text-stone-500">
              {formatMoney(currentPrice)} each
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-stone-350 line-through">
                {formatMoney(price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Adjusters & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-stone-50 sm:border-t-0">
        
        {/* Quantity selectors */}
        <div className="flex items-center space-x-1 bg-stone-50 p-1 rounded-2xl border border-stone-200 shadow-inner">
          <button
            onClick={handleDecrement}
            className="p-2 text-stone-400 hover:text-stone-750 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-8 text-center text-xs font-bold font-mono text-stone-850">
            {quantity}
          </span>
          
          <button
            onClick={handleIncrement}
            disabled={quantity >= stock}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              quantity >= stock
                ? "text-stone-350 cursor-not-allowed"
                : "text-stone-400 hover:text-stone-750 hover:bg-stone-200/50"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[85px]">
          <span className="text-base font-mono font-bold text-stone-900 block">
            {formatMoney(currentPrice * quantity)}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={() => {
            removeFromCart(id);
            toast.success(`Removed ${name} from your cart.`);
          }}
          className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-xl transition-all duration-150 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
      
    </div>
  );
};

export default CartItem;
