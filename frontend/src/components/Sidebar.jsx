import { useState } from 'react';
import { Home, Monitor, Shirt, Leaf, Sparkles, Trophy, Book, Gamepad, Settings, CreditCard, Heart, ChevronDown, ChevronUp, Utensils } from 'lucide-react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [searchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const currentCategory = searchParams.get('category');
  const currentTab = searchParams.get('tab') || 'shop';

  const isProfileMode = location.pathname === '/profile';

  const isActive = (name) => {
    if (isProfileMode) return currentTab === name;
    if (name === 'Home' && !currentCategory) return true;
    return currentCategory === name;
  };

  const primaryCategories = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Electronics', icon: Monitor, path: '/?category=Electronics' },
    { name: 'Apparel', icon: Shirt, path: '/?category=Fashion' },
    { name: 'Home & Garden', icon: Leaf, path: `/?category=${encodeURIComponent('Home & Garden')}` },
  ];

  const moreCategories = [
    { name: 'Beauty', icon: Sparkles, path: '/?category=Beauty' },
    { name: 'Sports', icon: Trophy, path: '/?category=Sports' },
    { name: 'Wellness', icon: Heart, path: '/?category=Wellness' },
    { name: 'Books', icon: Book, path: '/?category=Books' },
    { name: 'Toys', icon: Gamepad, path: '/?category=Toys' },
    { name: 'Kitchen', icon: Utensils, path: '/?category=Kitchen' },
  ];

  const settingsItems = [
    { name: 'shop', label: 'Shop Settings', icon: Settings, path: '/profile?tab=shop' },
    { name: 'billing', label: 'Personal Card Details', icon: CreditCard, path: '/profile?tab=billing' },
    { name: 'saved', label: 'Saved Products', icon: Heart, path: '/profile?tab=saved' }
  ];

  const headerTitle = isProfileMode ? "Account Settings" : "Collections";
  const headerSubtitle = isProfileMode ? "Personalize Experience" : "The Editorial Selection";

  const renderItem = (item) => (
    <li key={item.name}>
      <Link 
        to={item.path} 
        className={`flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
          isActive(item.name) 
            ? "text-[#e68421] bg-orange-50/50" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <item.icon className={`w-4 h-4 ${isActive(item.name) ? "text-[#e68421]" : "text-gray-400"}`} strokeWidth={2.5} />
        {item.label || item.name}
      </Link>
    </li>
  );

  return (
    <aside className="w-[280px] shrink-0 pt-10 pb-8 pr-12 hidden lg:block bg-surface sticky top-20 h-[calc(100vh-80px)] overflow-y-auto z-50">
      <div className="mb-12">
        <h2 className="text-[15px] font-extrabold text-gray-900 mb-1">{headerTitle}</h2>
        <p className="text-[10px] font-extrabold text-gray-400 tracking-[0.2em] mb-6 uppercase">{headerSubtitle}</p>
        
        <ul className="space-y-1">
          {isProfileMode ? (
            settingsItems.map(renderItem)
          ) : (
            <>
              {primaryCategories.map(renderItem)}
              
              {isExpanded && moreCategories.map(renderItem)}

              <li>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-between px-3 py-3 mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#e68421] transition-colors border-t border-gray-100 pt-4"
                >
                  <span>{isExpanded ? "Show Fewer" : "View More Categories"}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
}
