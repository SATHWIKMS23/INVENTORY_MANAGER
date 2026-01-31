import { useState, useEffect } from "react";
// ... other imports

export default function App() {
  const [page, setPage] = useState("home");
  
  // Initialize user state from localStorage so it persists on refresh
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? { token: savedToken } : null;
  });

  const handleLoginSuccess = (userData) => {
    // 1. Save to disk
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    // 2. Update state IMMEDIATELY so props refresh
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
    // IMPORTANT: Pass the 'user' object to Inventory
    if (page === "inventory") return <Inventory user={user} onLogout={handleLogout} />;
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