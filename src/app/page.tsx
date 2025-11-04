'use client';

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Zap, Shield, Heart, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

// SEO Metadata (Pilar 12)
export const metadata: Metadata = {
  title: 'Mark Tools - Elegant Digital Utilities for Modern Creators',
  description: 'Experience minimalist suite of powerful digital tools designed for modern creators. Lightning-fast, secure, and completely free utilities that work instantly in your browser.',
  keywords: ['Mark Tools', 'digital tools', 'minimalist', 'utilities', 'productivity', 'elegant design', 'web tools', 'online tools', 'free tools'],
  authors: [{ name: 'Mark Tools Team' }],
  creator: 'Mark Tools',
  publisher: 'Mark Tools',
  robots: 'index, follow',
  openGraph: {
    title: 'Mark Tools - Elegant Digital Utilities for Modern Creators',
    description: 'Minimalist suite of powerful digital tools designed for modern creators. Lightning-fast, secure, and completely free utilities.',
    url: 'https://marktools.com',
    siteName: 'Mark Tools',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://marktools.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mark Tools - Elegant Digital Utilities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mark Tools - Elegant Digital Utilities',
    description: 'Minimalist suite of powerful digital tools designed for modern creators.',
    images: ['https://marktools.com/twitter-image.jpg'],
    creator: '@marktools',
    site: '@marktools',
  },
  alternates: {
    canonical: 'https://marktools.com',
    languages: {
      'en-US': 'https://marktools.com/en',
      'id-ID': 'https://marktools.com/id',
    },
  },
};

const HomePage: React.FC = () => {
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState<Array<{x: number, y: number, width: number, height: number}>>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlarePosition({ x, y });
  };

  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const calculateDistance = (cardX: number, cardY: number, cardWidth: number, cardHeight: number) => {
    const cardCenterX = cardX + cardWidth / 2;
    const cardCenterY = cardY + cardHeight / 2;
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - cardCenterX, 2) + 
      Math.pow(mousePosition.y - cardCenterY, 2)
    );
    return distance;
  };

  const getCardOpacity = (distance: number) => {
    const maxDistance = 300;
    const minOpacity = 0.4;
    const maxOpacity = 1;
    const opacity = maxOpacity - (distance / maxDistance) * (maxOpacity - minOpacity);
    return Math.max(minOpacity, Math.min(maxOpacity, opacity));
  };

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
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Instan",
      description: "Lightning-fast tools that work instantly in your browser. No downloads, no installations, just pure efficiency."
    },
    {
      icon: Shield,
      title: "Privasi",
      description: "Your data stays on your device. We don't track, store, or share any of your information. Complete privacy guaranteed."
    },
    {
      icon: Heart,
      title: "Gratis",
      description: "All tools are completely free to use. No hidden costs, no premium tiers. Just elegant tools for everyone."
    }
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={sectionVariants}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold text-primary-text leading-tight"
              variants={sectionVariants}
            >
              <span className="text-glow">Elegant Tools for</span>
              <br />
              <span className="text-accent">Modern Creators</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-secondary-text max-w-2xl mx-auto leading-relaxed"
              variants={sectionVariants}
            >
              Experience the beauty of simplicity with our minimalist suite of powerful digital utilities. 
              Designed for those who appreciate elegance and functionality.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={sectionVariants}
            >
              <Link 
                href="/tools"
                className="group px-8 py-4 bg-accent text-dark-char rounded-lg hover:bg-secondary-text transition-all duration-300 font-semibold text-lg flex items-center space-x-2 transform hover:scale-105"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                href="/tentang"
                className="px-8 py-4 border border-accent text-accent rounded-lg hover:bg-accent hover:text-dark-char transition-all duration-300 font-semibold text-lg"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* "Kenapa Mark Tools?" Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-24 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-text mb-6">
              Why Mark Tools?
            </h2>
            <p className="text-xl text-secondary-text max-w-2xl mx-auto">
              We believe in the power of simplicity. Each tool is crafted with precision and care to deliver exceptional user experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div 
                  className="glass rounded-2xl p-8 h-full relative overflow-hidden cursor-pointer"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setGlarePosition({ x: -100, y: -100 })}
                >
                  {/* Glare Layer */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors duration-300">
                      <feature.icon className="w-8 h-8 text-accent" />
                    </div>
                    
                    <h3 className="text-2xl font-heading font-semibold text-primary-text mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-secondary-text leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TUGAS 2: Visual Teaser (Pilar 14) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-24 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6" style={{ color: '#E0E0E0' }}>
              Antarmuka yang Dirancang untuk Fokus
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#B0B0B0' }}>
              Grid Masonry dinamis dengan proximity lighting yang merespons gerakan mouse Anda
            </p>
          </motion.div>

          {/* Proximity Zone Container */}
          <motion.div 
            variants={sectionVariants}
            className="relative mx-auto max-w-6xl"
            onMouseMove={handleGridMouseMove}
            ref={gridRef}
            style={{ minHeight: '600px' }}
          >
            {/* Mockup Dynamic Masonry Grid */}
            <div className="grid grid-cols-4 grid-rows-3 gap-4 relative" style={{ height: '500px' }}>
              {/* Card 1 - Large (2x2) */}
              <div 
                ref={(el) => (cardRefs.current[0] = el)}
                className="col-span-2 row-span-2 rounded-lg p-6 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(68, 68, 68, 0.5)',
                  opacity: cardPositions[0] ? getCardOpacity(calculateDistance(cardPositions[0].x, cardPositions[0].y, cardPositions[0].width, cardPositions[0].height)) : 0.4
                }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: '#888888' }}></div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#E0E0E0' }}>Tool Dashboard</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 rounded" style={{ backgroundColor: 'rgba(136, 136, 136, 0.3)' }}></div>
                    <div className="h-2 rounded w-3/4" style={{ backgroundColor: 'rgba(136, 136, 136, 0.3)' }}></div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Small (1x1) */}
              <div 
                ref={(el) => (cardRefs.current[1] = el)}
                className="col-span-1 row-span-1 rounded-lg p-4 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(68, 68, 68, 0.5)',
                  opacity: cardPositions[1] ? getCardOpacity(calculateDistance(cardPositions[1].x, cardPositions[1].y, cardPositions[1].width, cardPositions[1].height)) : 0.4
                }}
              >
                <div className="w-8 h-8 rounded-lg mb-2" style={{ backgroundColor: '#888888' }}></div>
                <p className="text-sm" style={{ color: '#B0B0B0' }}>Quick Action</p>
              </div>

              {/* Card 3 - Small (1x1) */}
              <div 
                ref={(el) => (cardRefs.current[2] = el)}
                className="col-span-1 row-span-1 rounded-lg p-4 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(68, 68, 68, 0.5)',
                  opacity: cardPositions[2] ? getCardOpacity(calculateDistance(cardPositions[2].x, cardPositions[2].y, cardPositions[2].width, cardPositions[2].height)) : 0.4
                }}
              >
                <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: '#888888' }}></div>
                <p className="text-sm" style={{ color: '#B0B0B0' }}>Status</p>
              </div>

              {/* Card 4 - Wide (2x1) */}
              <div 
                ref={(el) => (cardRefs.current[3] = el)}
                className="col-span-2 row-span-1 rounded-lg p-4 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(68, 68, 68, 0.5)',
                  opacity: cardPositions[3] ? getCardOpacity(calculateDistance(cardPositions[3].x, cardPositions[3].y, cardPositions[3].width, cardPositions[3].height)) : 0.4
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: '#888888' }}></div>
                  <div className="flex-1">
                    <div className="h-2 rounded mb-1" style={{ backgroundColor: 'rgba(136, 136, 136, 0.3)' }}></div>
                    <div className="h-2 rounded w-2/3" style={{ backgroundColor: 'rgba(136, 136, 136, 0.3)' }}></div>
                  </div>
                </div>
              </div>

              {/* Card 5 - Small (1x1) */}
              <div 
                ref={(el) => (cardRefs.current[4] = el)}
                className="col-span-1 row-span-1 rounded-lg p-4 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(68, 68, 68, 0.5)',
                  opacity: cardPositions[4] ? getCardOpacity(calculateDistance(cardPositions[4].x, cardPositions[4].y, cardPositions[4].width, cardPositions[4].height)) : 0.4
                }}
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-full h-4 rounded" style={{ backgroundColor: '#888888' }}></div>
                  <div className="w-full h-4 rounded" style={{ backgroundColor: 'rgba(136, 136, 136, 0.3)' }}></div>
                  <div className="w-full h-4 rounded" style={{ backgroundColor: 'rgba(136, 136, 136, 0.3)' }}></div>
                  <div className="w-full h-4 rounded" style={{ backgroundColor: '#888888' }}></div>
                </div>
              </div>

              {/* Card 6 - Small (1x1) */}
              <div 
                ref={(el) => (cardRefs.current[5] = el)}
                className="col-span-1 row-span-1 rounded-lg p-4 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(68, 68, 68, 0.5)',
                  opacity: cardPositions[5] ? getCardOpacity(calculateDistance(cardPositions[5].x, cardPositions[5].y, cardPositions[5].width, cardPositions[5].height)) : 0.4
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#888888' }}>24</div>
                  <p className="text-xs" style={{ color: '#B0B0B0' }}>Tools</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Donasi Section - Updated */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-24 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={sectionVariants}
            className="max-w-4xl mx-auto"
          >
            {/* Main Donasi Container */}
            <div 
              className="rounded-3xl p-12 relative overflow-hidden"
              style={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(68, 68, 68, 0.3)'
              }}
            >
              {/* Background Effects */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.05)' }}></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.03)' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(136, 136, 136, 0.02)' }}></div>
              </div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.h3 
                    variants={sectionVariants}
                    className="text-4xl md:text-5xl font-heading font-bold mb-6"
                    style={{ color: '#E0E0E0' }}
                  >
                    Support Our Mission
                  </motion.h3>
                  
                  <motion.p 
                    variants={sectionVariants}
                    className="text-xl max-w-3xl mx-auto leading-relaxed mb-8"
                    style={{ color: '#B0B0B0' }}
                  >
                    We're committed to keeping these tools free and accessible to everyone. 
                    Your support helps us maintain and improve our services while ensuring complete privacy for all users.
                  </motion.p>
                </div>

                {/* Trakteer Support Card */}
                <motion.div 
                  variants={cardVariants}
                  className="glass rounded-2xl p-10 text-center group hover:scale-105 transition-all duration-300 cursor-pointer mb-12 relative overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setGlarePosition({ x: -100, y: -100 })}
                >
                  {/* Glare Layer */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#888888' }}>
                      <Heart className="w-10 h-10" style={{ color: '#121212' }} />
                    </div>
                    <h4 className="text-3xl font-heading font-semibold mb-4" style={{ color: '#E0E0E0' }}>
                      Support Us on Trakteer
                    </h4>
                    <p className="text-lg mb-8" style={{ color: '#B0B0B0' }}>
                      Buy us a coffee and support our development through Trakteer. Every contribution helps us build better tools for the community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <a 
                        href="https://trakteer.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group px-8 py-4 bg-accent text-dark-char rounded-lg hover:bg-secondary-text transition-all duration-300 font-semibold text-lg flex items-center space-x-2 transform hover:scale-105"
                        style={{ 
                          backgroundColor: '#888888', 
                          color: '#121212'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#B0B0B0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#888888';
                        }}
                      >
                        <span>Support on Trakteer</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Alternative Support Methods */}
                <div className="text-center">
                  <motion.div variants={sectionVariants}>
                    <h4 className="text-xl font-semibold mb-6" style={{ color: '#E0E0E0' }}>
                      Other Ways to Support
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <a 
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div
                          variants={cardVariants}
                          className="glass rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setGlarePosition({ x: -100, y: -100 })}
                        >
                          {/* Glare Layer */}
                          <div 
                            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
                            }}
                          />
                          
                          <div className="relative z-10">
                            <Github className="w-8 h-8 mb-3" style={{ color: '#888888' }} />
                            <span style={{ color: '#E0E0E0' }} className="font-medium">Star Our Repo</span>
                          </div>
                        </motion.div>
                      </a>
                      
                      <a 
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div
                          variants={cardVariants}
                          className="glass rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setGlarePosition({ x: -100, y: -100 })}
                        >
                          {/* Glare Layer */}
                          <div 
                            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
                            }}
                          />
                          
                          <div className="relative z-10">
                            <Twitter className="w-8 h-8 mb-3" style={{ color: '#888888' }} />
                            <span style={{ color: '#E0E0E0' }} className="font-medium">Follow Us</span>
                          </div>
                        </motion.div>
                      </a>
                      
                      <a 
                        href="mailto:hello@marktools.com"
                        className="block"
                      >
                        <motion.div
                          variants={cardVariants}
                          className="glass rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setGlarePosition({ x: -100, y: -100 })}
                        >
                          {/* Glare Layer */}
                          <div 
                            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
                            }}
                          />
                          
                          <div className="relative z-10">
                            <Heart className="w-8 h-8 mb-3" style={{ color: '#888888' }} />
                            <span style={{ color: '#E0E0E0' }} className="font-medium">Spread the Word</span>
                          </div>
                        </motion.div>
                      </a>
                    </div>
                  </motion.div>
                </div>

                {/* Impact Statement */}
                <motion.div 
                  variants={sectionVariants}
                  className="mt-12 text-center"
                >
                  <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}>
                    <span className="text-sm font-medium" style={{ color: '#888888' }}>
                      🚀 Every contribution helps us build better tools for the community
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;