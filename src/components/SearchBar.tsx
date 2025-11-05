'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Cari tools..." 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const searchVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={searchVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <div 
        className={`
          relative rounded-2xl transition-all duration-300
          ${isFocused ? 'ring-2 ring-accent/50' : ''}
        `}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(68, 68, 68, 0.5)',
          ringColor: isFocused ? 'rgba(136, 136, 136, 0.5)' : 'transparent'
        }}
      >
        <div className="flex items-center">
          {/* Search Icon */}
          <div className="pl-6 pr-4">
            <Search 
              className="w-5 h-5 transition-colors duration-200" 
              style={{ color: isFocused ? '#888888' : '#B0B0B0' }} 
            />
          </div>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 py-4 pr-12 bg-transparent outline-none text-primary-text placeholder-secondary-text"
            style={{
              color: '#E0E0E0',
              fontSize: '16px'
            }}
          />

          {/* Clear Button */}
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="pr-6 pl-2"
            >
              <X 
                className="w-4 h-4 transition-colors duration-200 hover:text-accent cursor-pointer" 
                style={{ color: '#B0B0B0' }} 
              />
            </motion.button>
          )}
        </div>

        {/* Animated Border Bottom */}
        {isFocused && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full"
            style={{ backgroundColor: '#888888' }}
          />
        )}
      </div>

      {/* Search Hint */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl text-sm"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(68, 68, 68, 0.3)',
            color: '#B0B0B0'
          }}
        >
          Menampilkan hasil untuk: <span className="font-semibold" style={{ color: '#E0E0E0' }}>"{value}"</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;