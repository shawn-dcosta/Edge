import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientMarquee from '../components/ClientMarquee';

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth out the scroll progress to remove lag/jitter
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const yBg = useTransform(smoothScroll, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(smoothScroll, [0, 0.5], [1, 0]);
  const yText = useTransform(smoothScroll, [0, 0.5], ["0%", "100%"]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section ref={containerRef} className="relative h-screen flex items-center overflow-hidden bg-edge-black">
        
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1540306461975-f04dc7ea75e1?q=80&w=2938&auto=format&fit=crop" alt="Stage Setup" className="w-[110%] h-[110%] object-cover scale-110 opacity-50 block" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-edge-black via-transparent to-black/80 z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>

        <motion.div 
          style={{ opacity: opacityText, y: yText }} 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-edge-white w-full"
        >
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-edge-red tracking-[0.4em] text-sm md:text-md font-bold uppercase mb-4"
             >
               Edge to Edge Excellence
             </motion.h2>
             <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.9] mb-8 relative"
             >
               WE BUILD <br/>
               <span className="text-edge-red drop-shadow-2xl">PARAMOUNT</span> <br/>
               EXPERIENCES.
             </motion.h1>
             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.6 }}
                 className="max-w-2xl text-xl text-gray-300 leading-relaxed font-light"
               >
                 The most preferred Production House in India. From fresh creative concepts to intricate logistical execution, we create and manage dynamic, memorable events of all magnitudes.
               </motion.p>
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.8 }}
               >
                 <Link 
                   to="/portfolio" 
                   className="inline-flex items-center px-10 py-5 bg-edge-red text-white font-bold tracking-widest uppercase hover:bg-white hover:text-edge-red transition-all duration-500 rounded-none shadow-[0_0_40px_-5px_rgba(211,18,18,0.5)] hover:shadow-none translate-y-0 hover:-translate-y-1"
                 >
                    Our Work
                    <ArrowRight className="ml-4" size={24} />
                 </Link>
               </motion.div>
             </div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <ClientMarquee />

      {/* Core Values Section */}
      <section className="py-32 bg-edge-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
             >
               <h2 className="text-6xl font-black tracking-tighter mb-8 text-edge-black">OUR <span className="text-edge-red">PILLARS.</span></h2>
               <p className="text-xl text-gray-500 mb-10 leading-relaxed font-light">
                 We do not believe in the 'One-Size-Fits-All' kind of event packages. At Edge productions, we act as strategic partners, working closely to deliver a customized and unique setup.
               </p>
               
               <div className="space-y-10 mt-12">
                  <motion.div whileHover={{ x: 10 }} className="flex items-start transition-transform cursor-default">
                     <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-edge-gray border border-gray-200 text-edge-red">
                       <Shield size={28} />
                     </div>
                     <div className="ml-8">
                        <h3 className="text-2xl font-bold tracking-tight text-edge-black uppercase mb-2">Integrity</h3>
                        <p className="text-gray-500 font-light leading-relaxed">Transparent cost-effective solutions crucial to a successful event.</p>
                     </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 10 }} className="flex items-start transition-transform cursor-default">
                     <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-edge-gray border border-gray-200 text-edge-red">
                       <Zap size={28} />
                     </div>
                     <div className="ml-8">
                        <h3 className="text-2xl font-bold tracking-tight text-edge-black uppercase mb-2">Creativity</h3>
                        <p className="text-gray-500 font-light leading-relaxed">Envisioning out-of-the-box concepts to constantly outshine expectations.</p>
                     </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 10 }} className="flex items-start transition-transform cursor-default">
                     <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-edge-gray border border-gray-200 text-edge-red">
                       <Star size={28} />
                     </div>
                     <div className="ml-8">
                        <h3 className="text-2xl font-bold tracking-tight text-edge-black uppercase mb-2">Quality</h3>
                        <p className="text-gray-500 font-light leading-relaxed">Impeccable attention to detail in every aspect of logistical execution.</p>
                     </div>
                  </motion.div>
               </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="relative h-[800px] w-full overflow-hidden flex items-center justify-center group"
             >
                 <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2874&auto=format&fit=crop" alt="Event Setup" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-edge-black/50 to-transparent"></div>
                 <div className="absolute inset-0 border-[16px] border-edge-white/10 z-10 m-8"></div>
                 <h3 className="relative z-10 text-8xl font-black text-edge-white opacity-20 transform -rotate-90 origin-center whitespace-nowrap mix-blend-overlay tracking-tighter">ATTENTION TO DETAIL</h3>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-32 bg-edge-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center max-w-4xl mx-auto mb-20"
           >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 text-edge-black uppercase">Complete BTL Support</h2>
              <div className="w-32 h-1 bg-edge-red mx-auto mb-8"></div>
              <p className="text-xl text-gray-500 font-light">From fresh creative concepts to intricate execution.</p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['In house Production', 'Stage Setup & Construction', 'Events & Special Events', 'Retail Merchandising'].map((expertise, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  key={idx} 
                  className="bg-edge-white p-12 flex flex-col items-center justify-center text-center group hover:-translate-y-4 transition-transform duration-500 border-b-[6px] border-transparent hover:border-edge-red shadow-sm hover:shadow-2xl relative overflow-hidden"
                >
                   <div className="absolute -right-6 -top-6 text-[10rem] font-black text-gray-50 opacity-50 group-hover:text-edge-red/5 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                     0{idx + 1}
                   </div>
                   <div className="w-20 h-20 bg-edge-gray flex items-center justify-center mb-8 text-3xl font-black text-edge-red relative z-10 shadow-inner group-hover:bg-edge-red group-hover:text-white transition-colors duration-500">
                     {idx + 1}
                   </div>
                   <h3 className="text-xl font-bold tracking-widest uppercase text-edge-black relative z-10 leading-snug">{expertise}</h3>
                </motion.div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
