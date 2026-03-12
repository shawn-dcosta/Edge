import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-edge-black text-edge-white py-16 border-t-[8px] border-edge-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand */}
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">
            EDGE
          </h2>
          <span className="text-edge-red block text-sm tracking-[0.3em] font-medium leading-tight mb-6">
            PRODUCTIONS
          </span>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            The most preferred Production House in India. We deliver out-of-the-box concepts and execute paramount event experiences.
          </p>
          
          <div className="flex space-x-4 mt-8">
             <a href="#" className="text-gray-400 hover:text-edge-red transition-colors"><Instagram size={20} /></a>
             <a href="#" className="text-gray-400 hover:text-edge-red transition-colors"><Facebook size={20} /></a>
             <a href="#" className="text-gray-400 hover:text-edge-red transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-bold tracking-widest uppercase mb-6 relative inline-block">
            Explore
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-edge-red"></span>
          </h3>
          <ul className="space-y-4 text-sm text-gray-400 font-medium">
            <li><Link to="/" className="hover:text-edge-red transition-colors tracking-wide">HOME</Link></li>
            <li><Link to="/portfolio" className="hover:text-edge-red transition-colors tracking-wide">PORTFOLIO</Link></li>
            <li><Link to="/about" className="hover:text-edge-red transition-colors tracking-wide">ABOUT US</Link></li>
            <li><Link to="/contact" className="hover:text-edge-red transition-colors tracking-wide">CONTACT</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold tracking-widest uppercase mb-6 relative inline-block">
            Contact
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-edge-red"></span>
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start">
              <Phone size={18} className="mr-3 text-edge-red mt-0.5 flex-shrink-0" />
              <span>+91 9594028099<br/><span className="text-xs text-gray-500">Savio D'costa</span></span>
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-3 text-edge-red flex-shrink-0" />
              <a href="mailto:savio.edge@gmail.com" className="hover:text-edge-red transition-colors">savio.edge@gmail.com</a>
            </li>
            <li className="flex items-start">
              <MapPin size={18} className="mr-3 text-edge-red mt-0.5 flex-shrink-0" />
              <span>Mumbai, India</span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 tracking-widest">
        &copy; {new Date().getFullYear()} EDGE PRODUCTIONS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default Footer;
