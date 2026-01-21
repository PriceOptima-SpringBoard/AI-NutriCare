
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex items-center h-10 w-20 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary-500 ${isDarkMode ? 'bg-slate-700' : 'bg-primary-100'}`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <span className="sr-only">Toggle Theme</span>
            <motion.div
                className="absolute left-1 top-1 bg-white rounded-full flex items-center justify-center w-8 h-8 shadow-md z-10"
                animate={{
                    x: isDarkMode ? 40 : 0,
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff'
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {isDarkMode ? (
                    <Moon className="w-5 h-5 text-primary-400" />
                ) : (
                    <Sun className="w-5 h-5 text-warm" />
                )}
            </motion.div>

            {/* Background Icons for visual context */}
            <div className="flex justify-between w-full px-2.5">
                <Sun className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'opacity-0'}`} />
                <Moon className={`w-5 h-5 ${!isDarkMode ? 'text-primary-300' : 'opacity-0'}`} />
            </div>
        </button>
    );
};

export default ThemeToggle;
