import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
  description?: string;
}

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fallback data if CMS is empty or offline
  const fallbackData: PortfolioItem[] = [
    { _id: '1', title: 'Leap of Faith - ET NOW', category: 'Televised Events', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop' },
    { _id: '2', title: 'VP Awards In Vogue', category: 'Award Functions', imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop' },
    { _id: '3', title: 'Dell Technologies Forum', category: 'Conferences', imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop' },
    { _id: '4', title: 'Kiss Flow Exhibition', category: 'Exhibitions', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop' },
    { _id: '5', title: 'Grand Wedding Setup', category: 'Weddings', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop' },
    { _id: '6', title: 'Panasonic Retail Merchandising', category: 'Retail Merchandising', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' },
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Try fetching from CMS
        const res = await axios.get('http://localhost:5000/api/portfolio');
        if (res.data && res.data.length > 0) {
           setItems(res.data);
        } else {
           setItems(fallbackData); // Use fallback if DB is empty
        }
      } catch (error) {
        console.log('Using fallback data, CMS might be offline');
        setItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="w-full bg-edge-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-edge-black uppercase mb-6">
              Our <span className="text-edge-red text-transparent bg-clip-text bg-gradient-to-r from-edge-red to-red-600">Work</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
              We take sincere pride in working "edge to edge." Explore our portfolio of paramount event experiences.
            </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm font-bold tracking-widest uppercase transition-all duration-300 border ${
                activeCategory === category 
                  ? 'bg-edge-black text-white border-edge-black' 
                  : 'bg-transparent text-gray-500 border-gray-200 hover:border-edge-red hover:text-edge-red'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-edge-red"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item._id}
                  className="group relative h-96 overflow-hidden bg-gray-100"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-edge-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <span className="text-edge-red font-bold text-xs tracking-[0.2em] uppercase mb-2 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                       {item.category}
                     </span>
                     <h3 className="text-white text-2xl font-black tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                       {item.title}
                     </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {filteredItems.length === 0 && !loading && (
           <div className="text-center py-20 text-gray-400 font-medium">
             No projects found in this category.
           </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
