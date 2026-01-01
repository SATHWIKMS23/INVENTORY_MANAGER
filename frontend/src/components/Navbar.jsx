import { motion } from 'framer-motion';
import { Box, Home, Package, BarChart2, LogOut } from 'lucide-react';

export default function Navbar({ changePage1, changePage2, changePage3, currentPage, user, onLogout }) {
  return (
    /* Removed border-b border-gray-200 */
    <nav className="w-full bg-gray-200 backdrop-blur-md px-6 py-3 flex justify-between items-center z-50">
      
      {/* Left side: Logo & Branding */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={changePage1}
      >
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
          <Box className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          INVENTORY TRACKER
        </h1>
      </div>

      {/* Right side: Navigation Links */}
      <ul className="flex items-center gap-2">
        <NavItem 
          icon={<Home className="w-4 h-4" />} 
          label="Home" 
          onClick={changePage1} 
          isActive={currentPage === "home"} 
        />
        <NavItem 
          icon={<Package className="w-4 h-4" />} 
          label="Inventory" 
          onClick={changePage2} 
          isActive={currentPage === "inventory"} 
        />
        <NavItem 
          icon={<BarChart2 className="w-4 h-4" />} 
          label="Statistics" 
          onClick={changePage3} 
          isActive={currentPage === "statistics"} 
        />

        {/* Conditional Logout Button */}
        {user && (
          <li className="ml-2 pl-2 border-l border-gray-200">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

function NavItem({ icon, label, onClick, isActive }) {
  return (
    <li className="relative">
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
          isActive 
            ? "bg-blue-50 text-blue-600 shadow-sm" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        {icon}
        {label}
        {isActive && (
          <motion.div 
            layoutId="activeTab" 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
          />
        )}
      </button>
    </li>
  );
}