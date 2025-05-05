import React, { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import { Moon, Sun } from "lucide-react";
import AppRouter from "./router/AppRouter";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <Sidebar />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-4 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
       

        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;
