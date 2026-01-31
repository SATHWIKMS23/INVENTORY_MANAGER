import { motion } from 'framer-motion';
import { Box, Home, Package, BarChart2, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ changePage1, changePage2, changePage3, currentPage, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    /* Removed border-b border-gray-200 */
    <nav className="w-full bg-gray-200 backdrop-blur-md px-4 sm:px-6 py-3 flex justify-between items-center z-50">
      
      {/* Left side: Logo & Branding */}
      <div 
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
        onClick={changePage1}
      >
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
          <Box className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent hidden sm:inline">
          INVENTORY TRACKER
        </h1>
      </div>

      {/* Right side: Navigation Links */}
      <ul className="hidden md:flex items-center gap-2">
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

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 hover:bg-gray-300 rounded-lg transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 right-0 left-0 bg-white border-b border-gray-200 md:hidden p-4 space-y-3">
          <button
            onClick={() => { changePage1(); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-lg ${currentPage === "home" ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          >
            Home
          </button>
          <button
            onClick={() => { changePage2(); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-lg ${currentPage === "inventory" ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          >
            Inventory
          </button>
          <button
            onClick={() => { changePage3(); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-lg ${currentPage === "statistics" ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
          >
            Statistics
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>
      )}
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