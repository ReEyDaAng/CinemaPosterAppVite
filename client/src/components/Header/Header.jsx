import React from "react";
import { Search, Moon, Sun, User } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="pt-[47px] pr-[47px] absolute top-0 left-[306px] right-0 flex justify-end items-center z-10 bg-transparent">
      <div className="flex gap-4 items-center">
        <Search className="text-white" />
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 transition"
        >
          {darkMode ? <Sun className="text-white" /> : <Moon className="text-white" />}
        </button>
        <button className="p-2 rounded-full bg-white">
          <User className="text-black w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
