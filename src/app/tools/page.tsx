'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import Layout from '@/components/Layout';
import ToolCard from '@/components/ToolCard';
import SEO from '@/components/SEO';
import { FaSearch, FaTools, FaShieldAlt, FaFacebook, FaInstagram, FaImage, FaFileExcel, FaUser, FaEnvelope } from 'react-icons/fa';

// Tools data
const toolsData = [
  {
    id: 1,
    title: "2FA Authenticator",
    description: "Manage your 2FA tokens with automatic code generation. Import, export, and organize authentication codes.",
    iconName: "FaShieldAlt",
    slug: "2fa-generator"
  },
  {
    id: 2,
    title: "Facebook UID Checker",
    description: "Check if Facebook UIDs are live or dead. Batch processing with configurable speed and detailed results.",
    iconName: "FaFacebook",
    slug: "fb-uid-checker"
  },
  {
    id: 3,
    title: "Instagram Username Checker",
    description: "Verify if Instagram usernames are available or taken. Fast batch processing with live/dead status.",
    iconName: "FaInstagram",
    slug: "ig-username-checker"
  },
  {
    id: 4,
    title: "Photo Profile Generator",
    description: "Generate beautiful profile photos from Pinterest. Filter by gender and choose the number of photos to generate.",
    iconName: "FaImage",
    slug: "photo-gen"
  },
  {
    id: 5,
    title: "Temp Notes",
    description: "Online spreadsheet with dynamic rows/columns, auto-save, and Excel export functionality.",
    iconName: "FaFileExcel",
    slug: "temp-notes"
  },
  {
    id: 6,
    title: "Username Generator",
    description: "Generate creative Indonesian-style usernames with adjectives, slang words, and numbers.",
    iconName: "FaUser",
    slug: "username-generator"
  },
  {
    id: 7,
    title: "Temporary Email",
    description: "Generate disposable email addresses for privacy protection. Auto-refresh inbox and message preview.",
    iconName: "FaEnvelope",
    slug: "temp-email"
  }
];

const ToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tools based on search term
  const filteredTools = useMemo(() => {
    return toolsData.filter(tool =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Layout>
      <SEO 
        title="All Tools - MarkTools Collection"
        description="Browse our complete collection of web tools including 2FA authenticator, social media checkers, photo generator, and productivity tools."
        canonical="/tools"
      />
      <AnimatedPage>
        <div className="min-h-screen px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-hue-text mb-4">
                Semua Tools
              </h1>
              <p className="text-lg md:text-xl text-hue-paragraph">
                Temukan berbagai tools untuk meningkatkan produktivitas Anda
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <FaSearch 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hue-paragraph"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-hue-stroke text-hue-text placeholder-hue-paragraph focus:outline-none focus:ring-2 focus:ring-hue-accent focus:border-transparent transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Results Count */}
            {searchTerm && (
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-hue-paragraph">
                  Ditemukan {filteredTools.length} tools untuk "{searchTerm}"
                </p>
              </motion.div>
            )}

            {/* Tools Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <ToolCard
                    title={tool.title}
                    description={tool.description}
                    iconName={tool.iconName}
                    slug={tool.slug}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredTools.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaTools className="mx-auto text-hue-paragraph mb-4" size={48} />
                <h3 className="text-xl font-semibold text-hue-text mb-2">
                  Tidak ada tools ditemukan
                </h3>
                <p className="text-hue-paragraph">
                  Coba kata kunci lain atau periksa ejaan Anda
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default ToolsPage;