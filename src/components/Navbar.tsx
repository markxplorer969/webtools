'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-hue-background/80 backdrop-blur-md border-b border-hue-stroke"
    >
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <Link href="/">
          <motion.h1 
            className="font-bold text-hue-text text-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            MarkTools
          </motion.h1>
        </Link>
        
        <div className="flex gap-6">
          <Link href="/tools">
            <motion.span 
              className="text-hue-paragraph hover:text-hue-accent transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Tools
            </motion.span>
          </Link>
          
          <Link href="/about">
            <motion.span 
              className="text-hue-paragraph hover:text-hue-accent transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Tentang
            </motion.span>
          </Link>
          
          <a 
            href="https://saweria.co/markxplorer" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <motion.span 
              className="text-hue-paragraph hover:text-hue-accent transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Donasi
            </motion.span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;