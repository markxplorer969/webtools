'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-dark-grey border-t border-divider mt-auto"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1: Logo & Copyright */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-dark-charcoal font-bold text-lg">M</span>
                </div>
                <span className="text-primary-text font-heading text-xl font-semibold group-hover:text-accent transition-colors duration-200">
                  Mark Tools
                </span>
              </Link>
            </div>
            <p className="text-secondary-text text-sm leading-relaxed">
              Kumpulan tools digital instan untuk meningkatkan produktivitas. Gratis, aman, dan mudah digunakan.
            </p>
            <div className="flex items-center space-x-2 text-secondary-text text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-accent fill-current" />
              <span>by Mark Tools Team</span>
            </div>
            <div className="flex items-center space-x-2 text-secondary-text text-xs">
              <span>© 2025</span>
              <Link href="/" className="hover:text-accent transition-colors duration-200">
                Mark Tools
              </Link>
              <span>-</span>
              <Link href="https://marktools.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">
                marktools.web.id
              </Link>
            </div>
          </motion.div>

          {/* Kolom 2: Peta Situs */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-primary-text font-heading text-lg font-semibold">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="block text-secondary-text hover:text-accent transition-colors duration-200 text-sm"
              >
                Home
              </Link>
              <Link 
                href="/tools" 
                className="block text-secondary-text hover:text-accent transition-colors duration-200 text-sm"
              >
                Tools
              </Link>
              <Link 
                href="/tentang" 
                className="block text-secondary-text hover:text-accent transition-colors duration-200 text-sm"
              >
                About Us
              </Link>
              <Link 
                href="/privacy" 
                className="block text-secondary-text hover:text-accent transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="block text-secondary-text hover:text-accent transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </nav>
          </motion.div>

          {/* Kolom 3: Tautan Sosial & GitHub */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-primary-text font-heading text-lg font-semibold">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 backdrop-blur-md border border-divider/50 rounded-lg flex items-center justify-center hover:bg-accent hover:text-dark-charcoal transition-all duration-200 group"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 backdrop-blur-md border border-divider/50 rounded-lg flex items-center justify-center hover:bg-accent hover:text-dark-charcoal transition-all duration-200 group"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <Link 
                href="mailto:hello@marktools.web.id" 
                className="w-10 h-10 bg-white/5 backdrop-blur-md border border-divider/50 rounded-lg flex items-center justify-center hover:bg-accent hover:text-dark-charcoal transition-all duration-200 group"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-secondary-text text-sm">
                Support our mission
              </p>
              <a 
                href="https://www.effectivegatecpm.com/he2th9j74?key=18ae90854e6bacfc4607019b14ff9473" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-accent hover:text-secondary-text transition-colors duration-200 text-sm"
              >
                <span>Donate</span>
                <Heart className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;