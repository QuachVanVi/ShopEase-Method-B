import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 1. Sync state from localStorage when the user changes
  useEffect(() => {
    const key = `wishlist_${user || 'guest'}`;
    const saved = localStorage.getItem(key);
    setWishlist(saved ? JSON.parse(saved) : []);
  }, [user]);

  // 2. Save only when the actual wishlist state is modified
  useEffect(() => {
    if (user || wishlist.length > 0) { // Avoid saving empty guest lists unnecessarily
      localStorage.setItem(`wishlist_${user || 'guest'}`, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    if (!user) return false; // Indicate failure if not logged in
    
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
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
