import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll detection for dynamic transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we need a transparent navbar initially
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isTransparentInitially = (location.pathname === '/' || isAuthPage) && !scrolled;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${
      isTransparentInitially 
        ? 'bg-transparent border-transparent' 
        : 'bg-edge-white/95 backdrop-blur-md border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-20' : 'h-24'}`}>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className={`text-3xl font-black tracking-tighter cursor-pointer transition-colors duration-500 ${isTransparentInitially ? 'text-edge-white' : 'text-edge-black'}`}>
              EDGE
              <span className={`block text-[10px] tracking-[0.3em] font-bold leading-tight transition-colors duration-500 ${isTransparentInitially ? 'text-edge-red/90' : 'text-edge-red'}`}>
                PRODUCTIONS
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-semibold text-xs tracking-[0.2em] uppercase transition-colors duration-300 relative group overflow-hidden ${
                  isTransparentInitially ? 'text-edge-white hover:text-white' : 'text-edge-black hover:text-edge-red'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ${isTransparentInitially ? 'bg-white' : 'bg-edge-red'}`}></span>
              </Link>
            ))}
            
            {user && (
              <button
                onClick={logout}
                className={`flex items-center space-x-2 font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 px-5 py-2.5 border rounded-full ${
                  isTransparentInitially 
                    ? 'text-white border-white/20 hover:bg-white hover:text-edge-black' 
                    : 'text-edge-black border-edge-black/10 hover:bg-edge-black hover:text-white'
                }`}
              >
                <span>Logout</span>
                <LogOut size={12} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors duration-500 ${isTransparentInitially ? 'text-edge-white' : 'text-edge-black'}`}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className={`md:hidden border-b border-gray-100 absolute w-full shadow-2xl origin-top animate-in slide-in-from-top-4 fade-in ${
          isAuthPage ? 'bg-edge-black border-white/10' : 'bg-edge-white border-gray-100'
        }`}>
          <div className="px-6 pt-4 pb-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-lg font-black uppercase tracking-widest border-b last:border-0 hover:translate-x-2 transition-all duration-300 ${
                  isAuthPage ? 'text-white border-white/5 hover:text-edge-red' : 'text-edge-black border-gray-100 hover:text-edge-red'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className={`w-full flex items-center justify-between py-5 px-2 text-xl font-black uppercase tracking-widest border-t transition-all duration-300 ${
                  isAuthPage ? 'text-edge-red border-white/10' : 'text-edge-red border-gray-100'
                }`}
              >
                Logout
                <LogOut size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
