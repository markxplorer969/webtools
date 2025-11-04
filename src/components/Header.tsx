'use client';

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Settings, Info, Wrench } from 'lucide-react';
import Link from 'next/link';

const Header: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  const headerVariants = {
    top: {
      backgroundColor: '#1E1E1E',
      paddingY: '1.5rem',
      borderBottomColor: 'transparent',
      backdropFilter: 'blur(0px)',
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      paddingY: '1rem',
      borderBottomColor: '#444444',
      backdropFilter: 'blur(16px)',
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: null },
    { href: '/tools', label: 'Tools', icon: Wrench },
    { href: '/tentang', label: 'About', icon: Info },
  ];

  return (
    <>
      <motion.header
        variants={headerVariants}
        animate={isScrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.05)' : '#1E1E1E',
          borderBottomColor: isScrolled ? '#444444' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between" style={{ padding: isScrolled ? '1rem 0' : '1.5rem 0' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: '#888888' }}
              >
                <span className="font-bold text-xl" style={{ color: '#121212' }}>M</span>
              </motion.div>
              <span className="text-xl font-semibold transition-colors duration-200" style={{ fontFamily: 'var(--font-poppins)', color: '#E0E0E0' }}>
                Mark Tools
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 transition-colors duration-200 group"
                  style={{ color: '#B0B0B0' }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* CTA Button - Hidden on mobile */}
              <Link 
                href="/tools"
                className="hidden md:block px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                style={{ 
                  backgroundColor: '#888888',
                  color: '#121212'
                }}
              >
                Get Started
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden transition-colors duration-200"
                style={{ color: '#E0E0E0' }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
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
            backgroundColor: 'rgba(30, 30, 30, 0.98)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 transition-colors duration-200 py-3"
                style={{ 
                  color: '#B0B0B0',
                  borderBottom: '1px solid rgba(68, 68, 68, 0.3)'
                }}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-medium text-lg">{item.label}</span>
              </Link>
            ))}
            <Link 
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-6 py-3 rounded-lg transition-all duration-200 font-medium mt-4"
              style={{ 
                backgroundColor: '#888888',
                color: '#121212'
              }}
            >
              Get Started
            </Link>
          </nav>
        </motion.div>
      )}
    </>
  );
};

export default Header;