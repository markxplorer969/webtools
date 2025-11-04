'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Tool } from '@/lib/types';
import { ArrowRight, Clock } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  className?: string;
  cardRef?: (el: HTMLDivElement | null) => void;
  opacity?: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  className = '', 
  cardRef,
  opacity = 1 
}) => {
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isLive = tool.is_live;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply glare effect to live cards
    if (!isLive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x, y });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: isLive ? opacity : opacity * 0.5, // Reduce opacity for coming soon cards
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const getLayoutClasses = () => {
    // Layout sizes only apply on desktop (md: and above)
    switch (tool.layout_size) {
      case '2x1':
        return 'md:col-span-2 row-span-1';
      case '1x2':
        return 'md:col-span-1 row-span-2';
      case '2x2':
        return 'md:col-span-2 row-span-2';
      default:
        return 'md:col-span-1 row-span-1';
    }
  };

  const CardContent = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={isLive ? { y: -5 } : {}} // Only hover effect for live cards
      className={`
        glass rounded-2xl p-4 md:p-6 h-full relative overflow-hidden
        transition-all duration-300 group
        ${!isLive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${getLayoutClasses()}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(68, 68, 68, 0.5)',
        opacity: isLive ? opacity : opacity * 0.5
      }}
    >
      {/* Glare Effect - Only for Live Cards */}
      {isLive && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.04) 0%, transparent 50%)`
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isLive ? 'group-hover:scale-110' : ''}`} style={{ backgroundColor: '#888888' }}>
            <tool.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#121212' }} />
          </div>
          
          {!isLive && (
            <div className="px-2 py-1 md:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1" style={{ backgroundColor: 'rgba(68, 68, 68, 0.3)', color: '#B0B0B0' }}>
              <Clock className="w-3 h-3" style={{ color: '#B0B0B0' }} />
              <span className="hidden sm:inline" style={{ color: '#B0B0B0' }}>Segera Hadir</span>
              <span className="sm:hidden" style={{ color: '#B0B0B0' }}>Soon</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-grow">
          <h3 className={`text-lg md:text-xl font-heading font-semibold mb-2 md:mb-3 ${isLive ? 'group-hover:text-accent' : ''} transition-colors duration-200`} style={{ color: '#E0E0E0' }}>
            {tool.name}
          </h3>
          
          <p className="text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3" style={{ color: '#B0B0B0' }}>
            {tool.description}
          </p>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
              {tool.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: isLive ? 'rgba(136, 136, 136, 0.1)' : 'rgba(68, 68, 68, 0.1)',
                    color: isLive ? '#888888' : '#B0B0B0'
                  }}
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 2 && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: isLive ? 'rgba(136, 136, 136, 0.1)' : 'rgba(68, 68, 68, 0.1)',
                    color: isLive ? '#888888' : '#B0B0B0'
                  }}
                >
                  +{tool.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
          <span className="text-xs font-medium" style={{ color: '#888888' }}>
            {tool.category}
          </span>
          
          {isLive ? (
            <div className="flex items-center space-x-1 md:space-x-2 group-hover:translate-x-1 transition-transform duration-200">
              <span className="text-xs font-medium hidden sm:inline" style={{ color: '#888888' }}>
                Buka Tool
              </span>
              <span className="text-xs font-medium sm:hidden" style={{ color: '#888888' }}>
                Buka
              </span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-colors duration-200" style={{ color: '#888888' }} />
            </div>
          ) : (
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-xs font-medium hidden sm:inline" style={{ color: '#B0B0B0' }}>
                Coming Soon
              </span>
              <span className="text-xs font-medium sm:hidden" style={{ color: '#B0B0B0' }}>
                Soon
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Wrap with Link only if tool is live
  if (tool.is_live && tool.url) {
    return (
      <Link href={tool.url} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default ToolCard;