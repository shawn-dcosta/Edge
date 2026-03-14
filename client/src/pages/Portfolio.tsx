import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import TextReveal from '../components/TextReveal';
import SectionReveal from '../components/SectionReveal';
import MagneticWrapper from '../components/MagneticWrapper';

const CATEGORIES = [
  'All',
  'Award Functions', 
  'Exhibitions', 
  'Corporate Events', 
  'Conferences', 
  'Retail Merchandising', 
  'Weddings', 
  'Televised Events',
  'Mall Activity'
];

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  images?: string[]; // Array of additional images
  description?: string;
}

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [direction, setDirection] = useState(0); // For slide animation direction
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback data with multiple images
  const fallbackData: PortfolioItem[] = [
    { 
      _id: '1', 
      title: 'Leap of Faith - ET NOW', 
      category: 'Televised Events', 
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop'
      ],
      description: "A high-octane televised event for ET NOW, featuring dynamic stage lighting and multi-camera choreography."
    },
    { 
      _id: '2', 
      title: 'VP Awards In Vogue', 
      category: 'Award Functions', 
      imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    { _id: '3', title: 'Dell Technologies Forum', category: 'Conferences', imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop' },
    { _id: '4', title: 'Kiss Flow Exhibition', category: 'Exhibitions', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop' },
    { _id: '5', title: 'Grand Wedding Setup', category: 'Weddings', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop' },
    { _id: '6', title: 'Panasonic Retail Merchandising', category: 'Retail Merchandising', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' },
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/portfolio');
        if (res.data && res.data.length > 0) {
           setItems(res.data);
        } else {
           setItems(fallbackData);
        }
      } catch (error) {
        setItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Carousel Navigation Logic
  const handleNext = () => {
    if (!selectedItem?.images) return;
    setDirection(1);
    setCurrentImgIndex((prev) => (prev + 1) % selectedItem.images!.length);
  };

  const handlePrev = () => {
    if (!selectedItem?.images) return;
    setDirection(-1);
    setCurrentImgIndex((prev) => (prev - 1 + selectedItem.images!.length) % selectedItem.images!.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div ref={containerRef} className="w-full bg-edge-white min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cinematic Header */}
        <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
               <div className="h-[2px] w-12 bg-edge-red animate-pulse"></div>
               <span className="text-edge-red font-black tracking-[0.4em] uppercase text-xs">Edge Gallery</span>
            </div>
            
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-edge-black leading-[0.85] mb-8">
              <TextReveal text="CURATED" />
              <TextReveal text="EXPERIENCES." className="text-edge-red" delay={0.2} />
            </h1>
            
            <SectionReveal>
              <p className="text-xl md:text-2xl text-gray-500 max-w-3xl font-light leading-relaxed">
                A legacy of <span className="text-edge-black font-semibold">"Edge to Edge"</span> execution. Every frame, every stage, every interaction crafted for paramount impact.
              </p>
            </SectionReveal>
        </div>

        {/* Liquid Slider Filter Bar */}
        <div className="relative mb-20 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-2 min-w-max p-1 bg-edge-gray/50 rounded-full border border-gray-100">
            {CATEGORIES.map((category) => (
              <MagneticWrapper key={category} strength={0.2}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-8 py-4 text-xs font-black tracking-widest uppercase transition-all duration-500 rounded-full z-10 ${
                    activeCategory === category 
                      ? 'text-white' 
                      : 'text-gray-500 hover:text-edge-black'
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.div 
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-edge-black rounded-full -z-10 shadow-lg"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </button>
              </MagneticWrapper>
            ))}
          </div>
        </div>

        {/* Paramount Gallery Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
             <div className="w-12 h-12 border-4 border-edge-gray border-t-edge-red rounded-full animate-spin"></div>
             <p className="text-xs uppercase tracking-widest font-black text-gray-400">Loading Vision</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: "circOut" }}
                  className="group relative aspect-[4/5] overflow-hidden bg-edge-gray shadow-sm cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setCurrentImgIndex(0);
                    setDirection(0);
                  }}
                >
                  {/* The Image (Threshold Admin Image) */}
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
                  />
                  
                  {/* Stage Veil Overlay (Curtain Reveal) */}
                  <div className="absolute inset-x-0 bottom-0 h-0 bg-edge-black transition-all duration-500 ease-in-out group-hover:h-full group-hover:bg-edge-black/90 pointer-events-none flex flex-col justify-end p-10">
                     <div className="overflow-hidden mb-2">
                        <span className="text-edge-red font-black text-[10px] tracking-[0.3em] uppercase block transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100 italic flex items-center gap-2">
                          {item.category}
                          {item.images && item.images.length > 1 && (
                            <span className="bg-edge-red/20 text-edge-red px-2 py-0.5 rounded-sm text-[8px] flex items-center gap-1">
                               <ImageIcon size={10} /> {item.images.length} SHOTS
                            </span>
                          )}
                        </span>
                     </div>
                     <div className="overflow-hidden">
                        <h3 className="text-white text-3xl font-black tracking-tighter transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200 uppercase leading-none">
                          {item.title}
                        </h3>
                     </div>
                     <div className="mt-8 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                        <div className="flex items-center gap-3 text-white/50 text-xs font-bold uppercase tracking-widest">
                           Enter Project <ArrowRight size={14} className="text-edge-red" />
                        </div>
                     </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <Maximize2 size={16} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {filteredItems.length === 0 && !loading && (
           <div className="text-center py-40">
             <div className="mb-4">
                <X size={48} className="mx-auto text-gray-200" />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
                No Vision Found in this category.
             </p>
           </div>
        )}
      </div>

      {/* Full-Screen Carousel Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-edge-black flex items-center justify-center p-4 md:p-12 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="absolute top-10 right-10 z-[110] w-12 h-12 bg-edge-red text-white flex items-center justify-center shadow-2xl"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </motion.button>

            <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center" onClick={e => e.stopPropagation()}>
               
               {/* Carousel Side (Left/Main) */}
               <div className="relative flex-grow w-full h-[50vh] md:h-full bg-black/40 overflow-hidden flex items-center justify-center group/carousel border border-white/5">
                  
                  {/* Navigation Arrows */}
                  {selectedItem.images && selectedItem.images.length > 1 && (
                    <>
                      <button 
                        className="absolute left-4 z-[110] w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-all bg-black/40 hover:bg-edge-red rounded-full backdrop-blur-md"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      >
                        <ChevronLeft size={32} />
                      </button>
                      <button 
                        className="absolute right-4 z-[110] w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-all bg-black/40 hover:bg-edge-red rounded-full backdrop-blur-md"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      >
                        <ChevronRight size={32} />
                      </button>
                    </>
                  )}

                  {/* The Current Image */}
                  <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10 overflow-hidden text-center">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.img
                        key={currentImgIndex}
                        src={selectedItem.images ? selectedItem.images[currentImgIndex] : selectedItem.imageUrl}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 450, damping: 45, mass: 1 },
                          opacity: { duration: 0.15 }
                        }}
                        className="max-w-full max-h-full object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Progress Indicators (Floating at bottom of image) */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[110]">
                    {selectedItem.images?.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-1 rounded-full transition-all duration-500 ${idx === currentImgIndex ? 'w-10 bg-edge-red shadow-[0_0_15px_rgba(211,18,18,0.8)]' : 'w-4 bg-white/20'}`}
                        />
                    ))}
                  </div>
               </div>

               {/* Info Side (Right/Sidebar) */}
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="w-full md:max-w-md flex flex-col justify-center text-left"
               >
                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                         <div className="h-[2px] w-6 bg-edge-red"></div>
                         <span className="text-edge-red font-black tracking-[0.4em] uppercase text-[10px] block">
                           Project Debrief {selectedItem.images && `/ Shot 0${currentImgIndex + 1}`}
                         </span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                        {selectedItem.title}
                      </h2>
                    </div>

                    <p className="text-gray-400 font-light leading-relaxed text-lg italic border-l-2 border-edge-red/30 pl-6">
                      {selectedItem.description || "A paramount execution of creative, logistical, and branding know-how, delivered with The Edge philosophy."}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-8 bg-white/5 border border-white/10 space-y-2 group/item transition-all hover:bg-white/10 hover:border-edge-red/50">
                         <p className="text-[10px] uppercase font-bold text-edge-red tracking-[0.2em]">Client Sector</p>
                         <p className="text-white text-2xl font-black uppercase tracking-tight">{selectedItem.category}</p>
                      </div>
                    </div>
                  </div>
               </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;

