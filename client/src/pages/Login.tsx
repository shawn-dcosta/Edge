import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(formData);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-edge-black relative pt-32 pb-12 px-4">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-edge-red/5 skew-x-12 transform origin-right pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10 h-fit"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
            EDGE <span className="text-edge-red">VAULT</span>
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-medium">Identity Verification Required</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-edge-red/20 border border-edge-red/50 text-edge-red text-[10px] uppercase font-bold tracking-widest text-center rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
              placeholder="SECRET@EDGE.COM"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
              placeholder="********"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-edge-black font-black uppercase tracking-widest py-4 rounded-lg flex items-center justify-center hover:bg-edge-red hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : (
              <>
                <LogIn size={18} className="mr-2" /> Access Vault
              </>
            )}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0a0a0a] px-4 text-gray-500">Or Continue With</span></div>
        </div>

        <button 
          onClick={login}
          className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all mb-8"
        >
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
            alt="Google" 
            className="w-5 h-5 mr-3"
          />
          Google Authentication
        </button>

        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Don't have an account?</p>
          <Link 
            to="/register" 
            className="inline-flex items-center text-white hover:text-edge-red transition-colors text-xs font-black uppercase tracking-widest"
          >
            <UserPlus size={14} className="mr-2" /> Register Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
