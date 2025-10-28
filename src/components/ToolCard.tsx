'use client';

import { motion } from 'framer-motion';
import { Tool } from '@/lib/toolsData';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = tool.icon;

  return (
    <motion.div
      whileHover={{ 
        opacity: 0.8,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="relative bg-dark-grey p-6 rounded-lg h-full opacity-60 cursor-not-allowed flex flex-col group"
    >
      {/* Badge "Coming Soon" */}
      <span className="absolute top-3 right-3 bg-neutral-grey text-dark-charcoal text-xs font-bold py-1 px-2 rounded-full z-10">
        Segera Hadir
      </span>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Konten Kartu */}
      <div className="flex flex-col items-center text-center flex-grow relative z-10">
        <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
          <IconComponent className="w-12 h-12 text-electric-blue opacity-80" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-off-white mb-2">
          {tool.name}
        </h3>
        <p className="text-neutral-grey text-sm leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Subtle border effect on hover */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-electric-blue/30 transition-all duration-300" />
    </motion.div>
  );
}