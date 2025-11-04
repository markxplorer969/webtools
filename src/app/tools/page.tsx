'use client';

import { Metadata } from 'next';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ToolCard from '@/components/ToolCard';
import SidebarKategori from '@/components/SidebarKategori';
import SearchBar from '@/components/SearchBar';
import FilterDrawer from '@/components/FilterDrawer';
import { allToolsData, categories } from '@/lib/toolsData';
import { Tool } from '@/lib/types';
import { Filter } from 'lucide-react';

// SEO Metadata (Pilar 12)
export const metadata: Metadata = {
  title: 'Kumpulan Tools Digital - Mark Tools',
  description: 'Jelajahi koleksi tools elegan untuk produktivitas, keamanan, dan pengembangan. Multi-2FA Authenticator, Password Generator, Text Analyzer, QR Code Generator, dan lainnya.',
  keywords: ['kumpulan tools', 'digital tools', 'productivity tools', 'security tools', '2FA authenticator', 'password generator', 'text analyzer', 'QR generator', 'URL shortener', 'Mark Tools'],
  authors: [{ name: 'Mark Tools Team' }],
  creator: 'Mark Tools',
  publisher: 'Mark Tools',
  robots: 'index, follow',
  openGraph: {
    title: 'Kumpulan Tools Digital - Mark Tools',
    description: 'Jelajahi koleksi tools elegan untuk produktivitas, keamanan, dan pengembangan. Multi-2FA Authenticator, Password Generator, Text Analyzer, QR Code Generator, dan lainnya.',
    url: 'https://marktools.com/tools',
    siteName: 'Mark Tools',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://marktools.com/tools/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kumpulan Tools Digital - Mark Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kumpulan Tools Digital - Mark Tools',
    description: 'Jelajahi koleksi tools elegan untuk produktivitas, keamanan, dan pengembangan.',
    images: ['https://marktools.com/tools/twitter-image.jpg'],
    creator: '@marktools',
    site: '@marktools',
  },
  alternates: {
    canonical: 'https://marktools.com/tools',
    languages: {
      'en-US': 'https://marktools.com/en/tools',
      'id-ID': 'https://marktools.com/id/tools',
    },
  },
};

const ToolsPage: React.FC = () => {
  // State Management
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState<Array<{x: number, y: number, width: number, height: number}>>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Refs
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load data on mount
  useEffect(() => {
    setAllTools(allToolsData);
    setFilteredTools(allToolsData);
  }, []);

  // Filter tools based on category and search
  useEffect(() => {
    let filtered = allTools;

    // Filter by category
    if (activeCategory !== 'Semua') {
      filtered = filtered.filter(tool => tool.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTools(filtered);
  }, [activeCategory, searchQuery, allTools]);

  // Proximity Lighting - Mouse tracking
  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  // Calculate distance from mouse to card
  const calculateDistance = (cardX: number, cardY: number, cardWidth: number, cardHeight: number) => {
    const cardCenterX = cardX + cardWidth / 2;
    const cardCenterY = cardY + cardHeight / 2;
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - cardCenterX, 2) + 
      Math.pow(mousePosition.y - cardCenterY, 2)
    );
    return distance;
  };

  // Get opacity based on distance
  const getCardOpacity = (distance: number) => {
    const maxDistance = 300;
    const minOpacity = 0.4;
    const maxOpacity = 1;
    const opacity = maxOpacity - (distance / maxDistance) * (maxOpacity - minOpacity);
    return Math.max(minOpacity, Math.min(maxOpacity, opacity));
  };

  // Update card positions for proximity lighting
  useEffect(() => {
    const updateCardPositions = () => {
      const positions = cardRefs.current.map((ref) => {
        if (!ref || !gridRef.current) return { x: 0, y: 0, width: 0, height: 0 };
        
        const cardRect = ref.getBoundingClientRect();
        const gridRect = gridRef.current!.getBoundingClientRect();
        
        return {
          x: cardRect.left - gridRect.left,
          y: cardRect.top - gridRect.top,
          width: cardRect.width,
          height: cardRect.height
        };
      });
      
      setCardPositions(positions);
    };

    updateCardPositions();
    window.addEventListener('resize', updateCardPositions);
    
    return () => window.removeEventListener('resize', updateCardPositions);
  }, [filteredTools]);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Hero Section - Mobile First */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-8 md:py-16 relative"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Title */}
            <motion.h1 
              variants={sectionVariants}
              className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold"
              style={{ color: '#E0E0E0' }}
            >
              Kumpulan Tools Digital
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              variants={sectionVariants}
              className="text-lg md:text-xl lg:text-2xl leading-relaxed"
              style={{ color: '#B0B0B0' }}
            >
              Jelajahi koleksi tools elegan untuk produktivitas, keamanan, dan pengembangan.
            </motion.p>

            {/* Stats */}
            <motion.div 
              variants={sectionVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                🚀 {filteredTools.filter(tool => tool.is_live).length} Tools Aktif
              </div>
              <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                🔄 {filteredTools.filter(tool => !tool.is_live).length} Coming Soon
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="pb-16 md:pb-24"
      >
        <div className="container mx-auto px-4">
          {/* Search and Filter Section - Stacked on Mobile */}
          <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari tools berdasarkan nama, deskripsi, atau kategori..."
              />
            </div>

            {/* Filter Button - Mobile Only */}
            <div className="flex md:hidden justify-center">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 border"
                style={{ 
                  borderColor: '#888888',
                  color: '#888888'
                }}
              >
                <Filter className="w-5 h-5" />
                <span>Filter Kategori</span>
                {activeCategory !== 'Semua' && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.2)', color: '#888888' }}>
                    {activeCategory}
                  </span>
                )}
              </button>
            </div>

            {/* Active Category Display - Mobile */}
            {activeCategory !== 'Semua' && (
              <div className="md:hidden text-center">
                <span className="text-sm" style={{ color: '#888888' }}>
                  Kategori: <span className="font-semibold" style={{ color: '#E0E0E0' }}>{activeCategory}</span>
                </span>
              </div>
            )}
          </div>

          {/* 2-Column Layout - Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            {/* Left Column - Sidebar - Desktop Only */}
            <div className="hidden md:block">
              <SidebarKategori 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>

            {/* Right Column - Content */}
            <div>
              {/* Results Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-heading font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                    {activeCategory === 'Semua' ? 'Semua Tools' : `Tools ${activeCategory}`}
                  </h2>
                  <p className="text-sm" style={{ color: '#B0B0B0' }}>
                    Menampilkan {filteredTools.length} dari {allTools.length} tools
                  </p>
                </div>

                {searchQuery && (
                  <div className="text-center md:text-right">
                    <span className="text-sm" style={{ color: '#888888' }}>
                      Filter: "{searchQuery}"
                    </span>
                  </div>
                )}
              </div>

              {/* Adaptive Masonry Grid */}
              <motion.div
                ref={gridRef}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                onMouseMove={handleGridMouseMove}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]"
                style={{ gridAutoFlow: 'dense' }}
              >
                {filteredTools.map((tool, index) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cardRef={(el) => (cardRefs.current[index] = el)}
                    opacity={cardPositions[index] ? getCardOpacity(calculateDistance(cardPositions[index].x, cardPositions[index].y, cardPositions[index].width, cardPositions[index].height)) : 1}
                  />
                ))}
              </motion.div>

              {/* Empty State */}
              {filteredTools.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}>
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-4" style={{ color: '#E0E0E0' }}>
                    Tidak ada tools ditemukan
                  </h3>
                  <p className="text-lg mb-6" style={{ color: '#B0B0B0' }}>
                    Coba ubah filter atau kata kunci pencarian Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('Semua');
                    }}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    style={{ backgroundColor: '#888888', color: '#121212' }}
                  >
                    Reset Filter
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ToolsPage;