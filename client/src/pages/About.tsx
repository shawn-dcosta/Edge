import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, Star } from 'lucide-react';
import TextReveal from '../components/TextReveal';
import SectionReveal from '../components/SectionReveal';
import MagneticWrapper from '../components/MagneticWrapper';

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax for image elements
  const imgY1 = useTransform(smoothScroll, [0, 1], [0, -100]);
  const imgY2 = useTransform(smoothScroll, [0, 1], [0, 100]);

  const pillars = [
    {
      title: "Integrity",
      icon: <Shield size={32} />,
      desc: "Transparent cost-effective solutions crucial to a successful event.",
      detail: "We act as strategic partners, working closely to deliver a customized and unique setup for every event."
    },
    {
      title: "Creativity",
      icon: <Zap size={32} />,
      desc: "Envisioning out-of-the-box concepts to constantly outshine expectations.",
      detail: "Formed out of the desire to bring fresh creative branding know-how to the market."
    },
    {
      title: "Quality",
      icon: <Star size={32} />,
      desc: "Impeccable attention to detail in every aspect of logistical execution.",
      detail: "We take sincere pride in working 'edge to edge' to manage dynamic, memorable events."
    }
  ];

  return (
    <div ref={containerRef} className="w-full bg-edge-white overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            <h2 className="text-[20vw] font-black text-edge-black whitespace-nowrap overflow-hidden">EXCESSIVE SHARPNESS</h2>
        </div>
        
        <span className="text-edge-red font-bold tracking-[0.5em] uppercase text-sm mb-6 block">The Edge Philosophy</span>
        
        <div className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none mb-8">
          <TextReveal text="EXCESSIVE" />
          <TextReveal text="SHARPNESS." className="text-edge-red" delay={0.2} />
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-500 max-w-2xl font-light"
        >
          Working "Edge to Edge" with a friendly, personal, and fresh approach to premium production.
        </motion.p>
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-edge-black text-edge-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <motion.div style={{ y: imgY1 }} className="relative z-10 aspect-[4/5] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" alt="Stage Production" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div style={{ y: imgY2 }} className="absolute -bottom-20 -right-10 md:-right-20 w-2/3 aspect-square border-8 border-edge-red z-20 overflow-hidden hidden md:block">
                 <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop" alt="Event Execution" className="w-full h-full object-cover" />
              </motion.div>
            </div>
            
            <div className="space-y-12">
               <SectionReveal>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Why Choose <br/><span className="text-edge-red">The Edge?</span></h2>
               </SectionReveal>
               
               <div className="space-y-8 text-xl text-gray-400 font-light leading-relaxed">
                  <p>
                    Edge was formed out of the desire to bring creative, logistical and branding know-how to the market with a friendly, personal and fresh approach. 
                  </p>
                  <p>
                    A positive work environment and quality relationships with both clients and vendors are key to the company's success. We acts as strategic partners, working closely to deliver customized setups.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Bento Grid */}
      <section className="py-32 bg-edge-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-24 flex justify-center">
             <SectionReveal width="fit-content">
               <h2 className="text-6xl font-black tracking-tighter text-edge-black uppercase">The 3 Pillars.</h2>
             </SectionReveal>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {pillars.map((pillar, idx) => (
                <MagneticWrapper key={idx} strength={0.1}>
                   <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-edge-white p-10 md:p-12 aspect-square flex flex-col justify-between group hover:bg-edge-red transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Secondary Description Box (Top Overlay) */}
                    <div className="absolute top-0 left-0 w-full h-[70%] bg-edge-black p-8 md:p-10 flex items-center -translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                       <p className="text-white font-light italic border-l-2 border-edge-red pl-4 text-sm sm:text-base leading-relaxed">{pillar.detail}</p>
                    </div>

                    {/* Branding Section (Icon & Title) */}
                    <div className="relative z-30 transition-transform duration-500 translate-y-0 group-hover:translate-y-[180%]">
                      <div className="text-edge-red mb-4 group-hover:opacity-0 group-hover:scale-50 transition-all duration-500">
                        {pillar.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase text-edge-black group-hover:text-edge-white transition-colors duration-500">{pillar.title}</h3>
                    </div>

                    {/* Initial Description (Bottom) */}
                    <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
                      <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                        {pillar.desc}
                      </p>
                    </div>
                  </motion.div>
                </MagneticWrapper>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;

