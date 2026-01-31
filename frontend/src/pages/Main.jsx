import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2 } from 'lucide-react';

const Main = ({ user }) => { 
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

    // 1. Get token from props or localStorage
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
          // 2. Ensure exactly one space between Bearer and the token
          'Authorization': `Bearer ${token}` 
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
            throw new Error("Session expired. Please log out and back in.");
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><PlusCircle size={24} /></div>
          <h1 className="text-2xl font-bold text-gray-800">New Material Entry</h1>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Product Name</label>
            <input type="text" name="ProductName" required value={formData.ProductName} onChange={handleChange} placeholder="Enter product name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Category</label>
            <select name="ProductCategory" required value={formData.ProductCategory} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm">
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Quantity</label>
            <input type="number" name="ProductQuantity" required min="1" value={formData.ProductQuantity} onChange={handleChange} placeholder="e.g. 10" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-sm" />
          </div>
          <button disabled={loading} className="md:col-span-2 mt-4 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:bg-blue-300">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Confirm and Add"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Main;