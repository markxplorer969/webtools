'use client';

import { motion } from 'framer-motion';
import { categories } from '@/lib/toolsData';

interface SidebarKategoriProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const SidebarKategori: React.FC<SidebarKategoriProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-full h-full"
    >
      <div 
        className="rounded-2xl p-6 sticky top-24"
        style={{
          backgroundColor: '#1E1E1E',
          border: '1px solid rgba(68, 68, 68, 0.3)'
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold mb-2" style={{ color: '#E0E0E0' }}>
            Kategori
          </h2>
          <p className="text-sm" style={{ color: '#B0B0B0' }}>
            Filter tools berdasarkan kategori
          </p>
        </div>

        {/* Categories List */}
        <nav className="space-y-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              variants={itemVariants}
              custom={index}
              onClick={() => setActiveCategory(category.name)}
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
            </motion.button>
          ))}
        </nav>

        {/* Stats */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
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

        {/* Help Section */}
        <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#888888' }}>
              <span className="text-sm font-bold" style={{ color: '#121212' }}>?</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1" style={{ color: '#E0E0E0' }}>
                Butuh bantuan?
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: '#B0B0B0' }}>
                Hubungi kami jika Anda membutuhkan bantuan atau memiliki saran untuk tools baru.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default SidebarKategori;