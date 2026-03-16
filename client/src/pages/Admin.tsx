import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Mail, LogOut, LayoutDashboard, Database, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const CATEGORIES = [
  'Award Functions', 'Exhibitions', 'Corporate Events',
  'Conferences', 'Retail Merchandising', 'Weddings',
  'Televised Events', 'Mall Activity'
];

declare global {
  interface Window {
    cloudinary: any;
  }
}

const AdminDashboard = () => {
  useAuth(); // Keeping the hook call to ensure protection/context is active if needed
  const [activeTab, setActiveTab] = useState<'portfolio' | 'inquiries'>('portfolio');
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // New Item Form State
  const [newItem, setNewItem] = useState({
    title: '',
    category: CATEGORIES[0],
    imageUrl: '',
    images: [] as string[],
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dz2k26pwy',
        uploadPreset: 'omuwxvbn',
        sources: ['local', 'url', 'camera', 'google_drive'],
        multiple: true,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#D31212",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#D31212",
            action: "#D31212",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#D31212",
            complete: "#20B832",
            sourceBg: "#E4EBF1"
          }
        },
        fonts: {
          default: null,
          "'Inter', sans-serif": {
            url: "https://fonts.googleapis.com/css?family=Inter",
            active: true
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const uploadedUrl = result.info.secure_url;

          setNewItem(prev => {
            // If it's the first image, make it the thumbnail too
            if (!prev.imageUrl) {
              return {
                ...prev,
                imageUrl: uploadedUrl,
                images: [...prev.images, uploadedUrl]
              };
            }
            return {
              ...prev,
              images: [...prev.images, uploadedUrl]
            };
          });
        }
      }
    );
    widget.open();
  };

  const fetchData = async () => {
    try {
      if (activeTab === 'portfolio') {
        const res = await axios.get('http://localhost:5000/api/portfolio', { withCredentials: true });
        setPortfolio(res.data);
      } else {
        const res = await axios.get('http://localhost:5000/api/inquiry', { withCredentials: true });
        setInquiries(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to add item:', newItem);
    
    if (!newItem.imageUrl) {
      alert("Please upload at least one image/video.");
      return;
    }

    try {
      console.log('Sending request to server...');
      const response = await axios.post('http://localhost:5000/api/portfolio', newItem, { withCredentials: true });
      console.log('Server response:', response.data);
      
      alert("Item published successfully!");
      setNewItem({ title: '', category: CATEGORIES[0], imageUrl: '', images: [], description: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to add item:', err);
      alert("Error: Could not publish item. Check server connection.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete item');
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-12 text-slate-900 selection:bg-edge-red/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
        >
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-edge-black mb-2">
              Admin <span className="text-edge-red text-shadow-sm">Portal</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Edge Productions / Creative Management</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-200 p-2 rounded-full px-6">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Workspace</span>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex space-x-2 mb-10 p-1.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl w-fit shadow-sm"
        >
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center gap-2 ${activeTab === 'portfolio' ? 'bg-edge-black text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:text-edge-black hover:bg-slate-50'}`}
          >
            <Database size={14} /> Portfolio Manager
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center gap-2 ${activeTab === 'inquiries' ? 'bg-edge-black text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:text-edge-black hover:bg-slate-50'}`}
          >
            <MessageSquare size={14} /> Inbox
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'portfolio' ? (
            <motion.div 
              key="portfolio"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              
              {/* Add New Form */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-32">
                  <h2 className="text-xl font-black uppercase tracking-widest mb-8 border-l-4 border-edge-red pl-4 text-edge-black">Create Item</h2>
                  <form onSubmit={handleAddItem} className="space-y-6">
                    <div className="group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2 group-focus-within:text-edge-red transition-colors">Project Name</label>
                      <input 
                        required 
                        type="text" 
                        value={newItem.title} 
                        onChange={e => setNewItem({...newItem, title: e.target.value})} 
                        className="w-full bg-slate-50 p-4 outline-none border border-slate-100 rounded-2xl focus:border-edge-red/30 focus:bg-white transition-all text-sm font-bold text-edge-black placeholder:text-slate-300" 
                        placeholder="Project Title..."
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2 group-focus-within:text-edge-red transition-colors">Service Category</label>
                      <select 
                        value={newItem.category} 
                        onChange={e => setNewItem({...newItem, category: e.target.value})} 
                        className="w-full bg-slate-50 p-4 outline-none border border-slate-100 rounded-2xl focus:border-edge-red/30 focus:bg-white transition-all text-sm font-bold text-edge-black appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center transition-all hover:border-edge-red/30 hover:bg-white group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-6 text-center">Visual Assets</label>
                      
                      <button 
                        type="button"
                        onClick={handleUpload}
                        className="group relative inline-flex items-center px-8 py-4 bg-edge-black text-white font-black uppercase tracking-widest text-[10px] rounded-2xl overflow-hidden active:scale-95 transition-transform shadow-lg shadow-black/10"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Plus size={16} /> Cloud Upload
                        </span>
                      </button>

                      {newItem.images.length > 0 && (
                        <div className="mt-8 grid grid-cols-3 gap-3">
                          {newItem.images.map((url, i) => (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              key={i} 
                              className="relative aspect-square rounded-xl overflow-hidden group/thumb border border-slate-100 shadow-sm"
                            >
                              <img src={url} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setNewItem({...newItem, images: newItem.images.filter((_, idx) => idx !== i), imageUrl: i === 0 ? newItem.images[1] || '' : newItem.imageUrl})}
                                className="absolute inset-0 bg-edge-red/90 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2 group-focus-within:text-edge-red transition-colors">Description</label>
                      <textarea 
                        value={newItem.description} 
                        onChange={e => setNewItem({...newItem, description: e.target.value})} 
                        className="w-full bg-slate-50 p-4 outline-none border border-slate-100 rounded-2xl focus:border-edge-red/30 focus:bg-white transition-all text-sm font-bold text-edge-black h-28 resize-none placeholder:text-slate-300" 
                        placeholder="Project details..."
                      />
                    </div>

                    <button type="submit" className="w-full bg-edge-red text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl mt-4 shadow-xl shadow-edge-red/20 hover:shadow-edge-red/40 hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3 active:scale-[0.98]">
                      <Plus size={20} /> Publish to Feed
                    </button>
                  </form>
                </div>
              </div>

              {/* Portfolio Grid/List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="font-black uppercase tracking-widest text-[11px] text-slate-900">Current Collection</h3>
                    <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black border border-slate-200">{portfolio.length} ITEMS</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                          <th className="p-8">Preview</th>
                          <th className="p-8">Project Information</th>
                          <th className="p-8">Classification</th>
                          <th className="p-8 text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {portfolio.length === 0 ? (
                          <tr><td colSpan={4} className="p-24 text-center text-slate-300 uppercase font-black tracking-widest text-sm">No items found in directory.</td></tr>
                        ) : (
                          portfolio.map((item, index) => (
                            <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              key={item._id} 
                              className="group hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="p-8">
                                <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-8">
                                <span className="font-black text-slate-900 text-sm tracking-tight group-hover:text-edge-red transition-colors block mb-1">{item.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {item._id.slice(-6)}</span>
                              </td>
                              <td className="p-8">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{item.category}</span>
                              </td>
                              <td className="p-8 text-right">
                                <button 
                                  onClick={() => handleDeleteItem(item._id)} 
                                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-edge-red hover:text-white hover:border-edge-red transition-all duration-300 shadow-sm"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="inquiries"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="font-black uppercase tracking-widest text-[11px] text-slate-900">Communication Logs</h3>
                <span className="bg-edge-red/10 text-edge-red px-4 py-1.5 rounded-full text-[10px] font-black border border-edge-red/20">{inquiries.length} LOGS</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                      <th className="p-8">Timestamp</th>
                      <th className="p-8">Personal Detail</th>
                      <th className="p-8">Communication</th>
                      <th className="p-8">Message Snippet</th>
                      <th className="p-8 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inquiries.length === 0 ? (
                      <tr><td colSpan={5} className="p-24 text-center text-slate-300 uppercase font-black tracking-widest text-sm">Inbox is currently empty.</td></tr>
                    ) : (
                      inquiries.map((inq, index) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={inq._id} 
                          className="group hover:bg-slate-50/50 transition-colors align-top"
                        >
                          <td className="p-8">
                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">
                              {new Date(inq.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="p-8">
                            <div className="font-black text-slate-900 text-sm mb-1">{inq.name}</div>
                            <div className="text-[9px] font-black uppercase text-edge-red tracking-widest">{inq.company}</div>
                          </td>
                          <td className="p-8">
                            <div className="text-[11px] font-bold text-slate-600 flex items-center gap-2 mb-1">
                              <Mail size={12} className="text-slate-300" /> {inq.email}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400">{inq.phone}</div>
                          </td>
                          <td className="p-8">
                            <p className="text-xs text-slate-500 line-clamp-2 max-w-sm leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                              {inq.message}
                            </p>
                          </td>
                          <td className="p-8 text-right text-xs">
                             <span className="inline-block px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-400 rounded-lg group-hover:border-edge-red/30 transition-colors">
                              {inq.status || 'Received'}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
