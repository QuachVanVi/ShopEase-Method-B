import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const currentCategory = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    fetch('http://localhost:8080/api/products?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // Filter products based on URL parameter
  let displayProducts = products;
  
  if (currentCategory && currentCategory !== 'Home') {
    displayProducts = displayProducts.filter(p => p.category === currentCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q)
    );
  }

  // Pagination logic
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = displayProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#1c2223] rounded-full animate-spin"></div>
        <p className="text-sm font-black uppercase tracking-widest text-gray-400">Loading Collections...</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 w-full max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {currentCategory && currentCategory !== 'Home' ? currentCategory : "All Categories"}
          </h1>
          <p className="text-[11px] text-gray-400 mt-1 font-black uppercase tracking-widest">
            Showing {Math.min(startIndex + 1, displayProducts.length)}-{Math.min(startIndex + itemsPerPage, displayProducts.length)} of {displayProducts.length} Results
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-sm font-bold text-gray-800">Sort By:</span>
          <button className="flex items-center justify-between gap-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-colors focus:ring-2 focus:ring-[#8a5100]/20">
            Featured
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {paginatedProducts.map((product, index) => {
          
          // Synthetic labels based on index for variety
          let label = "";
          let labelColor = "";
          if (index === 0 && currentPage === 1) { label = "EDITORIAL CHOICE"; labelColor = "bg-[#1c2223] text-white border-transparent"; }
          else if (index === 2 && currentPage === 1) { label = "LIMITED EDITION"; labelColor = "bg-red-600 text-white border-transparent"; }

          return (
            <Link to={`/product/${product.id}`} key={`${product.id}-${index}`} className="group relative flex flex-col h-full bg-white rounded-2xl p-4 transition-all hover:bg-gray-50/50">
              
              {/* Product Image Area */}
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-gray-100/50 mb-4 flex items-center justify-center">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Wishlist Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const success = toggleWishlist(product.id);
                    if (!success) navigate('/login');
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg z-20 hover:scale-110 transition-all active:scale-95 group/heart border border-gray-100"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist(product.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-400 group-hover/heart:text-red-400"
                    }`} 
                  />
                </button>

                {/* Sale / Best Seller Label */}
                {label && (
                  <div className={`absolute top-3 left-3 px-3 py-1 text-[9px] font-black tracking-widest uppercase rounded-full shadow-lg z-10 ${labelColor}`}>
                    {label}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{product.brand}</p>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#a46522] transition-colors line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? "fill-[#e68421] text-[#e68421]" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                  <span className="text-[10px] text-gray-400 font-bold ml-2">{(Math.random() * 4000 + 100).toFixed(0)} REVIEWS</span>
                </div>
                
                <div className="mt-auto pt-2">
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-xl font-black text-gray-900 tracking-tight">${product.price}</span>
                    <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">-15%</span>
                  </div>
                  
                  <div className="flex items-center gap-2 pb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00a8e1] fill-[#00a8e1]/10" />
                    <span className="text-[10px] font-black text-[#00a8e1] tracking-widest uppercase">Concierge Delivery</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-20 pb-12">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              currentPage === 1 ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:border-[#1c2223] hover:text-[#1c2223]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-black transition-all ${
                  currentPage === i + 1 
                    ? "bg-[#1c2223] text-white shadow-xl" 
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              currentPage === totalPages ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:border-[#1c2223] hover:text-[#1c2223]"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
