'use client';

import Link from 'next/link';
import { Tool } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

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
  const CardContent = () => (
    <div
      className={`
        glass rounded-2xl p-6 h-full relative overflow-hidden
        cursor-pointer
        ${className}
      `}
      ref={cardRef}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(136, 136, 136, 0.5)',
        opacity: opacity,
        minHeight: '280px'
      }}
    >
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#888888' }}>
            <tool.icon className="w-6 h-6" style={{ color: '#121212' }} />
          </div>
        </div>

        {/* Body */}
        <div className="flex-grow flex flex-col">
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-3" style={{ color: '#E0E0E0' }}>
            {tool.name}
          </h3>
          
          <p className="text-sm leading-relaxed mb-4 line-clamp-3 flex-grow" style={{ color: '#B0B0B0' }}>
            {tool.description}
          </p>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'rgba(136, 136, 136, 0.15)',
                    color: '#888888',
                    border: '1px solid rgba(136, 136, 136, 0.2)'
                  }}
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'rgba(136, 136, 136, 0.15)',
                    color: '#888888',
                    border: '1px solid rgba(136, 136, 136, 0.2)'
                  }}
                >
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'rgba(68, 68, 68, 0.3)' }}>
          <span className="text-xs font-medium px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(136, 136, 136, 0.1)', color: '#888888' }}>
            {tool.category}
          </span>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium" style={{ color: '#888888' }}>
              Buka Tool
            </span>
            <ArrowRight className="w-4 h-4" style={{ color: '#888888' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={tool.url} className="block h-full">
      <CardContent />
    </Link>
  );
};

export default ToolCard;