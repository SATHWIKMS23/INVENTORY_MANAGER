import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2 } from 'lucide-react';

const Main = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    ProductName: '',
    ProductCategory: '',
    ProductQuantity: '', 
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const categories = [
    "Groceries", "Dairy & Bakery", "Beverages", 
    "Personal Care", "Household Items", "Electronics", 
    "Fashion & Apparel", "Home Decor", "Stationery", 
    "Toys & Games", "Health & Wellness", "Pet Supplies"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Try prop first, then storage
    const token = user?.token || localStorage.getItem('token');

    if (!token) {
      setStatus({ type: 'error', message: 'No session found. Please log in again.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://inventory-manager-backend-hglg.onrender.com/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Mandatory
        },
        body: JSON.stringify({
          ProductName: formData.ProductName,
          ProductCategory: formData.ProductCategory,
          ProductQuantity: Number(formData.ProductQuantity) 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          return;
        }
        throw new Error(data.message || 'Failed to add product');
      }

      setStatus({ type: 'success', message: 'Product added successfully!' });
      setFormData({ ProductName: '', ProductCategory: '', ProductQuantity: '' }); 
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-blue-600 rounded-2xl text-white shadow-lg flex-shrink-0"><PlusCircle size={20} className="sm:size-6" /></div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">New Material Entry</h1>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-600 ml-1">Product Name</label>
            <input type="text" name="ProductName" required value={formData.ProductName} onChange={handleChange} placeholder="Enter product name" className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-600 ml-1">Category</label>
            <select name="ProductCategory" required value={formData.ProductCategory} onChange={handleChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm">
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-600 ml-1">Quantity</label>
            <input type="number" name="ProductQuantity" required min="1" value={formData.ProductQuantity} onChange={handleChange} placeholder="e.g. 10" className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm" />
          </div>
          <button disabled={loading} className="md:col-span-2 mt-2 sm:mt-4 w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-blue-300 text-sm sm:text-base">
            {loading ? <Loader2 className="animate-spin mx-auto size-5" /> : "Confirm and Add"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Main;