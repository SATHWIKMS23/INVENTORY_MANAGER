import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Statistics from "./pages/Statistics";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null); // Auth State

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("home"); 
  };

  const navigateTo = (targetPage) => {
    // PROTECTED ROUTE LOGIC
    if (!user && (targetPage === "inventory" || targetPage === "statistics")) {
      alert("Please login to access this page");
      return;
    }
    setPage(targetPage);
  };

  const renderPage = () => {
    if (page === "inventory") return <Inventory />;
    if (page === "statistics") return <Statistics />;
    // IMPORTANT: Pass user and handleLoginSuccess to Home
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
        onLogout={() => { setUser(null); setPage("home"); }}
      />
      
      <main className="flex-1 w-full overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}