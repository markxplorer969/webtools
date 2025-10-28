'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'react-icons/fa'; // Import all icons from react-icons

const ToolCard = ({ title, description, iconName, slug }) => {
  // Get the icon component dynamically
  const IconComponent = Icons[iconName] || Icons.FaTools; // Fallback to FaTools if icon not found

  return (
    <Link href={`/tools/${slug}`}>
      <motion.div
        className="bg-white border border-hue-stroke rounded-lg shadow-sm p-4 transition-all cursor-pointer"
        whileHover={{
          scale: 1.03,
          y: -5,
          boxShadow: '0 10px 15px -3px rgba(245, 130, 174, 0.3)'
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <IconComponent 
              size={24} 
              className="text-hue-accent" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-hue-text mb-2">
              {title}
            </h3>
            <p className="text-sm text-hue-paragraph line-clamp-3">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ToolCard;