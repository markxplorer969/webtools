'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { categories } from '@/lib/toolsData';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ 
  isOpen, 
  onClose, 
  activeCategory, 
  setActiveCategory 
}) => {
  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 z-50 overflow-hidden"
            style={{
              backgroundColor: 'rgba(30, 30, 30, 0.98)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(68, 68, 68, 0.3)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#888888' }}>
                  <Filter className="w-5 h-5" style={{ color: '#121212' }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: '#E0E0E0' }}>
                  Filter Kategori
                </h3>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-white/10"
              >
                <X className="w-5 h-5" style={{ color: '#B0B0B0' }} />
              </button>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setActiveCategory(category.name);
                      onClose();
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl transition-all duration-300
                      flex items-center justify-between group
                      ${activeCategory === category.name 
                        ? 'bg-accent text-dark-char' 
                        : 'hover:bg-white/5 text-secondary-text hover:text-primary-text'
                      }
                    `}
                    style={{
                      backgroundColor: activeCategory === category.name ? '#888888' : 'transparent'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">
                        {category.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`
                          px-2 py-1 rounded-full text-xs font-semibold
                          ${activeCategory === category.name 
                            ? 'bg-dark-char/20 text-dark-char' 
                            : 'bg-white/10 text-secondary-text'
                          }
                        `}
                        style={{
                          backgroundColor: activeCategory === category.name 
                            ? 'rgba(18, 18, 18, 0.2)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          color: activeCategory === category.name ? '#121212' : '#B0B0B0'
                        }}
                      >
                        {category.count}
                      </span>
                      
                      {activeCategory === category.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#121212' }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#B0B0B0' }}>Total Tools</span>
                    <span className="text-sm font-semibold" style={{ color: '#E0E0E0' }}>
                      {categories.find(c => c.name === 'Semua')?.count || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#B0B0B0' }}>Tools Aktif</span>
                    <span className="text-sm font-semibold" style={{ color: '#888888' }}>
                      1
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#B0B0B0' }}>Coming Soon</span>
                    <span className="text-sm font-semibold" style={{ color: '#888888' }}>
                      {(categories.find(c => c.name === 'Semua')?.count || 0) - 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
              <button
                onClick={() => {
                  setActiveCategory('Semua');
                  onClose();
                }}
                className="w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 border"
                style={{ 
                  borderColor: '#888888',
                  color: '#888888'
                }}
              >
                Reset Filter
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;