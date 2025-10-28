'use client';

import { motion } from 'framer-motion';
import { 
  Github, 
  Instagram, 
  Twitter, 
  Heart,
  Mail,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { 
      icon: Github, 
      href: "https://github.com/markxplorer", 
      label: "GitHub" 
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/markxplorer", 
      label: "Instagram" 
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/markxplorer", 
      label: "Twitter" 
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/in/markxplorer", 
      label: "LinkedIn" 
    },
    { 
      icon: Mail, 
      href: "mailto:markxplorer@example.com", 
      label: "Email" 
    }
  ];

  return (
    <footer className="bg-hue-background p-12 flex flex-col items-center gap-4 border-t border-hue-stroke">
      <motion.h2 
        className="text-3xl font-bold text-hue-text mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        MarkTools
      </motion.h2>
      
      <motion.div 
        className="flex gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-hue-paragraph hover:text-hue-accent transition-colors duration-300"
              whileHover={{ 
                scale: 1.2, 
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={24} />
            </motion.a>
          );
        })}
      </motion.div>
      
      <motion.a
        href="https://saweria.co/markxplorer"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-hue-paragraph hover:text-hue-accent transition-colors duration-300 font-medium"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        whileHover={{ 
          scale: 1.05,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Heart size={20} fill="currentColor" />
        </motion.div>
        Donasi
      </motion.a>
      
      <motion.p 
        className="text-sm text-hue-paragraph text-center mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        © 2024 MarkTools. Dibuat dengan ❤️ menggunakan Next.js & Framer Motion
      </motion.p>
    </footer>
  );
};

export default Footer;