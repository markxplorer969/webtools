'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KolomGenerikProps {
  dataKolom: {
    id: string;
    name: string;
    type: 'Textarea';
    content: string;
  };
  updateKonten: (kolomId: string, newContent: string) => void;
  updateNama: (kolomId: string, newName: string) => void;
  hapusKolom: (kolomId: string) => void;
}

export default function KolomGenerik({ 
  dataKolom, 
  updateKonten, 
  updateNama, 
  hapusKolom 
}: KolomGenerikProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(dataKolom.name);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle nama edit
  const handleNameClick = () => {
    setIsEditingName(true);
    setTempName(dataKolom.name);
  };

  const handleNameBlur = () => {
    if (tempName.trim() && tempName !== dataKolom.name) {
      updateNama(dataKolom.id, tempName.trim());
    } else {
      setTempName(dataKolom.name);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setTempName(dataKolom.name);
      setIsEditingName(false);
    }
  };

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateKonten(dataKolom.id, e.target.value);
  };

  // Auto resize textarea
  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-80 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col"
      style={{ minHeight: '400px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-750 border-b border-gray-700">
        {/* Nama Kolom (Editable) */}
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="w-full px-2 py-1 text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <h3
              onClick={handleNameClick}
              className="text-sm font-medium text-white truncate cursor-pointer hover:text-blue-400 transition-colors"
              title="Klik untuk edit nama"
            >
              {dataKolom.name}
            </h3>
          )}
        </div>
        
        {/* Tombol Hapus */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => hapusKolom(dataKolom.id)}
          className="ml-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-1 h-6 w-6"
          title="Hapus kolom"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Body - Textarea */}
      <div className="flex-1 p-3">
        <textarea
          ref={textareaRef}
          value={dataKolom.content}
          onChange={handleContentChange}
          onInput={handleTextareaResize}
          placeholder="Ketik catatan Anda di sini..."
          className="w-full h-full min-h-[300px] p-3 text-sm text-gray-200 bg-gray-900 border border-gray-700 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          style={{ minHeight: '300px' }}
        />
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-gray-750 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{dataKolom.content.length} karakter</span>
          <span>{dataKolom.content.split('\n').length} baris</span>
        </div>
      </div>
    </motion.div>
  );
}