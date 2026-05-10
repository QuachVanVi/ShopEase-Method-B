import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, MapPin, Phone, Globe, Save, Loader2, Heart, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';
import AddCardModal from '../components/AddCardModal';

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeTab = searchParams.get('tab') || 'shop';
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    phoneNumber: '',
    country: ''
  });

  const [cardData, setCardData] = useState({
    cardNumber: null,
    expiry: null,
    cvv: null,
    nameOnCard: null
  });

  // 1. Sync card data from localStorage when the user is available
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`card_${user}`);
      if (saved) {
        setCardData(JSON.parse(saved));
      } else {
        // We no longer provide a default mock card to allow the user to add their own
        setCardData({
          cardNumber: null,
          expiry: null,
          cvv: null,
          nameOnCard: null
        });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch User details
        const userRes = await fetch(`http://localhost:8080/api/users/${user}`);
        if (userRes.ok) {
          const data = await userRes.json();
          setFormData({
            username: data.username || '',
            email: data.email || '',
            address: data.address || '',
            phoneNumber: data.phoneNumber || '',
            country: data.country || ''
          });
        }

        // Fetch Products for the wishlist display
        const prodRes = await fetch('http://localhost:8080/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
      } catch (err) {
        setMessage('Network error. Could not load account data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      setMessage('Network error. Could not update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  const handleSaveCard = (data) => {
    setCardData(data);
    localStorage.setItem(`card_${user}`, JSON.stringify(data));
    setMessage('Payment method added successfully.');
  };

  const handleRemoveCard = () => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) return;
    setCardData({ cardNumber: null, expiry: null, cvv: null, nameOnCard: null });
    localStorage.removeItem(`card_${user}`);
    setMessage('Payment method removed successfully.');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-[#f9f9f9] rounded-3xl shadow-ambient border border-gray-200 overflow-hidden transition-all duration-300">
        
        {/* Profile Header Background */}
        <div className="bg-[#1c2223] h-40 relative">
          <div className="absolute -bottom-16 left-10 w-32 h-32 bg-white rounded-3xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl italic capitalize">
                {user?.charAt(0)}
             </div>
          </div>
        </div>
        
        <div className="pt-20 px-10 pb-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user}</h1>
              <p className="text-gray-500 font-medium mt-1">
                {activeTab === 'shop' && 'Managing your individual style profile'}
                {activeTab === 'saved' && `You have ${wishlist.length} items curated in your wishlist`}
                {activeTab === 'billing' && 'Securely manage your payment methods'}
              </p>
            </div>
            <button 
                onClick={logout}
                className="px-6 py-2.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all font-bold text-sm tracking-wide"
              >
                Sign Out
            </button>
          </div>

          <hr className="mb-10 border-gray-200" />

          {message && (
            <div className={`mb-8 p-4 rounded-xl text-sm font-bold border animate-in fade-in slide-in-from-top-2 ${message.includes('added') || message.includes('success') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {message}
            </div>
          )}

          {/* Tab: SHOP SETTINGS */}
          {activeTab === 'shop' && (
            <form onSubmit={handleUpdateProfile} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity Details</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={user} 
                        disabled 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed font-bold text-sm" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Connection</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm shadow-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Logistics & Location</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Dispatch Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm shadow-sm" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Contact Phone</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="tel" 
                          name="phoneNumber" 
                          value={formData.phoneNumber} 
                          onChange={handleChange} 
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm shadow-sm" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Region</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Globe className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="country" 
                          value={formData.country} 
                          onChange={handleChange} 
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm shadow-sm" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={updating} 
                  className="w-full md:w-auto px-12 py-4 bg-[#1c2223] text-white rounded-xl text-sm font-black tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98] shadow-2xl shadow-black/20"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SYNCHRONIZING...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>SAVE PROFILE ARCHIVE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Tab: SAVED PRODUCTS */}
          {activeTab === 'saved' && (
            <div className="space-y-8">
               {savedProducts.length === 0 ? (
                 <div className="py-20 text-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Longing for something?</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">Your curation is currently empty.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-[#1c2223] text-white px-8 py-3 rounded-xl text-xs font-black tracking-widest hover:bg-black transition-all">
                       <ShoppingBag className="w-4 h-4" />
                       GO SHOPPING
                    </Link>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProducts.map(product => (
                      <div key={product.id} className="group relative bg-white rounded-2xl border border-gray-200 p-4 transition-all hover:shadow-xl">
                        <Link to={`/product/${product.id}`} className="block aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                           <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                        </Link>
                        <button 
                          onClick={() => toggleWishlist(product.id)} 
                          className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg z-10 text-red-500"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
                        <p className="text-lg font-black text-gray-900">${product.price}</p>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {/* Tab: BILLING */}
          {activeTab === 'billing' && (
            <div className="max-w-2xl">
               {cardData.cardNumber ? (
                 <>
                   <div className="bg-gradient-to-br from-[#1c2223] to-[#3a4446] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-8">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                      <div className="flex justify-between items-start mb-12">
                         <CreditCard className="w-10 h-10 opacity-80" />
                         <ShieldCheck className="w-6 h-6 text-green-400" />
                      </div>
                      <p className="text-2xl font-mono tracking-[0.2em] mb-8">
                        {cardData.cardNumber.slice(0, -4).replace(/\d/g, "*") + cardData.cardNumber.slice(-4)}
                      </p>
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Card Holder</p>
                            <p className="font-bold tracking-wide">{cardData.nameOnCard}</p>
                         </div>
                         <div>
                            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Expires</p>
                            <p className="font-bold tracking-wide">{cardData.expiry}</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between mb-12 ml-2">
                     <p className="text-xs text-gray-400 font-medium">Auto-debit is active for this card.</p>
                     <button 
                        onClick={handleRemoveCard}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all font-bold"
                     >
                        Delete Payment Method
                     </button>
                   </div>
                 </>
               ) : (
                 <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 mb-12">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-8">No payment method added</h3>
                 </div>
               )}

               <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-900">Secure Payment Methods</h3>
                  <button 
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="w-full p-6 border-2 border-gray-200 rounded-2xl flex items-center justify-between group hover:border-[#e68421] transition-colors cursor-pointer bg-white"
                  >
                     <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                           <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-[#e68421] transition-colors" />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 text-sm group-hover:text-[#e68421] transition-colors">Add New Payment Method</p>
                           <p className="text-xs text-gray-500">Universal card support</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-lg group-hover:bg-[#e68421] group-hover:text-white group-hover:border-[#e68421] transition-all">+</div>
                  </button>
               </div>
            </div>
          )}

          <AddCardModal 
            isOpen={isAddCardModalOpen} 
            onClose={() => setIsAddCardModalOpen(false)} 
            onSave={handleSaveCard} 
          />

        </div>
      </div>
    </div>
  );
}
