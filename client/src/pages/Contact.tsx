import { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await axios.post('http://localhost:5000/api/inquiry', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form', error);
      setStatus('error');
    }
  };

  return (
    <div className="w-full bg-edge-gray min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-edge-black uppercase mb-6">
              Let's <span className="text-edge-red text-transparent bg-clip-text bg-gradient-to-r from-edge-red to-red-600">Talk</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
              We bring creative, logistical and branding know-how to the market with a friendly, personal and fresh approach.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-8 uppercase text-edge-black">
              Reach Out
            </h2>
            <p className="text-gray-500 mb-12 font-light leading-relaxed">
              Edge Productions has been proud to execute events for the world's greatest brands on both a national and international level. A positive work environment and quality relationships with clients are key to our success.
            </p>
            
            <div className="space-y-8">
               <div className="flex items-start">
                  <div className="w-16 h-16 bg-edge-white flex items-center justify-center text-edge-red shadow-sm border border-gray-100 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div className="ml-6">
                    <p className="font-bold tracking-widest text-xs uppercase text-gray-400 mb-1">Call Us</p>
                    <p className="text-xl font-medium text-edge-black">+91 9594028099</p>
                    <p className="text-sm text-gray-500">Savio D'costa</p>
                  </div>
               </div>

               <div className="flex items-start">
                  <div className="w-16 h-16 bg-edge-white flex items-center justify-center text-edge-red shadow-sm border border-gray-100 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div className="ml-6">
                    <p className="font-bold tracking-widest text-xs uppercase text-gray-400 mb-1">Email Us</p>
                    <a href="mailto:savio.edge@gmail.com" className="text-xl font-medium text-edge-black hover:text-edge-red transition-colors">savio.edge@gmail.com</a>
                  </div>
               </div>

               <div className="flex items-start">
                  <div className="w-16 h-16 bg-edge-white flex items-center justify-center text-edge-red shadow-sm border border-gray-100 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="ml-6">
                    <p className="font-bold tracking-widest text-xs uppercase text-gray-400 mb-1">Location</p>
                    <p className="text-xl font-medium text-edge-black">Mumbai, India</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-edge-white p-10 lg:p-12 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-black tracking-tighter mb-8 uppercase text-edge-black border-b-[3px] border-edge-red pb-4 inline-block">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Full Name *</label>
                  <input required type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-edge-gray border-0 border-b-2 border-transparent focus:border-edge-red focus:ring-0 px-4 py-3 transition-colors duration-300 outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Phone *</label>
                  <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-edge-gray border-0 border-b-2 border-transparent focus:border-edge-red focus:ring-0 px-4 py-3 transition-colors duration-300 outline-none" placeholder="+91 9876543210" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Email *</label>
                  <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-edge-gray border-0 border-b-2 border-transparent focus:border-edge-red focus:ring-0 px-4 py-3 transition-colors duration-300 outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Company</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full bg-edge-gray border-0 border-b-2 border-transparent focus:border-edge-red focus:ring-0 px-4 py-3 transition-colors duration-300 outline-none" placeholder="Your Brand" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Project Details *</label>
                <textarea required id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full bg-edge-gray border-0 border-b-2 border-transparent focus:border-edge-red focus:ring-0 px-4 py-3 transition-colors duration-300 outline-none resize-none" placeholder="Tell us about your event..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-edge-black text-white font-bold tracking-widest uppercase py-4 flex items-center justify-center hover:bg-edge-red transition-colors duration-300 disabled:opacity-70"
              >
                {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
                <Send size={18} className="ml-3" />
              </button>

              {status === 'success' && (
                <div className="bg-green-50 text-green-800 p-4 border-l-4 border-green-500 text-sm font-medium">
                  Thank you! Your inquiry has been sent. We will contact you shortly.
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 text-red-800 p-4 border-l-4 border-red-500 text-sm font-medium">
                  Oops! Something went wrong. Please try again later or contact us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
