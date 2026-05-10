import { X, Monitor, Shirt, Leaf, Sparkles, Trophy, Book, Gamepad, Utensils, Heart, Camera, Watch, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CategoryModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const categories = [
    { name: 'Electronics', icon: Monitor, description: 'Cutting-edge technology and gadgets.' },
    { name: 'Fashion', icon: Shirt, description: 'Curated apparel and luxury accessories.' },
    { name: 'Home & Garden', icon: Leaf, description: 'Minimalist decor and botanical essentials.' },
    { name: 'Beauty', icon: Watch, description: 'Premium skincare and refined aesthetics.' },
    { name: 'Wellness', icon: Sparkles, description: 'Tools for a balanced and mindful lifestyle.' },
    { name: 'Sports', icon: Trophy, description: 'High-performance gear and activewear.' },
    { name: 'Books', icon: Book, description: 'Architectural journals and design collections.' },
    { name: 'Toys', icon: Gamepad, description: 'Designer collectibles and mindful play.' },
    { name: 'Kitchen', icon: Utensils, description: 'Architectural tools for the modern culinary space.' },
    { name: 'Photography', icon: Camera, description: 'Precision instruments for visual storytelling.' },
    { name: 'Audio', icon: Headphones, description: 'Studio-grade acoustics and high-fidelity sound.' },
  ];

  const handleSelect = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">The Category Hub</h2>
              <p className="text-gray-500 font-medium mt-1">Explore our full editorial selection.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#e68421] hover:shadow-xl hover:shadow-orange-900/5 transition-all text-left"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:border-orange-100 group-hover:bg-orange-50 transition-colors">
                  <cat.icon className="w-5 h-5 text-gray-400 group-hover:text-[#e68421] transition-colors" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#e68421] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
