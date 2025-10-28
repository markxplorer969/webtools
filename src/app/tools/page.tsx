'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import allToolsData from '@/lib/toolsData';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Hitung statistik
  const totalTools = useMemo(() => 
    allToolsData.reduce((acc, category) => acc + category.tools.length, 0), []
  );

  const totalCategories = allToolsData.length;

  // Filter tools berdasarkan search dan kategori
  const filteredData = useMemo(() => {
    let filtered = allToolsData;

    // Filter berdasarkan kategori
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(category => 
        category.categoryName === selectedCategory
      );
    }

    // Filter berdasarkan search query
    if (searchQuery.trim()) {
      filtered = filtered.map(category => ({
        ...category,
        tools: category.tools.filter(tool =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.tools.length > 0);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Kumpulkan semua tools yang cocok untuk tampilan pencarian
  const allMatchingTools = useMemo(() => 
    filteredData.flatMap(category => category.tools), [filteredData]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-off-white mb-4">
            Kumpulan Tools
          </h1>
          <p className="text-lg text-neutral-grey max-w-2xl mx-auto mb-8">
            Cari alat yang Anda butuhkan. Fitur baru ditambahkan setiap minggu.
          </p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-grey p-4 rounded-lg text-center"
            >
              <div className="text-2xl font-bold text-electric-blue">{totalTools}</div>
              <div className="text-sm text-neutral-grey">Total Tools</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-grey p-4 rounded-lg text-center"
            >
              <div className="text-2xl font-bold text-electric-blue">{totalCategories}</div>
              <div className="text-sm text-neutral-grey">Kategori</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-dark-grey p-4 rounded-lg text-center"
            >
              <div className="text-2xl font-bold text-electric-blue">
                {allMatchingTools.length}
              </div>
              <div className="text-sm text-neutral-grey">Tersedia</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-dark-grey p-4 rounded-lg text-center"
            >
              <div className="text-2xl font-bold text-mint-green">100%</div>
              <div className="text-sm text-neutral-grey">Gratis</div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex justify-center mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <motion.button
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-electric-blue text-dark-charcoal'
                    : 'bg-dark-grey text-neutral-grey hover:bg-grey-700'
                }`}
              >
                Semua Kategori
              </motion.button>
              {allToolsData.map((category, index) => (
                <motion.button
                  key={category.categoryName}
                  variants={categoryVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedCategory(category.categoryName)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.categoryName
                      ? 'bg-electric-blue text-dark-charcoal'
                      : 'bg-dark-grey text-neutral-grey hover:bg-grey-700'
                  }`}
                >
                  {category.categoryName}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery + selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold text-off-white mb-2">
                  Hasil Pencarian
                </h2>
                <p className="text-neutral-grey">
                  {allMatchingTools.length} tool ditemukan untuk "{searchQuery}"
                </p>
              </div>
            )}

            {selectedCategory !== 'all' && !searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold text-off-white mb-2">
                  Kategori: {selectedCategory}
                </h2>
                <p className="text-neutral-grey">
                  {allMatchingTools.length} tool tersedia
                </p>
              </div>
            )}

            {/* Tools Grid */}
            {allMatchingTools.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {allMatchingTools.map((tool, index) => (
                  <motion.div
                    key={`${tool.name}-${index}`}
                    variants={itemVariants}
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-neutral-grey mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-off-white mb-2">
                    Tidak Ada Tools Ditemukan
                  </h3>
                  <p className="text-neutral-grey">
                    {searchQuery 
                      ? `Tidak ada tools yang cocok dengan pencarian "${searchQuery}"`
                      : 'Tidak ada tools dalam kategori ini'
                    }
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-4 px-6 py-2 bg-electric-blue text-dark-charcoal rounded-full font-medium"
                    >
                      Reset Filter
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}