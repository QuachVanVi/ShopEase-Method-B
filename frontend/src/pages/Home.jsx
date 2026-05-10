import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 4 hours in seconds: 4*3600 + 12*60 + 35 = 15155
  const [timeLeft, setTimeLeft] = useState(15155);
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-[80vh]"></div>;

  // We'll pick specific products to feature based on indices or names
  // 1. Deals of the day: products 8-11 (or whichever)
  const deals = products.slice(5, 9);
  
  // 2. Recommended: 3 distinct products
  const recommended1 = products.find(p => p.name.includes("Tie")) || products[6];
  const recommended2 = products.find(p => p.name.includes("Scarf")) || products[7];
  const recommended3 = products.find(p => p.name.includes("Backpack")) || products[8];

  return (
    <div className="w-full max-w-[1200px] mx-auto py-8">
      
      {/* HERO SECTION */}
      <div className="w-full h-[600px] bg-[#f2f1ef] rounded-3xl overflow-hidden relative mb-16 flex items-center shadow-inner border border-gray-100">
        {/* Background Image with Gradient Mask */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-right"
          style={{ 
            backgroundImage: 'url("/ceramic_espresso_cups_hero.png")',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)'
          }}
        />
        
        <div className="w-1/2 p-20 flex flex-col justify-center z-10 relative">
          <p className="text-[#cd831f] text-[10px] font-black tracking-[0.4em] mb-4 uppercase">Sustainability • Craft • Design</p>
          <h1 className="text-gray-900 text-7xl font-extrabold leading-[0.95] tracking-tight mb-8">Elevated<br/>Essentials</h1>
          <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-sm mb-10">
            Discover our new line of sustainable basics designed for the modern architectural lifestyle.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#cd831f] hover:bg-[#b06f18] text-white px-8 py-4 rounded-xl text-xs font-black tracking-widest transition-all shadow-xl shadow-orange-900/20 active:scale-95">
              SHOP COLLECTION
            </button>
            <button className="bg-white/40 hover:bg-white/60 backdrop-blur-md border border-gray-200 text-gray-900 px-8 py-4 rounded-xl text-xs font-black tracking-widest transition-all active:scale-95">
              VIEW LOOKBOOK
            </button>
          </div>
        </div>
      </div>

      {/* DEALS OF THE DAY */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Deals of the Day</h2>
            <div className="flex items-center gap-3">
              <span className="bg-[#f0a600] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Time Remaining</span>
              <span className="text-xl font-bold text-gray-800 tabular-nums">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <button className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">View All Deals →</button>
        </div>

        <div className="flex gap-6">
          {deals.map(deal => (
            <Link to={`/product/${deal.id}`} key={deal.id} className="group w-1/4">
              <div className="bg-[#1c2223] rounded-xl aspect-[4/5] relative overflow-hidden mb-4">
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm z-10">-20%</div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const success = toggleWishlist(deal.id);
                    if (!success) navigate('/login');
                  }}
                  className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-full shadow-sm z-20 hover:scale-110 transition-transform active:scale-95 group/heart"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist(deal.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-white/60 group-hover/heart:text-red-400"
                    }`} 
                  />
                </button>
                <img src={deal.imageUrl} alt={deal.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-1">{deal.name}</h3>
              <p className="text-xs text-gray-400 font-medium mb-2">{deal.brand}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-gray-900">${(deal.price * 0.8).toFixed(2)}</span>
                <span className="text-[11px] text-gray-400 font-bold line-through">${deal.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RECOMMENDED FOR YOU */}
      <div className="bg-gray-50/50 -mx-8 px-8 py-20 rounded-3xl mb-20">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Recommended for You</h2>
        <p className="text-sm font-medium text-gray-500 mb-8">Based on your aesthetic preferences.</p>

        <div className="flex gap-6 h-[600px]">
          {/* Big Item */}
          {recommended1 && (
            <Link to={`/product/${recommended1.id}`} className="w-[60%] bg-[#121314] rounded-2xl overflow-hidden relative group">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const success = toggleWishlist(recommended1.id);
                    if (!success) navigate('/login');
                  }}
                  className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md rounded-full shadow-sm z-20 hover:scale-110 transition-transform active:scale-95 group/heart"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist(recommended1.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-white/40 group-hover/heart:text-red-400"
                    }`} 
                  />
                </button>
              <img src={recommended1.imageUrl} alt={recommended1.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10 z-10">
                <p className="text-white/70 text-[10px] font-extrabold tracking-[0.15em] mb-2 uppercase">{recommended1.brand}</p>
                <h3 className="text-white text-4xl font-extrabold mb-6 tracking-tight">{recommended1.name}</h3>
                <span className="bg-white text-black px-6 py-2.5 rounded-sm text-xs font-bold hover:bg-gray-100 transition-colors">DISCOVER MORE</span>
              </div>
            </Link>
          )}

          {/* Right Stack */}
          <div className="w-[40%] flex flex-col gap-6">
             {recommended2 && (
              <Link to={`/product/${recommended2.id}`} className="flex-1 bg-[#161616] rounded-2xl overflow-hidden relative group">
                <img src={recommended2.imageUrl} alt={recommended2.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" />
                <div className="absolute bottom-8 left-8 z-10">
                  <h3 className="text-white text-xl font-extrabold mb-1">{recommended2.name}</h3>
                  <p className="text-white/60 text-xs font-medium">From ${recommended2.price}</p>
                </div>
              </Link>
             )}
             {recommended3 && (
              <Link to={`/product/${recommended3.id}`} className="flex-1 bg-[#1a2d33] rounded-2xl overflow-hidden relative group">
                <img src={recommended3.imageUrl} alt={recommended3.name} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-150 -translate-y-10 group-hover:opacity-70 transition-opacity" />
                <div className="absolute bottom-8 left-8 z-10 w-[80%] bg-white/90 backdrop-blur-sm p-4 rounded text-black">
                  <h3 className="text-lg font-extrabold leading-tight mb-1">{recommended3.name}</h3>
                  <p className="text-xs font-medium text-gray-600 truncate">{recommended3.description}</p>
                </div>
              </Link>
             )}
          </div>
        </div>
      </div>

      {/* SMART HOME EVOLUTION */}
      <div className="flex gap-16 mb-20 items-center pl-8">
        <div className="w-1/2">
          <p className="text-[#cd831f] text-[10px] font-extrabold tracking-[0.2em] mb-4 uppercase">Curated Tech</p>
          <h2 className="text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Smart Home<br/>Evolution
          </h2>
          <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-md mb-12">
            Technology shouldn't look like technology. Our collection features devices that disappear into your decor while elevating your life's efficiency.
          </p>

          <div className="flex gap-12 mb-12">
            <div>
              <p className="text-3xl font-extrabold text-[#cd831f] mb-1">0.02s</p>
              <p className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">Response Time</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#cd831f] mb-1">99.9%</p>
              <p className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">Integration Rate</p>
            </div>
          </div>

          <button className="bg-[#cf831c] hover:bg-[#b57116] text-white px-8 py-3.5 rounded-sm text-sm font-bold tracking-wide transition-colors">
            EXPLORE SYSTEMS
          </button>
        </div>

        <div className="w-1/2 relative">
          <div className="absolute inset-0 bg-blue-50/50 rounded-bl-[100px] -z-10 translate-x-12 -translate-y-8 h-[110%]"></div>
          <div className="bg-[#121f29] rounded-tr-[80px] rounded-bl-[80px] rounded-tl-3xl rounded-br-3xl overflow-hidden aspect-[4/3] shadow-2xl relative border border-white/5">
            <img src="/smart_router.png" alt="Smart Home" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121f29] via-transparent to-transparent opacity-60" />
          </div>

          {/* Testimonial Card */}
          <div className="absolute -bottom-8 -left-12 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-[320px] border border-white/50">
            <p className="text-sm font-medium text-gray-600 italic leading-snug mb-4">
              "The intersection of intelligence and aesthetics."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="Reviewer" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-900 leading-tight">JULIAN VANE</p>
                <p className="text-[9px] font-medium text-gray-500">CHIEF DESIGN, JUMP.STUDIO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
