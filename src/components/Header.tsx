'use client';

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Settings, Info, Wrench, Shield, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  // Handle glare effect for navbar
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlarePosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlarePosition({ x: -100, y: -100 });
  }, []);

  const headerVariants = {
    top: {
      backgroundColor: 'rgba(18, 18, 18, 0.8)',
      backdropFilter: 'blur(0px)',
      borderBottomColor: 'transparent',
    },
    scrolled: {
      backgroundColor: 'rgba(18, 18, 18, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: null },
    { href: '/tools', label: 'Tools', icon: Wrench },
    { href: '/tentang', label: 'About', icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        animate={isScrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: isScrolled ? 'rgba(18, 18, 18, 0.9)' : 'rgba(18, 18, 18, 0.8)',
          borderBottomColor: isScrolled ? 'rgba(136, 136, 136, 0.2)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        }}
      >
        {/* Glare Layer */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.03), transparent 40%)`
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between" style={{ padding: isScrolled ? '1rem 0' : '1.5rem 0' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: '#888888' }}
              >
                {/* Logo Glare */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 60%)`
                  }}
                />
                <span className="font-bold text-xl" style={{ color: '#121212' }}>M</span>
              </motion.div>
              <div className="flex flex-col">
                <span 
                  className="text-xl font-bold transition-colors duration-200" 
                  style={{ 
                    fontFamily: 'var(--font-poppins)', 
                    color: '#E0E0E0',
                    textShadow: '0 0 20px rgba(136, 136, 136, 0.3)'
                  }}
                >
                  Mark Tools
                </span>
                <span 
                  className="text-xs transition-colors duration-200"
                  style={{ 
                    color: '#888888',
                    fontFamily: 'var(--font-inter)'
                  }}
                >
                  Elegant Digital Utilities
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 transition-all duration-200 group relative"
                  style={{ 
                    color: isActive(item.href) ? '#888888' : '#B0B0B0',
                    fontWeight: isActive(item.href) ? '600' : '400'
                  }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="font-medium">{item.label}</span>
                  {/* Active Indicator */}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{ backgroundColor: '#888888' }}
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* Feature Pills - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full glass"
                  style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}
                >
                  <Shield className="w-3 h-3" style={{ color: '#888888' }} />
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Secure</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full glass"
                  style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}
                >
                  <Zap className="w-3 h-3" style={{ color: '#888888' }} />
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Fast</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full glass"
                  style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}
                >
                  <Heart className="w-3 h-3" style={{ color: '#888888' }} />
                  <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Free</span>
                </motion.div>
              </div>

              {/* CTA Button - Hidden on mobile */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/tools"
                  className="hidden md:block px-6 py-2.5 rounded-xl transition-all duration-200 font-semibold relative overflow-hidden group"
                  style={{ 
                    backgroundColor: '#888888',
                    color: '#121212'
                  }}
                >
                  {/* Button Glare */}
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3), transparent 70%)`
                    }}
                  />
                  <span className="relative z-10">Explore Tools</span>
                </Link>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden transition-colors duration-200 p-2 rounded-lg glass"
                style={{ color: '#E0E0E0' }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40 md:hidden"
          style={{ 
            top: isScrolled ? '72px' : '88px',
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(136, 136, 136, 0.2)'
          }}
        >
          <nav className="container mx-auto px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 transition-all duration-200 py-4 px-4 rounded-xl glass"
                  style={{ 
                    color: isActive(item.href) ? '#888888' : '#B0B0B0',
                    backgroundColor: isActive(item.href) ? 'rgba(136, 136, 136, 0.1)' : 'transparent'
                  }}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="font-medium text-lg">{item.label}</span>
                  {isActive(item.href) && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#888888' }} />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* Mobile Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'rgba(136, 136, 136, 0.2)' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 px-3 py-1 rounded-full glass"
                style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}
              >
                <Shield className="w-3 h-3" style={{ color: '#888888' }} />
                <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Secure</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 px-3 py-1 rounded-full glass"
                style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}
              >
                <Zap className="w-3 h-3" style={{ color: '#888888' }} />
                <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Fast</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 px-3 py-1 rounded-full glass"
                style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)' }}
              >
                <Heart className="w-3 h-3" style={{ color: '#888888' }} />
                <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>Free</span>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6"
            >
              <Link 
                href="/tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 rounded-xl transition-all duration-200 font-semibold relative overflow-hidden group"
                style={{ 
                  backgroundColor: '#888888',
                  color: '#121212'
                }}
              >
                {/* Mobile Button Glare */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3), transparent 70%)`
                  }}
                />
                <span className="relative z-10">Explore Tools</span>
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </>
  );
};

export default Header;