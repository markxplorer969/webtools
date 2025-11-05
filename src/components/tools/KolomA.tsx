'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Item from './Item';

interface RichItem {
  uid: string;
  status: 'Live' | 'Dead' | 'Dupe' | 'Error';
}

interface KolomAProps {
  dataKolom: {
    id: string;
    name: string;
    type: 'RichList';
    content: {
      input?: string;
      results?: RichItem[];
    };
  };
  updateKonten: (kolomId: string, newContent: any) => void;
  updateNama: (kolomId: string, newName: string) => void;
  hapusKolom: (kolomId: string) => void;
}

export default function KolomA({ 
  dataKolom, 
  updateKonten, 
  updateNama, 
  hapusKolom 
}: KolomAProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ensure content structure exists
  const content = {
    input: dataKolom.content?.input || '',
    results: dataKolom.content?.results || []
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateKonten(dataKolom.id, {
      ...content,
      input: e.target.value
    });
  };

  // Auto resize input textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content.input]);

  // Auto scroll to bottom when new results are added
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  }, [content.results]);

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      Live: 0,
      Dead: 0,
      Dupe: 0,
      Error: 0
    };

    content.results.forEach((item: RichItem) => {
      if (item.status in counts) {
        counts[item.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-96 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col"
      style={{ minHeight: '500px' }}
    >
      {/* Header - Terkunci: "Input & Hasil Facebook" */}
      <div className="flex items-center justify-between p-3 bg-gray-750 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-medium text-white">
            {dataKolom.name}
          </h3>
        </div>
        
        {/* Status Counts */}
        <div className="flex items-center space-x-2 text-xs">
          {statusCounts.Live > 0 && (
            <span className="text-green-400">{statusCounts.Live}</span>
          )}
          {statusCounts.Dead > 0 && (
            <span className="text-red-400">{statusCounts.Dead}</span>
          )}
          {statusCounts.Dupe > 0 && (
            <span className="text-yellow-400">{statusCounts.Dupe}</span>
          )}
          {statusCounts.Error > 0 && (
            <span className="text-orange-400">{statusCounts.Error}</span>
          )}
        </div>
      </div>

      {/* Body - Layout Baru */}
      <div className="flex-1 flex flex-col p-3 space-y-3">
        {/* Textarea Input di Atas */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Input UID (Paste di sini)
          </label>
          <textarea
            ref={textareaRef}
            value={content.input}
            onChange={handleInputChange}
            placeholder="Paste UID atau link Facebook di sini..."
            className="w-full h-24 p-2 text-xs text-gray-200 bg-gray-900 border border-gray-700 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        {/* Area Hasil - Scrollable */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">
              Hasil Pemeriksaan ({content.results.length} items)
            </label>
            {content.results.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateKonten(dataKolom.id, { ...content, results: [] })}
                className="text-xs text-gray-500 hover:text-red-400 p-1 h-4"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div 
            ref={resultsRef}
            className="flex-1 overflow-y-auto space-y-1 p-2 bg-gray-900 border border-gray-700 rounded-md"
            style={{ minHeight: '200px' }}
          >
            {content.results.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                <div className="text-center">
                  <div className="mb-2">📋</div>
                  <p>Belum ada hasil</p>
                  <p className="text-gray-600 mt-1">Paste UID dan klik "Mulai Cek"</p>
                </div>
              </div>
            ) : (
              content.results.map((item: RichItem, index: number) => (
                <Item
                  key={`${item.uid}-${index}`}
                  dataItem={item}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-gray-750 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Input: {content.input.length} karakter</span>
          <span>Results: {content.results.length} items</span>
        </div>
      </div>
    </motion.div>
  );
}