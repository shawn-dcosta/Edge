import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Mail } from 'lucide-react';

const CATEGORIES = [
  'Award Functions', 'Exhibitions', 'Corporate Events', 
  'Conferences', 'Retail Merchandising', 'Weddings', 
  'Televised Events', 'Mall Activity'
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'inquiries'>('portfolio');
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  
  // New Item Form State
  const [newItem, setNewItem] = useState({ title: '', category: CATEGORIES[0], imageUrl: '', description: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'portfolio') {
        const res = await axios.get('http://localhost:5000/api/portfolio');
        setPortfolio(res.data);
      } else {
        const res = await axios.get('http://localhost:5000/api/inquiry');
        setInquiries(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/portfolio', newItem);
      setNewItem({ title: '', category: CATEGORIES[0], imageUrl: '', description: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to add item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete item');
    }
  };

  return (
    <div className="w-full bg-edge-gray min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black mb-8 uppercase tracking-widest text-edge-black">
          Admin <span className="text-edge-red">Portal</span>
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-3 font-bold uppercase tracking-widest text-sm transition-colors ${activeTab === 'portfolio' ? 'bg-edge-black text-white' : 'bg-white text-edge-black hover:bg-gray-100'}`}
          >
            Manage Portfolio
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3 font-bold uppercase tracking-widest text-sm transition-colors flex items-center ${activeTab === 'inquiries' ? 'bg-edge-black text-white' : 'bg-white text-edge-black hover:bg-gray-100'}`}
          >
            <Mail size={16} className="mr-2" /> Inquiries
          </button>
        </div>

        {/* Portfolio Content */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Add New Form */}
            <div className="bg-white p-6 shadow-sm border border-gray-100 h-fit">
               <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-edge-red pb-2 inline-block">Add New Item</h2>
               <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">Title</label>
                    <input required type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-edge-gray p-3 outline-none focus:border-edge-red border-b-2 border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">Category</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-edge-gray p-3 outline-none focus:border-edge-red border-b-2 border-transparent">
                       {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">Image URL</label>
                    <input required type="text" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="w-full bg-edge-gray p-3 outline-none focus:border-edge-red border-b-2 border-transparent" />
                  </div>
                  <button type="submit" className="w-full bg-edge-red text-white font-bold uppercase py-3 mt-4 hover:bg-edge-black transition-colors flex justify-center items-center">
                    <Plus size={18} className="mr-2" /> Add to Portfolio
                  </button>
               </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
               <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-edge-black text-white text-xs uppercase tracking-widest">
                       <th className="p-4">Image</th>
                       <th className="p-4">Title</th>
                       <th className="p-4">Category</th>
                       <th className="p-4 text-center">Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     {portfolio.length === 0 ? (
                       <tr><td colSpan={4} className="p-8 text-center text-gray-400">No items found.</td></tr>
                     ) : (
                       portfolio.map(item => (
                         <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                           <td className="p-4"><img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover bg-gray-200" /></td>
                           <td className="p-4 font-bold">{item.title}</td>
                           <td className="p-4 text-sm text-gray-500">{item.category}</td>
                           <td className="p-4 text-center">
                             <button onClick={() => handleDeleteItem(item._id)} className="text-gray-400 hover:text-edge-red transition-colors p-2">
                               <Trash2 size={20} />
                             </button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* Inquiries Content */}
        {activeTab === 'inquiries' && (
          <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-edge-black text-white text-xs uppercase tracking-widest">
                   <th className="p-4">Date</th>
                   <th className="p-4">Name</th>
                   <th className="p-4">Contact</th>
                   <th className="p-4">Message</th>
                   <th className="p-4">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {inquiries.length === 0 ? (
                   <tr><td colSpan={5} className="p-8 text-center text-gray-400">No inquiries yet.</td></tr>
                 ) : (
                   inquiries.map(inq => (
                     <tr key={inq._id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                       <td className="p-4 text-sm whitespace-nowrap text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                       <td className="p-4 font-bold">{inq.name} <br/><span className="text-xs font-normal text-gray-400">{inq.company}</span></td>
                       <td className="p-4 text-sm">{inq.email} <br/>{inq.phone}</td>
                       <td className="p-4 text-sm max-w-md">{inq.message}</td>
                       <td className="p-4">
                         <span className="px-2 py-1 text-xs font-bold uppercase tracking-widest bg-edge-gray text-edge-black rounded">{inq.status}</span>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
