import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Statistics from "./pages/Statistics";

export default function App() {
  const [page, setPage] = useState("home");
  
  // Initialize user state from localStorage so the session persists on refresh
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? { token: savedToken } : null;
  });

  const handleLoginSuccess = (userData) => {
    // Ensure the token is saved to disk AND state immediately
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
    setPage("home"); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPage("home");
  };

  const navigateTo = (targetPage) => {
    if (!user && (targetPage === "inventory" || targetPage === "statistics")) {
      alert("Please login to access this page");
      return;
    }
    setPage(targetPage);
  };

  const renderPage = () => {
    // PASS THE USER OBJECT (containing the token) to protected pages
    if (page === "inventory") return <Inventory user={user} />;
    if (page === "statistics") return <Statistics user={user} />;
    return <Home user={user} onLoginSuccess={handleLoginSuccess} />;
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-gray-100">
      <Navbar
        currentPage={page}
        user={user} 
        changePage1={() => navigateTo("home")}
        changePage2={() => navigateTo("inventory")}
        changePage3={() => navigateTo("statistics")}
        onLogout={handleLogout}
      />
      <main className="flex-1 w-full overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}