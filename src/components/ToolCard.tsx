'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tool } from '@/lib/toolsData';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = tool.icon;
  const isActive = tool.slug !== undefined;

  const CardContent = () => (
    <motion.div
      whileHover={{ 
        opacity: isActive ? 0.8 : 1,
        y: isActive ? -4 : 0,
        transition: { duration: 0.2 }
      }}
      className={`relative bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/15 transition-all duration-200 p-6 rounded-lg h-full flex flex-col group glare-effect ${
        isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
      }`}
    >
      {/* Badge */}
      <span className={`absolute top-3 right-3 backdrop-blur-md border text-xs font-bold py-1 px-2 rounded-full z-10 ${
        isActive 
          ? 'bg-green-500/20 border-green-500/30 text-green-400' 
          : 'bg-white/10 border-white/20 text-white/80'
      }`}>
        {isActive ? 'Aktif' : 'Segera Hadir'}
      </span>

      {/* Hover overlay effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Konten Kartu */}
      <div className="flex flex-col items-center text-center flex-grow relative z-10">
        <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
          <IconComponent className={`w-12 h-12 ${isActive ? 'text-electric-blue' : 'text-electric-blue opacity-80'}`} />
        </div>
        <h3 className="text-xl font-heading font-semibold text-off-white mb-2">
          {tool.name}
        </h3>
        <p className="text-neutral-grey text-sm leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Subtle border effect on hover */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-white/30 transition-all duration-300" />
      )}
    </motion.div>
  );

  if (isActive) {
    return (
      <Link href={`/tool/${tool.slug}`}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}