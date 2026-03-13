import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import MagneticWrapper from '../components/MagneticWrapper';
import TextReveal from '../components/TextReveal';
import SectionReveal from '../components/SectionReveal';

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

  const contactCards = [
    {
      title: "Call Us",
      value: "+91 9594028099",
      sub: "Savio D'costa",
      icon: <Phone size={24} />,
      link: "tel:+919594028099"
    },
    {
      title: "Email Us",
      value: "savio.edge@gmail.com",
      sub: "Official Desk",
      icon: <Mail size={24} />,
      link: "mailto:savio.edge@gmail.com"
    },
    {
      title: "Location",
      value: "Mumbai, India",
      sub: "Global Reach",
      icon: <MapPin size={24} />,
      link: "#"
    }
  ];

  return (
    <div className="w-full bg-edge-white min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Boutique Header */}
        <div className="mb-24">
          {/* <div className="flex items-center gap-4 mb-6">
               <div className="h-[2px] w-12 bg-edge-red"></div>
               <span className="text-edge-red font-bold tracking-[0.3em] uppercase text-xs">Direct Link</span>
            </div> */}
          <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-edge-black leading-[0.85]">
            <TextReveal text="LET'S START" />
            <TextReveal text="SOMETHING." className="text-edge-red" delay={0.2} />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* Sidebar: Personal Connection */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <SectionReveal>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-edge-black">The Director's Office</h2>
              </SectionReveal>
              <div className="relative group max-w-sm">
                <div className="aspect-[4/5] bg-edge-gray overflow-hidden border-l border-t border-edge-red">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="Director" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-edge-black p-8 text-edge-white shadow-2xl">
                  <p className="italic font-light text-lg mb-4">"We don't just build stages; we build partnerships."</p>
                  <p className="text-edge-red font-bold uppercase tracking-widest text-xs">— Savio D'Costa</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 pt-12">
              {contactCards.map((card, idx) => (
                <MagneticWrapper key={idx} strength={0.15}>
                  <a href={card.link} className="block group">
                    <div className="bg-edge-gray/30 hover:bg-edge-black p-8 transition-all duration-500 flex items-center gap-6 group-hover:shadow-2xl">
                      <div className="text-edge-red group-hover:scale-125 transition-transform duration-500">
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 group-hover:text-edge-red">{card.title}</p>
                        <p className="text-lg font-bold text-edge-black group-hover:text-white transition-colors">{card.value}</p>
                      </div>
                    </div>
                  </a>
                </MagneticWrapper>
              ))}
            </div>
          </div>

          {/* High-End Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border-t-8 border-edge-red">
              <div className="mb-12">
                <h3 className="text-4xl font-black uppercase text-edge-black mb-4">Project Inquiry</h3>
                <p className="text-gray-400 font-light">Share your vision with us and we'll handle the logistics.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="group relative">
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-edge-red transition-all duration-500"
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-4 text-xs uppercase font-bold text-gray-400 tracking-widest pointer-events-none transition-all duration-500 peer-focus:-top-4 peer-focus:text-edge-red peer-[:not(:placeholder-shown)]:-top-4">Full Name</label>
                  </div>

                  <div className="group relative">
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-edge-red transition-all duration-500"
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-4 text-xs uppercase font-bold text-gray-400 tracking-widest pointer-events-none transition-all duration-500 peer-focus:-top-4 peer-focus:text-edge-red peer-[:not(:placeholder-shown)]:-top-4">Email Address</label>
                  </div>

                  <div className="group relative">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-edge-red transition-all duration-500"
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-4 text-xs uppercase font-bold text-gray-400 tracking-widest pointer-events-none transition-all duration-500 peer-focus:-top-4 peer-focus:text-edge-red peer-[:not(:placeholder-shown)]:-top-4">Phone Number</label>
                  </div>

                  <div className="group relative">
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-edge-red transition-all duration-500"
                      placeholder=" "
                    />
                    <label className="absolute left-0 top-4 text-xs uppercase font-bold text-gray-400 tracking-widest pointer-events-none transition-all duration-500 peer-focus:-top-4 peer-focus:text-edge-red peer-[:not(:placeholder-shown)]:-top-4">Company/Brand</label>
                  </div>
                </div>

                <div className="group relative">
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="peer w-full bg-transparent border-b-2 border-gray-100 py-4 outline-none focus:border-edge-red transition-all duration-500 resize-none"
                    placeholder=" "
                  />
                  <label className="absolute left-0 top-4 text-xs uppercase font-bold text-gray-400 tracking-widest pointer-events-none transition-all duration-500 peer-focus:-top-4 peer-focus:text-edge-red peer-[:not(:placeholder-shown)]:-top-4">Project Details</label>
                </div>

                <div className="pt-6">
                  <MagneticWrapper strength={0.1}>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="relative group bg-edge-black text-white px-12 py-6 font-black uppercase tracking-widest overflow-hidden transition-all duration-500 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {status === 'submitting' ? 'Transmitting...' : 'Send Message'}
                        <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-edge-red -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    </button>
                  </MagneticWrapper>
                </div>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-green-50 text-green-800 p-6 border-l-4 border-green-500 flex items-center gap-4"
                    >
                      <CheckCircle className="text-green-500" />
                      <p>Thank you! Your vision has been transmitted. We'll speak soon.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


