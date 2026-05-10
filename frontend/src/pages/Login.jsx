import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        login(data.username, data.token);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0"></div>

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-ambient z-10 mx-4 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to access your ShopEase experience.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors" onClick={(e) => e.preventDefault()}>Forgot your password?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 px-4 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30"
          >
            Sign In
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Don't have an account? </span>
            <Link to="/register" className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
              Become a member now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
