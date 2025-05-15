import SearchBar from "../../pages/SearchBar/SearchBar";
import { Moon, Sun, User } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="pt-[47px] pr-[47px] absolute top-0 left-[306px] right-0 flex justify-end items-center z-20 bg-transparent">
      <div className="flex gap-4 items-center">
        <SearchBar />

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 transition"
        >
          {darkMode ? (
            <Sun className="text-white" /> 
          ) : (
            <Moon className="text-black" /> 
          )}
        </button>
      </div>
    </header>
  );
}
