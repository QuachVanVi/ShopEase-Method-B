import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, PieChart, Heart, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartItems, isCartOpen, setIsCartOpen, toggleCart, removeFromCart } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <PieChart className="w-8 h-8 text-[#a46522] fill-[#a46522]" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            ShopEase
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">New Arrivals</Link>
          <Link to="/" className="hover:text-gray-900 transition-colors">Designers</Link>
          <Link to="/" className="hover:text-gray-900 transition-colors">Journal</Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[400px] mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search curated collections..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm text-gray-900 font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Heart className="w-5 h-5 fill-current" />
          </button>
          <button onClick={toggleCart} className="text-gray-600 hover:text-gray-900 transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-[#e68421] text-white text-[10px] font-bold rounded-full border-2 border-surface">
              {cartCount}
            </span>
          </button>
          
          
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-all border border-gray-200 group"
              >
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{user}</span>
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-2 bg-[#e68421] hover:bg-[#d4781c] text-white px-5 py-2 rounded text-sm font-semibold transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>

    {/* Cart Slide-over */}
    {isCartOpen && (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsCartOpen(false)} />
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md w-full bg-white shadow-xl flex flex-col h-screen overflow-y-scroll pointer-events-auto border-l border-gray-100">
            <div className="px-4 pt-6 pb-2 sm:px-6 flex items-start justify-between">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shopping Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2"
               >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4 px-4 sm:px-6 flex-1 pb-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">Your cart is currently empty.</div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex py-2">
                       <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                         <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center bg-gray-50 mix-blend-multiply" />
                       </div>
                       <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-extrabold text-gray-900 tracking-tight">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs font-semibold text-gray-500">{item.brand}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500 font-bold">Qty {item.quantity}</p>
                            <button onClick={() => removeFromCart(item.id)} type="button" className="font-extrabold text-[11px] uppercase tracking-wider text-red-500 hover:text-red-700">
                              Remove
                            </button>
                          </div>
                       </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-8 sm:px-6 bg-gray-50">
                <div className="flex justify-between text-lg font-extrabold text-gray-900 tracking-tight">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button className="w-full bg-[#1c2223] text-white py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-black transition-colors">
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
