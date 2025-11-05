'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface ItemProps {
  dataItem: {
    uid: string;
    status: 'Live' | 'Dead' | 'Dupe' | 'Error';
  };
}

export default function Item({ dataItem }: ItemProps) {
  // Style Bersyarat (Permintaan Anda)
  const getBorderClass = () => {
    switch (dataItem.status) {
      case 'Dead':
        return 'border-red-500 bg-red-900/20';
      case 'Dupe':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'Live':
        return 'border-green-500 bg-green-900/20';
      case 'Error':
        return 'border-orange-500 bg-orange-900/20';
      default:
        return 'border-gray-600 bg-gray-800/50';
    }
  };

  const getIcon = () => {
    switch (dataItem.status) {
      case 'Live':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'Dead':
        return <XCircle className="w-3 h-3 text-red-400" />;
      case 'Dupe':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'Error':
        return <AlertCircle className="w-3 h-3 text-orange-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (dataItem.status) {
      case 'Live':
        return 'text-green-400';
      case 'Dead':
        return 'text-red-400';
      case 'Dupe':
        return 'text-yellow-400';
      case 'Error':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center justify-between p-2 rounded border text-xs
        hover:shadow-sm transition-all duration-200 cursor-pointer
        ${getBorderClass()}
      `}
    >
      {/* UID */}
      <div className="flex-1 min-w-0">
        <span className="text-gray-200 font-mono truncate block">
          {dataItem.uid}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
        {getIcon()}
        <span className={`font-medium ${getStatusColor()}`}>
          {dataItem.status}
        </span>
      </div>
    </motion.div>
  );
}