import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../api/api.js";
import { useAuth } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch cart from Database or local storage depending on auth status
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        try {
          const res = await apiClient.get("/cart");
          setCart(res.data.items || []);
        } catch (error) {
          console.error("Failed to load cart from DB:", error);
          toast.error("Could not sync cart with database.");
        }
      } else {
        // Load guest cart from localstorage
        try {
          const savedCart = localStorage.getItem("tech_store_cart");
          if (savedCart) {
            // Map local structure to DB structure: { product: {...}, quantity: X }
            setCart(JSON.parse(savedCart));
          } else {
            setCart([]);
          }
        } catch (e) {
          console.error("Failed to parse local guest cart:", e);
          setCart([]);
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, [isAuthenticated, user]);

  // 2. Local storage synchronization for guest users only
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("tech_store_cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // 3. Merge guest local cart items to DB cart upon user authentication
  useEffect(() => {
    const mergeCart = async () => {
      if (isAuthenticated) {
        const savedCart = localStorage.getItem("tech_store_cart");
        if (savedCart) {
          const localItems = JSON.parse(savedCart);
          if (localItems.length > 0) {
            try {
              for (const item of localItems) {
                // Post each local item to the DB cart
                await apiClient.post("/cart", {
                  productId: item.product._id || item.product.id,
                  quantity: item.quantity,
                });
              }
              // Clear guest cart
              localStorage.removeItem("tech_store_cart");
              // Refresh database cart
              const res = await apiClient.get("/cart");
              setCart(res.data.items || []);
              toast.success("Guest items synced with your profile!");
            } catch (err) {
              console.error("Failed to merge guest cart to DB:", err);
            }
          }
        }
      }
    };

    mergeCart();
  }, [isAuthenticated]);

  // Add a product to the cart
  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;
    if (isAuthenticated) {
      try {
        const res = await apiClient.post("/cart", {
          productId,
          quantity,
        });
        setCart(res.data.items || []);
      } catch (error) {
        toast.error(error.message || "Failed to add item to DB cart.");
      }
    } else {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) => (item.product._id || item.product.id) === productId
        );

        if (existingItemIndex > -1) {
          const newCart = [...prevCart];
          const newQuantity = newCart[existingItemIndex].quantity + quantity;
          const maxStock = product.stock || 99;
          newCart[existingItemIndex].quantity = Math.min(newQuantity, maxStock);
          return newCart;
        } else {
          return [
            ...prevCart,
            { product, quantity: Math.min(quantity, product.stock || 99) },
          ];
        }
      });
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await apiClient.delete(`/cart/${productId}`);
        setCart(res.data.items || []);
      } catch (error) {
        toast.error("Failed to delete item from DB cart.");
      }
    } else {
      setCart((prevCart) =>
        prevCart.filter((item) => (item.product._id || item.product.id) !== productId)
      );
    }
  };

  // Update quantity of an item directly
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await apiClient.put(`/cart/${productId}`, { quantity });
        setCart(res.data.items || []);
      } catch (error) {
        toast.error("Failed to update item quantity.");
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if ((item.product._id || item.product.id) === productId) {
            const maxStock = item.product.stock || 99;
            return { ...item, quantity: Math.min(quantity, maxStock) };
          }
          return item;
        })
      );
    }
  };

  // Clear all items from the cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await apiClient.delete("/cart");
        setCart([]);
      } catch (error) {
        toast.error("Failed to clear database cart.");
      }
    } else {
      setCart([]);
    }
  };

  // Computed values
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product.price - (item.product.discountPrice || 0);
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
