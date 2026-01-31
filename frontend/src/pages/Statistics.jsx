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
    <div className="p-4 sm:p-8 h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Real-time insights into your store's performance</p>
        </div>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard icon={<Package />} title="Total Products" value={data.length} color="bg-blue-500" />
          <StatCard icon={<TrendingUp />} title="Total Stock Units" value={totalStock} color="bg-indigo-500" />
          <StatCard icon={<Layers />} title="Categories" value={categoryStats.length} color="bg-purple-500" />
          <StatCard icon={<AlertTriangle />} title="Low Stock Alerts" value={lowStockItems} color="bg-red-500" />
        </div>

        {/* --- CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Bar Chart: Stock by Category */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 h-64 sm:h-96"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4 sm:mb-6 uppercase text-[10px] sm:text-[12px] tracking-widest">Stock Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={categoryStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}} 
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
            className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-64 sm:h-96"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4 sm:mb-6 uppercase text-[10px] sm:text-[12px] tracking-widest">Category Breakdown</h3>
            <div className="overflow-y-auto h-48 sm:h-80">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-tight break-words">{cat.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 flex-shrink-0">{cat.value}</span>
                </div>
              ))}
              {categoryStats.length === 0 && <p className="text-center text-gray-400 mt-12 sm:mt-20 text-xs sm:text-sm">No data available.</p>}
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
      className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
    >
      <div className={`${color} p-3 sm:p-4 rounded-2xl text-white shadow-lg shadow-gray-200 flex-shrink-0`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="text-center sm:text-left">
        <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-xl sm:text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-extrabold text-gray-800">{value}</h2>
      </div>
    </motion.div>
  );
}