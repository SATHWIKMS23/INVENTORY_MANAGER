import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Package, Search, Loader2, Save, X, AlertCircle } from 'lucide-react';

export default function Inventory({ user, onLogout }) { // Accept user prop for token
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    ProductName: '', 
    ProductCategory: '', 
    ProductQuantity: '' 
  });

  const categories = [
    "Groceries", "Dairy & Bakery", "Beverages", 
    "Personal Care", "Household Items", "Electronics", 
    "Fashion & Apparel", "Home Decor", "Stationery", 
    "Toys & Games", "Health & Wellness", "Pet Supplies"
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    // Safety check for token
    const token = user?.token || localStorage.getItem('token');
    
    try {
      const response = await fetch('https://inventory-manager-backend-hglg.onrender.com/products/getall', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Mandatory Header
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data);
      } else if (response.status === 401) {
        onLogout(); // Redirect if token expired
      }
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id) => {
    const token = user?.token || localStorage.getItem('token');
    
    try {
      const response = await fetch(`https://inventory-manager-backend-hglg.onrender.com/products/edit/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Mandatory Header
        },
        body: JSON.stringify(editFormData),
      });

      const updatedProduct = await response.json();

      if (response.ok) {
        setProducts(products.map(p => p._id === id ? updatedProduct : p));
        setEditingId(null);
      } else {
        alert(updatedProduct.message || "Edit failed");
      }
    } catch (err) {
      alert("Network error during update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = user?.token || localStorage.getItem('token');
    
    try {
      const response = await fetch(`https://inventory-manager-backend-hglg.onrender.com/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Mandatory Header
        }
      });
      if (response.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ... rest of your startEdit, cancelEdit, and JSX remains the same ...
  const startEdit = (product) => {
    setEditingId(product._id);
    setEditFormData({
      ProductName: product.ProductName,
      ProductCategory: product.ProductCategory,
      ProductQuantity: product.ProductQuantity
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ ProductName: '', ProductCategory: '', ProductQuantity: '' });
  };

  const filteredProducts = products.filter(p => 
    p.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Store Inventory</h1>
            <p className="text-gray-500 text-xs sm:text-sm">Monitor and manage your retail stock</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-bold text-gray-400 tracking-wider sticky top-0">
              <tr>
                <th className="p-3 sm:p-5">Product Name</th>
                <th className="p-3 sm:p-5 hidden sm:table-cell">Category</th>
                <th className="p-3 sm:p-5">Stock</th>
                <th className="p-3 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-blue-50/10 transition-colors"
                  >
                    {editingId === product._id ? (
                      <>
                        <td className="p-3 sm:p-5">
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                            value={editFormData.ProductName}
                            onChange={(e) => setEditFormData({...editFormData, ProductName: e.target.value})}
                          />
                        </td>
                        <td className="p-3 sm:p-5 hidden sm:table-cell">
                          <select 
                            className="w-full p-2 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                            value={editFormData.ProductCategory}
                            onChange={(e) => setEditFormData({...editFormData, ProductCategory: e.target.value})}
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 sm:p-5">
                          <input 
                            type="number" 
                            className="w-20 p-2 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                            value={editFormData.ProductQuantity}
                            onChange={(e) => setEditFormData({...editFormData, ProductQuantity: e.target.value})}
                          />
                        </td>
                        <td className="p-3 sm:p-5 text-right space-x-1">
                          <button onClick={() => handleSaveEdit(product._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Save size={16} />
                          </button>
                          <button onClick={cancelEdit} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 sm:p-5">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                              <Package size={18} />
                            </div>
                            <span className="font-semibold text-gray-700 uppercase tracking-tight text-xs sm:text-sm break-words">{product.ProductName}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-5 hidden sm:table-cell">
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                            {product.ProductCategory}
                          </span>
                        </td>
                        <td className="p-3 sm:p-5">
                          <div className="flex items-center gap-2">
                            <span className={`text-base sm:text-lg font-bold ${product.ProductQuantity < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                              {product.ProductQuantity}
                            </span>
                            {product.ProductQuantity < 5 && (
                              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase">Low</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 sm:p-5 text-right space-x-1">
                          <button onClick={() => startEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all inline-block">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all inline-block">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-12 sm:p-20 text-center flex flex-col items-center">
              <AlertCircle className="text-gray-200 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
              <p className="text-gray-400 font-medium text-sm sm:text-base">No items found in your inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}