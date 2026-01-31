import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie, Legend } from 'recharts';
import { Package, TrendingUp, Layers, AlertTriangle, Loader2 } from 'lucide-react';

export default function Statistics({ user, onLogout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  useEffect(() => {
    const fetchStats = async () => {
      const token = user?.token || localStorage.getItem('token');
      
      try {
        const response = await fetch('https://inventory-manager-backend-hglg.onrender.com/products/getall', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else if (response.status === 401) {
          onLogout();
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Process data for charts
  const categoryStats = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.ProductCategory);
    if (existing) {
      existing.value += curr.ProductQuantity;
    } else {
      acc.push({ name: curr.ProductCategory, value: curr.ProductQuantity });
    }
    return acc;
  }, []);

  const totalStock = data.reduce((sum, item) => sum + item.ProductQuantity, 0);
  const lowStockItems = data.filter(item => item.ProductQuantity < 5).length;

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
    </div>
  );

  return (
    <div className="p-8 h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time insights into your store's performance</p>
        </div>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Package />} title="Total Products" value={data.length} color="bg-blue-500" />
          <StatCard icon={<TrendingUp />} title="Total Stock Units" value={totalStock} color="bg-indigo-500" />
          <StatCard icon={<Layers />} title="Categories" value={categoryStats.length} color="bg-purple-500" />
          <StatCard icon={<AlertTriangle />} title="Low Stock Alerts" value={lowStockItems} color="bg-red-500" />
        </div>

        {/* --- CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Stock by Category */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-96"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-6 uppercase text-[12px] tracking-widest">Stock Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Table Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-6 uppercase text-[12px] tracking-widest">Category Breakdown</h3>
            <div className="overflow-y-auto h-80">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-tight">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{cat.value} Units</span>
                </div>
              ))}
              {categoryStats.length === 0 && <p className="text-center text-gray-400 mt-20">No data available.</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5"
    >
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-gray-200`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-extrabold text-gray-800">{value}</h2>
      </div>
    </motion.div>
  );
}