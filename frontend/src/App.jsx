import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductGrid from './pages/ProductGrid';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import Profile from './pages/Profile';

function HomeOrGrid() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  if (category && category !== 'Home') {
    return <ProductGrid />;
  }
  return <Home />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WishlistProvider>
          <CartProvider>
      <Router>
        <div className="min-h-screen bg-surface flex flex-col font-sans">
          <Navbar />
          
          <div className="flex flex-1 mx-auto w-full max-w-[1600px]">
            <Sidebar />
            
            <main className="flex-1 w-full relative">
              <Routes>
                <Route path="/" element={<HomeOrGrid />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
          </CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
