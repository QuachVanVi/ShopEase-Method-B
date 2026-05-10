import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldBan, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch product details
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });

    // Fetch reviews
    fetch(`http://localhost:8080/api/reviews/product/${id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
      })
      .catch(err => console.error("Failed to fetch reviews:", err));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading essentials...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Artifact not found.</div>;
  }

  // Calculate average rating if we have reviews, else simulate it for the design
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "4.8";
  const numReviews = reviews.length > 0 ? reviews.length : 124;

  return (
    <div className="container mx-auto px-6 py-12">
      <button 
        onClick={() => navigate('/')} 
        className="mb-8 text-sm font-semibold text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
      >
        ← Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Left Column: Images */}
        <div>
          <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-[4/5] w-full mb-6 relative shadow-ambient">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnails (Simulated) */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-200 rounded-xl aspect-square overflow-hidden border-2 border-primary cursor-pointer relative">
               <img src={product.imageUrl} className="w-full h-full object-cover" alt="thumbnail 1" />
            </div>
            <div className="bg-gray-200 rounded-xl aspect-square overflow-hidden cursor-pointer relative after:absolute after:inset-0 after:bg-black/20 hover:after:bg-black/0 transition-all">
               <img src={product.imageUrl} className="w-full h-full object-cover" alt="thumbnail 2" />
               <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/50">2</div>
            </div>
            <div className="bg-gray-200 rounded-xl aspect-square overflow-hidden cursor-pointer relative after:absolute after:inset-0 after:bg-black/20 hover:after:bg-black/0 transition-all">
               <img src={product.imageUrl} className="w-full h-full object-cover" alt="thumbnail 3" />
               <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/50">3</div>
            </div>
            <div className="bg-gray-800 rounded-xl aspect-square flex items-center justify-center text-white font-medium cursor-pointer shadow-inner">
              +4
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-widest">{product.brand} COLLECTION</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex text-primary">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-sm font-medium text-gray-600">{avgRating} ({numReviews} Reviews)</span>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {product.description} A masterpiece of minimalist engineering designed for those who appreciate the silence between the seconds.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Scratch-resistant sapphire crystal</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> 5 ATM water resistance</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Italian vegetable-tanned leather</li>
            </ul>
          </div>

          {/* Pricing & CTA Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-ambient w-full mt-auto mb-8">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Total Price</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-gray-900">${product.price}</span>
                <span className="text-sm text-gray-400 line-through mb-1">${(product.price * 1.28).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-6">
              <span>🗑️</span> In Stock: {product.stock} units left
            </div>

            <div className="space-y-3">
              <button onClick={() => addToCart(product)} className="w-full py-4 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                ADD TO CART
              </button>
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-white text-gray-900 border-2 border-gray-200 text-sm font-bold rounded-xl hover:border-gray-300 transition-colors">
                  BUY NOW
                </button>
                <button 
                  onClick={() => {
                    const success = toggleWishlist(product.id);
                    if (!success) navigate('/login');
                  }}
                  className={`px-4 py-4 border-2 rounded-xl transition-all ${
                    isInWishlist(product.id) 
                      ? "border-red-100 bg-red-50 text-red-500" 
                      : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                  }`}
                  title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-4">
               <div className="flex items-start gap-3">
                 <Truck className="w-5 h-5 text-gray-400 shrink-0" />
                 <p className="text-xs text-gray-500">Free express shipping worldwide</p>
               </div>
               <div className="flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
                 <p className="text-xs text-gray-500">2-year manufacturer warranty</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 -mx-6 px-6 py-16 md:-mx-12 md:px-12 lg:-mx-24 lg:px-24 rounded-t-[3rem]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <button className="text-sm font-semibold text-primary hover:underline">Write a review</button>
          </div>

          <div className="space-y-6 mb-10">
            {/* Review Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Marcus Thorne</h4>
                    <p className="text-xs text-gray-400">Verified Purchaser • 2 days ago</p>
                  </div>
                </div>
                <div className="flex text-primary">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <h5 className="font-bold text-sm text-gray-900 mb-2">Timeless Perfection</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                The build quality is beyond anything I expected at this price point. The materials have a weight and warmth that standard models just can't match. It's been my daily driver for two weeks and it feels incredibly premium.
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Elena Rodriguez</h4>
                    <p className="text-xs text-gray-400">Verified Purchaser • 1 week ago</p>
                  </div>
                </div>
                <div className="flex text-primary">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current opacity-30" />
                </div>
              </div>
              <h5 className="font-bold text-sm text-gray-900 mb-2">Minimalist's Dream</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                I love the clean face and the way the aesthetic feels. My only minor gripe is it was a bit stiff at first, but it softened up beautifully after 3 days of use. Definitely a curated piece.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-6 py-3 border border-gray-200 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
