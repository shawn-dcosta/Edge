import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName
      });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-edge-black relative pt-32 pb-12 px-4">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-edge-red/5 skew-x-12 transform origin-right pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10 h-fit"
      >
        <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-widest mb-8">
          <ArrowLeft size={14} className="mr-2" /> Back to Vault
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">
            CREATE <span className="text-edge-red">ACCOUNT</span>
          </h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-medium">Join the Edge Productions platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-edge-red/20 border border-edge-red/50 text-edge-red text-xs uppercase font-bold tracking-widest text-center rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
                placeholder="JOHN DOE"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Company (Optional)</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
                placeholder="EDGE PROD"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
              placeholder="SECRET@EDGE.COM"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
                placeholder="********"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-edge-red focus:ring-1 focus:ring-edge-red outline-none transition-all"
                placeholder="********"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-edge-black font-black uppercase tracking-widest py-4 rounded-lg flex items-center justify-center hover:bg-edge-red hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-8 disabled:opacity-50"
          >
            {loading ? 'CREATING...' : (
              <>
                <UserPlus size={18} className="mr-2" /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0a0a0a] px-4 text-gray-500">Or Register With</span></div>
        </div>

        <button 
          onClick={login}
          className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
            alt="Google" 
            className="w-5 h-5 mr-3"
          />
          Google Authentication
        </button>
      </motion.div>
    </div>
  );
};

export default Register;
