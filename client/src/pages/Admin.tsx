import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Mail, Phone, Database, MessageSquare, Eye, Calendar, CheckCircle2, GripVertical, Star, Edit2, Search, CheckSquare, Square, XCircle, User, Building2, Clock } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

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

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  images: string[];
  description: string;
  eventDate: string;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: 'New' | 'Read';
  createdAt: string;
}

const AdminDashboard = () => {
  useAuth(); // Keeping the hook call to ensure protection/context is active if needed
  // Track 3.2: Inquiry Management Enhancements
  // - Status Toggle: Add a clickable badge to inquiries that toggles status (New -> Contacted -> Done).
  // - Inquiry Delete: Add a trash icon to each inquiry row to permanently remove logs.
  // - Confirmation Flow: Implement a simple "Are you sure?" check for deletions.
  // - Badge Colors: `New` (Red Pulse), `Contacted` (Blue), `Done` (Gray).
  // - Controller Logic: Implement `updateInquiryStatus` and `deleteInquiry` endpoints.
  const [activeTab, setActiveTab] = useState<'portfolio' | 'inquiries'>('portfolio');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  // New Item Form State
  const [newItem, setNewItem] = useState({
    title: '',
    category: CATEGORIES[0],
    imageUrl: '',
    images: [] as string[],
    description: '',
    eventDate: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: true
  });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

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
      toast.error("Please upload at least one image/video.");
      return;
    }

    try {
      console.log('Sending request to server...');
      
      if (isEditing && editingId) {
        await axios.put(`http://localhost:5000/api/portfolio/${editingId}`, newItem, { withCredentials: true });
        toast.success("Item updated successfully!");
      } else {
        await axios.post('http://localhost:5000/api/portfolio', newItem, { withCredentials: true });
        toast.success("Item published successfully!");
      }

      setNewItem({ title: '', category: CATEGORIES[0], imageUrl: '', images: [], description: '', eventDate: '' });
      setIsEditing(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error('Failed to process item:', err);
      toast.error(`Error: Could not ${isEditing ? 'update' : 'publish'} item.`);
    }
  };

  const handleDeleteItem = async (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Project?",
      message: "Are you sure you want to permanently remove this project from the portfolio?",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/portfolio/${id}`, { withCredentials: true });
          toast.success("Project removed successfully");
          fetchData();
        } catch (err) {
          toast.error("Failed to delete project");
          console.error('Failed to delete item');
        }
        closeConfirm();
      }
    });
  };

  const handleUpdateInquiryStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'New' ? 'Read' : 'New';
    try {
      await axios.put(`http://localhost:5000/api/inquiry/${id}/status`, { status: newStatus }, { withCredentials: true });
      // Optimized state update instead of refetch
      setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      console.error('Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Inquiry?",
      message: "Are you sure you want to permanently delete this inquiry? This action cannot be undone.",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/inquiry/${id}`, { withCredentials: true });
          setInquiries(prev => prev.filter(inq => inq._id !== id));
          toast.success("Inquiry deleted");
        } catch (err) {
          toast.error("Failed to delete inquiry");
          console.error('Failed to delete inquiry');
        }
        closeConfirm();
      }
    });
  };

  const handleBulkStatusUpdate = async (status: 'New' | 'Read') => {
    try {
      await axios.patch('http://localhost:5000/api/inquiry/bulk-status', { 
        ids: selectedInquiries, 
        status 
      }, { withCredentials: true });
      
      setInquiries(prev => prev.map(inq => 
        selectedInquiries.includes(inq._id) ? { ...inq, status } : inq
      ));
      setSelectedInquiries([]);
    } catch (err) {
      console.error('Failed to bulk update inquiries');
    }
  };

  const handleBulkDelete = async () => {
    setConfirmConfig({
      isOpen: true,
      title: `Delete ${selectedInquiries.length} Inquiries?`,
      message: "This action will permanently remove all selected items. This cannot be undone.",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await axios.delete('http://localhost:5000/api/inquiry/bulk-delete', { 
            data: { ids: selectedInquiries }, 
            withCredentials: true 
          });
          
          setInquiries(prev => prev.filter(inq => !selectedInquiries.includes(inq._id)));
          setSelectedInquiries([]);
          toast.success("Selected inquiries deleted");
        } catch (err) {
          toast.error("Failed to delete inquiries");
          console.error('Failed to bulk delete inquiries');
        }
        closeConfirm();
      }
    });
  };

  const toggleSelectAll = () => {
    const filteredIds = inquiries
      .filter(inq => 
        inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(inq => inq._id);

    if (selectedInquiries.length === filteredIds.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(filteredIds);
    }
  };

  const toggleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleEditItem = (item: PortfolioItem) => {
    setIsEditing(true);
    setEditingId(item._id);
    setNewItem({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      images: item.images || [item.imageUrl],
      description: item.description || '',
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setNewItem({ title: '', category: CATEGORIES[0], imageUrl: '', images: [], description: '', eventDate: '' });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-12 text-slate-900 selection:bg-edge-red/10">
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
        isDestructive={confirmConfig.isDestructive}
      />
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
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-edge-red pl-4 text-edge-black mb-1">
                        {isEditing ? 'Update Item' : 'Create Item'}
                      </h2>
                      {isEditing && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-4">Editing ID: {editingId?.slice(-6)}</p>
                      )}
                    </div>
                    {isEditing && (
                      <button 
                        onClick={cancelEdit}
                        className="text-[10px] font-black uppercase tracking-widest text-edge-red hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleAddItem} className="space-y-6">
                    <div className="group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2 group-focus-within:text-edge-red transition-colors">Project Name</label>
                      <input
                        required
                        type="text"
                        value={newItem.title}
                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
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

                    <div className="group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2 group-focus-within:text-edge-red transition-colors">Event Date (Optional)</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={newItem.eventDate} 
                          onChange={e => setNewItem({...newItem, eventDate: e.target.value})} 
                          className="w-full bg-slate-50 p-4 pl-12 outline-none border border-slate-100 rounded-2xl focus:border-edge-red/30 focus:bg-white transition-all text-sm font-bold text-edge-black appearance-none cursor-pointer"
                        />
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      </div>
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
                        <div className="mt-8 space-y-4">
                          <div className="flex items-center justify-between px-2">
                             <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Manage Stack</label>
                             <span className="text-[9px] font-bold text-slate-300 uppercase">{newItem.images.length} Assets</span>
                          </div>
                          
                            <div className="relative group/stack">
                              {/* Outer Wrapper for Border/BG Tracking */}
                              <div className="rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shadow-inner">
                                <div className="max-h-[280px] overflow-y-auto overflow-x-hidden pt-3 px-3 pb-6 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 transition-all">
                                  <Reorder.Group 
                                    axis="y" 
                                    values={newItem.images} 
                                    onReorder={(newOrder) => setNewItem({...newItem, images: newOrder})}
                                    className="space-y-3"
                                  >
                                    {newItem.images.map((url, idx) => (
                                      <Reorder.Item 
                                        key={url} 
                                        value={url}
                                        whileDrag={{ 
                                          scale: 1.02, 
                                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                          zIndex: 50
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
                                        className="relative bg-white border border-slate-200 rounded-xl p-3 flex items-center group/item shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing touch-none"
                                      >
                                        <div className="text-slate-300 group-hover/item:text-edge-red transition-colors flex-shrink-0">
                                          <GripVertical size={20} />
                                        </div>

                                        <span className="text-[12px] font-black text-slate-500 w-5 text-center shrink-0">
                                          {idx + 1}
                                        </span>

                                        <div className="w-16 h-11 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 ml-2">
                                          <img src={url} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-grow flex items-center justify-end ml-4">
                                          {newItem.imageUrl === url && (
                                            <div className="bg-green-500/10 text-green-600 p-1 rounded-full border border-green-500/20" title="Thumbnail">
                                              <Star size={10} fill="currentColor" />
                                            </div>
                                          )}
                                        </div>

                                        {/* Centralized Hover Actions */}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 rounded-xl z-10">
                                          <button 
                                            type="button"
                                            onClick={() => setPreviewImage(url)}
                                            className="w-10 h-10 rounded-xl bg-white text-slate-600 hover:bg-edge-black hover:text-white flex items-center justify-center transition-all shadow-xl active:scale-90"
                                            title="Preview Image"
                                          >
                                            <Eye size={18} />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => setNewItem({...newItem, imageUrl: url})}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xl active:scale-90 ${newItem.imageUrl === url ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-white text-slate-600 hover:bg-green-500 hover:text-white'}`}
                                            title="Set as Thumbnail"
                                          >
                                            <CheckCircle2 size={18} />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => {
                                              const newImages = newItem.images.filter(img => img !== url);
                                              setNewItem({
                                                ...newItem, 
                                                images: newImages, 
                                                imageUrl: newItem.imageUrl === url ? (newImages[0] || '') : newItem.imageUrl
                                              });
                                            }}
                                            className="w-10 h-10 rounded-xl bg-white text-slate-600 hover:bg-edge-red hover:text-white flex items-center justify-center transition-all shadow-xl active:scale-90"
                                            title="Remove Asset"
                                          >
                                            <Trash2 size={18} />
                                          </button>
                                        </div>
                                      </Reorder.Item>
                                    ))}
                                  </Reorder.Group>
                                </div>
                              </div>
                              
                              {/* Bottom Fade Hint (Synced with Outer Wrapper) */}
                              {newItem.images.length > 3 && (
                                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none z-20 rounded-b-xl" />
                              )}
                            </div>
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2 group-focus-within:text-edge-red transition-colors">Description</label>
                      <textarea
                        value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full bg-slate-50 p-4 outline-none border border-slate-100 rounded-2xl focus:border-edge-red/30 focus:bg-white transition-all text-sm font-bold text-edge-black h-28 resize-none placeholder:text-slate-300"
                        placeholder="Project details..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      className={`w-full ${isEditing ? 'bg-green-600 shadow-green-600/20 hover:shadow-green-600/40' : 'bg-edge-red shadow-edge-red/20 hover:shadow-edge-red/40'} text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl mt-4 shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3 active:scale-[0.98]`}
                    >
                      {isEditing ? <CheckCircle2 size={20} /> : <Plus size={20} />} 
                      {isEditing ? 'Save Changes' : 'Publish'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Portfolio Grid/List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                  <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-[11px] text-slate-900 mb-0.5">
                        {isEditing ? 'Update Existing Project' : 'Current Collection'}
                      </h3>
                      {isEditing && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Editing ID: {editingId?.slice(-6)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black border border-slate-200">{portfolio.length} ITEMS</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                          <th className="px-8 py-5 text-left">Preview</th>
                          <th className="px-4 py-5 text-left">Project Information</th>
                          <th className="px-4 py-5 text-left">Classification</th>
                          <th className="px-8 py-5 text-center">Settings</th>
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
                              <td className="px-8 py-6">
                                <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="px-4 py-6">
                                <span className="font-black text-slate-900 text-sm tracking-tight group-hover:text-edge-red transition-colors block mb-1">{item.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {item._id.slice(-6)}</span>
                              </td>
                              <td className="px-4 py-6">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{item.category}</span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-edge-black hover:text-white hover:border-edge-black transition-all duration-300 shadow-sm"
                                    title="Edit Item"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item._id)}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-edge-red hover:text-white hover:border-edge-red transition-all duration-300 shadow-sm"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
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
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative group/search">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-edge-red transition-colors" />
                    <input 
                      type="text"
                      placeholder="Search inquiries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-100 rounded-full pl-10 pr-6 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-edge-red/20 focus:bg-white transition-all w-full md:w-64"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-edge-red/10 text-edge-red px-4 py-1.5 rounded-full text-[10px] font-black border border-edge-red/20 uppercase tracking-widest">{inquiries.length} Logs</span>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {selectedInquiries.length > 0 && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="px-8 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-edge-red px-3 py-1 rounded">
                        {selectedInquiries.length} Selected
                      </span>
                      <button 
                        onClick={() => setSelectedInquiries([])}
                        className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <XCircle size={14} /> Clear
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const selectedInqs = inquiries.filter(inq => selectedInquiries.includes(inq._id));
                        const allRead = selectedInqs.length > 0 && selectedInqs.every(inq => inq.status === 'Read');
                        return (
                          <button 
                            onClick={() => handleBulkStatusUpdate(allRead ? 'New' : 'Read')}
                            className="bg-white/10 hover:bg-white text-white hover:text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/20"
                          >
                            {allRead ? 'Mark as Unread' : 'Mark as Read'}
                          </button>
                        );
                      })()}
                      <button 
                        onClick={handleBulkDelete}
                        className="bg-edge-red border border-edge-red/20 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-edge-red-dark transition-all"
                      >
                        {selectedInquiries.length === inquiries.filter(inq => 
                          inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length ? 'Delete All' : 'Delete Selected'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                      <th className="p-8 w-12">
                        <button 
                          onClick={toggleSelectAll}
                          className="p-1 group-hover:bg-slate-200 rounded transition-colors"
                        >
                          {(() => {
                            const filteredInqs = inquiries.filter(inq => 
                              inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                            const allSelected = filteredInqs.length > 0 && filteredInqs.every(inq => selectedInquiries.includes(inq._id));
                            if (allSelected) return <CheckSquare size={16} className="text-edge-red" />;
                            if (selectedInquiries.length > 0) return <div className="w-4 h-4 border-2 border-edge-red bg-edge-red/20 rounded flex items-center justify-center"><div className="w-2 h-0.5 bg-edge-red rounded" /></div>;
                            return <Square size={16} className="text-slate-300" />;
                          })()}
                        </button>
                      </th>
                      <th className="p-8">Timestamp</th>
                      <th className="p-8">Personal Detail</th>
                      <th className="p-8">Communication</th>
                      <th className="p-8">Message Snippet</th>
                      <th className="p-8 text-center">Status</th>
                      <th className="p-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {inquiries.filter(inq => 
                       inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
                       inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
                     ).length === 0 ? (
                       <tr>
                         <td colSpan={7} className="p-32 text-center">
                           <div className="flex flex-col items-center gap-4">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100">
                               <MessageSquare size={32} />
                             </div>
                             <p className="text-slate-300 uppercase font-black tracking-[0.3em] text-xs">
                               {searchQuery ? `No matches found for "${searchQuery}"` : 'Inbox is currently empty'}
                             </p>
                           </div>
                         </td>
                       </tr>
                     ) : (
                       inquiries
                         .filter(inq => 
                           inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           inq.message?.toLowerCase().includes(searchQuery.toLowerCase())
                         )
                         .map((inq, index) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={inq._id}
                           className={`group hover:bg-slate-50/50 transition-colors align-top ${selectedInquiries.includes(inq._id) ? 'bg-slate-50' : ''}`}
                         >
                           <td className="p-8">
                             <button 
                               onClick={() => toggleSelectInquiry(inq._id)}
                               className="p-1"
                             >
                               {selectedInquiries.includes(inq._id) ? (
                                 <CheckSquare size={16} className="text-edge-red" />
                               ) : (
                                 <Square size={16} className="text-slate-300 group-hover:text-slate-400" />
                               )}
                             </button>
                           </td>
                           <td className="p-8 text-slate-400">
                             <span className="text-[10px] font-black block uppercase tracking-widest whitespace-nowrap">
                               {new Date(inq.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                             </span>
                           </td>
                          <td className="p-8">
                            <div className="font-black text-slate-900 text-sm mb-1">{inq.name}</div>
                            <div className="text-[9px] font-black uppercase text-edge-red tracking-widest">{inq.company}</div>
                          </td>
                           <td className="p-8 group-hover:cursor-pointer" onClick={() => setViewingInquiry(inq)}>
                             <div className="text-[10px] font-bold text-slate-600 flex items-center gap-3 mb-2">
                               <div className="w-6 h-6 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-edge-red/5 group-hover:text-edge-red transition-all">
                                 <Mail size={10} />
                               </div>
                               {inq.email}
                             </div>
                             <div className="text-[10px] font-bold text-slate-600 flex items-center gap-3">
                               <div className="w-6 h-6 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-edge-red/5 group-hover:text-edge-red transition-all">
                                 <Phone size={10} />
                               </div>
                               {inq.phone}
                             </div>
                           </td>
                           <td className="p-8 group-hover:cursor-pointer" onClick={() => setViewingInquiry(inq)}>
                              <p className="text-xs text-slate-500 line-clamp-2 max-w-sm leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                                {inq.message}
                              </p>
                            </td>
                           <td className="p-8 text-center">
                             <button 
                               onClick={() => handleUpdateInquiryStatus(inq._id, inq.status)}
                               className={`
                                 inline-flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border
                                 ${inq.status === 'New' 
                                   ? 'bg-edge-red/5 border-edge-red/20 text-edge-red animate-pulse' 
                                   : 'bg-slate-100 border-slate-200 text-slate-400 group-hover:bg-white'}
                               `}
                             >
                               <span className={`w-1.5 h-1.5 rounded-full ${inq.status === 'New' ? 'bg-edge-red' : 'bg-slate-400'}`} />
                               {inq.status || 'New'}
                             </button>
                           </td>
                           <td className="p-8 text-right">
                             <button 
                               onClick={() => handleDeleteInquiry(inq._id)}
                               className="p-2 text-slate-400 hover:text-edge-red hover:bg-edge-red/5 rounded-lg transition-all"
                               title="Delete Inquiry"
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
            </motion.div>
          )}
        </AnimatePresence>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {viewingInquiry && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-edge-black/80 flex items-center justify-center p-6 backdrop-blur-xl"
            onClick={() => setViewingInquiry(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white max-w-2xl w-full rounded-[3rem] overflow-hidden shadow-2xl relative border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-12 pb-10 bg-gradient-to-br from-white to-slate-50/50">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-edge-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-black/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                      <User size={40} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-edge-black tracking-tighter uppercase leading-none">{viewingInquiry.name}</h2>
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <Building2 size={12} className="text-edge-red" /> {viewingInquiry.company || 'Private Client'}
                        </span>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} /> {new Date(viewingInquiry.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingInquiry(null)}
                    className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-edge-red hover:border-edge-red/30 transition-all hover:rotate-90 shadow-sm"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <a href={`mailto:${viewingInquiry.email}`} className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:border-edge-red/30 transition-all group shadow-sm hover:shadow-md">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Mail size={12} className="text-edge-red" /> Email
                    </div>
                    <div className="text-sm font-black text-edge-black group-hover:text-edge-red transition-colors">{viewingInquiry.email}</div>
                  </a>
                  <a href={`tel:${viewingInquiry.phone}`} className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:border-edge-red/30 transition-all group shadow-sm hover:shadow-md">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Phone size={12} className="text-edge-red" /> Phone
                    </div>
                    <div className="text-sm font-black text-edge-black group-hover:text-edge-red transition-colors">{viewingInquiry.phone}</div>
                  </a>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-12 pb-12 pt-4">
                <div className="relative">
                  <div className="text-[10px] font-black text-edge-red uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-edge-red/20" />
                    Message Content
                  </div>
                  <div className="text-slate-600 leading-[1.8] font-medium bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 whitespace-pre-wrap text-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-edge-red/20" />
                    <MessageSquare size={120} className="absolute -bottom-10 -right-10 text-slate-100 -z-0 opacity-50" />
                    <span className="relative z-10">{viewingInquiry.message}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Status: {viewingInquiry.status}
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (!viewingInquiry) return;
                      handleUpdateInquiryStatus(viewingInquiry._id, viewingInquiry.status);
                      setViewingInquiry(prev => prev ? ({ ...prev, status: prev.status === 'New' ? 'Read' : 'New' }) : null);
                    }}
                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-lg ${viewingInquiry.status === 'New' ? 'bg-edge-black text-white border-edge-black shadow-black/10' : 'bg-white text-slate-400 border-slate-200 hover:border-edge-red hover:text-edge-red'}`}
                  >
                    {viewingInquiry.status === 'New' ? 'Mark as Read' : 'Mark as Unread'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Preview Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={previewImage} className="w-full h-full object-contain" />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-edge-red transition-all shadow-xl active:scale-90"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
