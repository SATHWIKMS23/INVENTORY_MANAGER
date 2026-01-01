import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ShieldCheck, BarChart3 } from 'lucide-react';
import Login from './login';
import Signup from './signup';
import Main from './Main';

export default function Home({ user, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("login");

  // IF LOGGED IN: Show the blank dashboard area
  if (user) {
    return (
      <Main />
    );
  }

  // IF NOT LOGGED IN: Show Landing Page
  return (
    <div className="w-full h-full p-4 box-border">
      <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-gray-100">
        
        {/* LEFT SIDE: Branding */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 flex-col justify-between text-white ">
          <div>
            <div className="flex items-center gap-3 mb-10 ">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Box className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">INVENTORY TRACKER</span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-extrabold leading-tight mb-6"
            >
              Master Your <br /> 
              <span className="text-blue-300">Inventory</span> Pipeline.
            </motion.h1>
            
            <div className="space-y-6">
              <FeatureItem icon={<BarChart3 />} title="Real-time Analytics" desc="Track every movement with live data." />
              <ShieldCheck className="text-blue-300 w-6 h-6 inline mr-4" /> 
              <span className="font-semibold text-lg">Secure Access</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Auth Forms */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50/50">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {/* PASS onLoginSuccess HERE */}
                  <Login setpage={setAuthMode} onLoginSuccess={onLoginSuccess} />
                </motion.div>
              ) : (
                <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Signup setpage={setAuthMode} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="text-blue-300">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-blue-100/70 text-sm">{desc}</p>
      </div>
    </div>
  );
}