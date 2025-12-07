'use client';

import { useState, useEffect } from 'react';
import ToolCard from '@/components/ToolCard';
import SidebarKategori from '@/components/SidebarKategori';
import SearchBar from '@/components/SearchBar';
import FilterDrawer from '@/components/FilterDrawer';
import NativeBanner from '@/components/ads/NativeBanner';
import { allToolsData } from '@/lib/toolsData';
import { Tool } from '@/lib/types';
import { Filter } from 'lucide-react';

const ToolsPage: React.FC = () => {
  // State Management
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setAllTools(allToolsData);
      setFilteredTools(allToolsData);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen">
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Hero Section - Simple Design */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold" style={{ color: '#E0E0E0' }}>
              Kumpulan Tools Digital
            </h1>
              
            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed" style={{ color: '#B0B0B0' }}>
              Jelajahi koleksi tools elegan untuk produktivitas, keamanan, dan pengembangan.
            </p>

            {/* Simple Stats */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="px-6 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                🚀 {filteredTools.length} Tools
              </div>
              <div className="px-6 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                📊 {filteredTools.filter(tool => tool.category === 'Security').length} Security
              </div>
              <div className="px-6 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                🔧 {filteredTools.filter(tool => tool.category === 'Generator').length} Generator
              </div>
              <div className="px-6 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                📝 {filteredTools.filter(tool => tool.category === 'Text').length} Text
              </div>
              <div className="px-6 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
                ⚙️ {filteredTools.filter(tool => tool.category === 'Utility').length} Utility
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          {/* Search and Filter Section - Simple Design */}
          <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
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
                className="px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 border"
                style={{ 
                  borderColor: '#888888',
                  color: '#888888',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
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

          {/* Native Banner Ads - Top */}
          <NativeBanner className="mb-8" />

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

              {/* Simple Grid Layout */}
              <div className="space-y-8">
                {/* First Row - Half of the tools */}
                <div
                  className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4
                    gap-4 
                    sm:gap-5 
                    md:gap-6
                    w-full
                  "
                >
                  {isLoading ? (
                    // Loading Skeletons - First half
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="glass rounded-2xl p-6"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(136, 136, 136, 0.3)',
                          minHeight: '280px'
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.2)' }}></div>
                          <div className="px-3 py-1 rounded-full w-20 h-6" style={{ backgroundColor: 'rgba(68, 68, 68, 0.3)' }}></div>
                        </div>
                        <div className="flex-grow flex flex-col">
                          <div className="h-6 rounded mb-3 w-3/4" style={{ backgroundColor: 'rgba(136, 136, 136, 0.2)' }}></div>
                          <div className="h-4 rounded mb-2 w-full" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                          <div className="h-4 rounded mb-2 w-5/6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                          <div className="flex flex-wrap gap-2 mb-4 mt-3">
                            <div className="px-3 py-1 rounded-full w-16 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.15)' }}></div>
                            <div className="px-3 py-1 rounded-full w-20 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.15)' }}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
                          <div className="px-3 py-1 rounded w-20 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                          <div className="w-16 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // First half of tools
                    filteredTools.slice(0, Math.ceil(filteredTools.length / 2)).map((tool) => (
                      <ToolCard
                        key={tool.slug}
                        tool={tool}
                        opacity={1}
                      />
                    ))
                  )}
                </div>

                {/* Second Row - Remaining tools */}
                <div
                  className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4
                    gap-4 
                    sm:gap-5 
                    md:gap-6
                    w-full
                  "
                >
                  {isLoading ? (
                    // Loading Skeletons - Second half
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`skeleton-${index + 6}`}
                        className="glass rounded-2xl p-6"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(136, 136, 136, 0.3)',
                          minHeight: '280px'
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.2)' }}></div>
                          <div className="px-3 py-1 rounded-full w-20 h-6" style={{ backgroundColor: 'rgba(68, 68, 68, 0.3)' }}></div>
                        </div>
                        <div className="flex-grow flex flex-col">
                          <div className="h-6 rounded mb-3 w-3/4" style={{ backgroundColor: 'rgba(136, 136, 136, 0.2)' }}></div>
                          <div className="h-4 rounded mb-2 w-full" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                          <div className="h-4 rounded mb-2 w-5/6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                          <div className="flex flex-wrap gap-2 mb-4 mt-3">
                            <div className="px-3 py-1 rounded-full w-16 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.15)' }}></div>
                            <div className="px-3 py-1 rounded-full w-20 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.15)' }}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
                          <div className="px-3 py-1 rounded w-20 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                          <div className="w-16 h-6" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Second half of tools
                    filteredTools.slice(Math.ceil(filteredTools.length / 2)).map((tool) => (
                      <ToolCard
                        key={tool.slug}
                        tool={tool}
                        opacity={1}
                      />
                    ))
                  )}
                </div>
              </div>
              
                {/* Native Banner Ads - Middle */}
                <NativeBanner />
              {/* Simple Empty State */}
              
              {!isLoading && filteredTools.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-32 h-32 rounded-3xl mx-auto mb-8 flex items-center justify-center" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}>
                    <span className="text-5xl">🔍</span>
                  </div>
                  <h3 className="text-3xl font-heading font-semibold mb-6" style={{ color: '#E0E0E0' }}>
                    Tidak ada tools ditemukan
                  </h3>
                  <p className="text-xl mb-8 max-w-md mx-auto" style={{ color: '#B0B0B0' }}>
                    Coba ubah filter atau kata kunci pencarian Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('Semua');
                    }}
                    className="px-8 py-4 rounded-xl font-semibold"
                    style={{ backgroundColor: '#888888', color: '#121212' }}
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolsPage;