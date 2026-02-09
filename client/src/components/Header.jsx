import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="flex justify-between items-center mb-10 px-4 transition-colors duration-500">
      {/* Original Greeting Style */}
      <div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">
          Hello, {user.name.split(' ')[0]}
        </h1>
      </div>

      {/* Neat Icon Actions */}
      <div className="flex items-center space-x-4">
        {/* Simple Theme Toggle Icon */}
        <button 
          onClick={toggleTheme}
          className="p-3 text-slate-400 hover:text-blue-500 dark:hover:text-amber-400 transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Pill - Professional & Small */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{user.name}</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-500 dark:text-slate-400">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;