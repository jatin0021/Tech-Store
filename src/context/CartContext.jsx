import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../api/api.js";
import { useAuth } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch, load, and merge cart depending on auth status
  useEffect(() => {
    const syncCartState = async () => {
      console.log("[CartContext] syncCartState running. isAuthenticated:", isAuthenticated);
      setIsLoading(true);
      if (isAuthenticated) {
        try {
          // Check for any guest items in localStorage to merge
          const savedCart = localStorage.getItem("tech_store_cart");
          console.log("[CartContext] savedCart guest items:", savedCart);
          if (savedCart) {
            const localItems = JSON.parse(savedCart);
            if (localItems.length > 0) {
              // Post each local item to the DB cart sequentially
              for (const item of localItems) {
                console.log("[CartContext] Syncing guest item to DB:", item);
                await apiClient.post("/cart", {
                  productId: item.product._id || item.product.id,
                  quantity: item.quantity,
                });
              }
              // Clear guest cart from localstorage
              localStorage.removeItem("tech_store_cart");
              toast.success("Guest items synced with your profile!");
            }
          }
          // Fetch final database cart
          console.log("[CartContext] Fetching DB cart...");
          const res = await apiClient.get("/cart");
          console.log("[CartContext] DB cart response data:", res.data);
          setCart(res.data.items || []);
        } catch (error) {
          console.error("[CartContext] Failed to load/merge cart with DB:", error);
          toast.error("Could not sync cart with database.");
        }
      } else {
        // Load guest cart from localstorage
        try {
          const savedCart = localStorage.getItem("tech_store_cart");
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          } else {
            setCart([]);
          }
        } catch (e) {
          console.error("[CartContext] Failed to parse local guest cart:", e);
          setCart([]);
        }
      }
      setIsLoading(false);
    };

    syncCartState();
  }, [isAuthenticated]);

  // 2. Local storage synchronization for guest users only (runs after load/update finishes)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      localStorage.setItem("tech_store_cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, isLoading]);

  // Add a product to the cart
  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;
    console.log("[CartContext] addToCart called:", { product, productId, quantity });
    if (isAuthenticated) {
      try {
        console.log("[CartContext] Sending POST /cart...");
        const res = await apiClient.post("/cart", {
          productId,
          quantity,
        });
        console.log("[CartContext] POST /cart success. Response:", res.data);
        setCart(res.data.items || []);
        return true;
      } catch (error) {
        console.error("[CartContext] POST /cart failed:", error);
        toast.error(error.message || "Failed to add item to DB cart.");
        return false;
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
      return true;
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    console.log("[CartContext] removeFromCart called. productId:", productId);
    if (isAuthenticated) {
      try {
        console.log("[CartContext] Sending DELETE /cart/:id...");
        const res = await apiClient.delete(`/cart/${productId}`);
        console.log("[CartContext] DELETE /cart/:id success. Response:", res.data);
        setCart(res.data.items || []);
      } catch (error) {
        console.error("[CartContext] DELETE /cart/:id failed:", error);
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
    console.log("[CartContext] updateQuantity called:", { productId, quantity });
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        console.log("[CartContext] Sending PUT /cart/:id...");
        const res = await apiClient.put(`/cart/${productId}`, { quantity });
        console.log("[CartContext] PUT /cart/:id success. Response:", res.data);
        setCart(res.data.items || []);
      } catch (error) {
        console.error("[CartContext] PUT /cart/:id failed:", error);
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
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
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
