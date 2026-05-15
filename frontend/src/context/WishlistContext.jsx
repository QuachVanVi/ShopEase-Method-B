import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 1. Initial Load: Fetch from Backend (if logged in) or LocalStorage (if guest)
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user}`, {
            credentials: 'include'
          });
          if (res.ok) {
            const data = await res.json();
            setWishlist(Array.from(data.wishlistProductIds || []));
            return;
          }
        } catch (err) {
          console.error("Failed to fetch wishlist from backend", err);
        }
      }
      
      // Fallback to localStorage
      const key = `wishlist_${user || 'guest'}`;
      const saved = localStorage.getItem(key);
      setWishlist(saved ? JSON.parse(saved) : []);
    };

    fetchWishlist();
  }, [user]);

  // 2. Save to LocalStorage (always)
  useEffect(() => {
    localStorage.setItem(`wishlist_${user || 'guest'}`, JSON.stringify(wishlist));
  }, [wishlist, user]);

  // 3. Save to Backend (Helper function)
  const saveToBackend = useCallback(async (newWishlist) => {
    if (!user) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ wishlistProductIds: newWishlist })
      });
    } catch (err) {
      console.error("Failed to sync wishlist to backend", err);
    }
  }, [user]);

  const toggleWishlist = (productId) => {
    if (!user) return false;
    
    setWishlist(prev => {
      const updated = prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId];
      
      // Sync to backend
      saveToBackend(updated);
      return updated;
    });
    return true;
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
