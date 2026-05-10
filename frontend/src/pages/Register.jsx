import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    address: '',
    phoneNumber: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errText = await response.text();
        setError(errText || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface relative overflow-hidden py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] z-0"></div>

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-ambient z-10 mx-4 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-sm text-gray-500">Join ShopEase for an exclusive experience.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              type="text" 
              name="address"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phoneNumber"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                type="text" 
                name="country"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 focus:bg-white text-gray-900 font-medium"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 px-4 mt-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30"
          >
            Create Account
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
              Sign in now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
