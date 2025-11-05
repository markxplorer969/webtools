'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Copy, 
  Filter, 
  Play, 
  X,
  DatabaseZap
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { usePersistentState } from '@/lib/hooks/usePersistentState';
import KolomA from './KolomA';
import KolomGenerik from './KolomGenerik';

// Interface untuk tipe data kolom
interface KolomData {
  id: string;
  name: string;
  type: 'RichList' | 'Textarea';
  content: any; // RichList: array[], Textarea: string
}

// Interface untuk item di Rich List
interface RichItem {
  uid: string;
  status: 'Live' | 'Dead' | 'Dupe' | 'Error';
}

// Data Default dengan 3 kolom preset
const DEFAULT_KOLOM: KolomData[] = [
  {
    id: 'A',
    name: 'Input & Hasil Facebook',
    type: 'RichList',
    content: []
  },
  {
    id: 'B',
    name: 'Catatan 1',
    type: 'Textarea',
    content: ''
  },
  {
    id: 'C',
    name: 'Catatan 2',
    type: 'Textarea',
    content: ''
  }
];

export default function DataScratchpad() {
  // State Utama dengan Persistent State (Pilar 21)
  const [kolom, setKolom] = usePersistentState<KolomData[]>('scratchpad_kolom', DEFAULT_KOLOM);
  const [isProcessing, setIsProcessing] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  
  const processingRef = useRef(false);
  const queueRef = useRef<string[]>([]);

  // Handle glare effect untuk glassmorphism
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlarePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setGlarePosition({ x: -100, y: -100 });
  };

  // Handle Tambah Kolom
  const handleAddKolom = () => {
    const newKolomId = String.fromCharCode(65 + kolom.length); // A, B, C, ...
    const newKolom: KolomData = {
      id: newKolomId,
      name: `Catatan ${newKolomId}`,
      type: 'Textarea',
      content: ''
    };
    setKolom([...kolom, newKolom]);
  };

  // Handle Salin All (Excel Format)
  const handleSalinAll = () => {
    let allContent = '';
    
    kolom.forEach((k) => {
      allContent += `=== ${k.name} ===\n`;
      
      if (k.type === 'RichList' && Array.isArray(k.content)) {
        k.content.forEach((item: RichItem) => {
          allContent += `${item.uid}\t${item.status}\n`;
        });
      } else {
        allContent += k.content + '\n';
      }
      
      allContent += '\n';
    });

    if (typeof window !== 'undefined' && 'navigator' in window && navigator.clipboard) {
      navigator.clipboard.writeText(allContent).then(() => {
        // Toast notification bisa ditambahkan di sini
        console.log('All data copied to clipboard!');
      });
    }
  };

  // Handle Bersihkan Duplikat
  const handleBersihkanDuplikat = () => {
    const cleanedKolom = kolom.map(k => {
      if (k.type === 'RichList' && Array.isArray(k.content)) {
        // Bersihkan duplikat untuk Rich List
        const uniqueItems = Array.from(
          new Map(k.content.map((item: RichItem) => [item.uid, item])).values()
        );
        return { ...k, content: uniqueItems };
      } else if (k.type === 'Textarea') {
        // Bersihkan duplikat untuk Textarea
        const lines = k.content.split('\n').filter(line => line.trim());
        const uniqueLines = Array.from(new Set(lines));
        return { ...k, content: uniqueLines.join('\n') };
      }
      return k;
    });

    setKolom(cleanedKolom);
    console.log('Duplikat dibersihkan.'); // Toast notification
  };

  // Handle Mulai Cek (Kolom A)
  const handleMulaiCek = async () => {
    const kolomA = kolom.find(k => k.id === 'A');
    if (!kolomA) return;

    // Ambil data dari textarea input di Kolom A
    const inputText = kolomA.content.input || '';
    if (!inputText.trim()) {
      console.log('Masukkan UID terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    processingRef.current = true;

    // Ekstraksi Link Otomatis (Regex)
    const extractedUids = extractUids(inputText);
    queueRef.current = extractedUids;

    // Update Kolom A content untuk menampilkan proses
    const updatedKolomA = { 
      ...kolomA, 
      content: {
        ...kolomA.content,
        results: []
      }
    };
    setKolom(kolom.map(k => k.id === 'A' ? updatedKolomA : k));

    // Mulai proses batch
    await processBatch();
  };

  // Ekstraksi UID dengan Regex
  const extractUids = (text: string): string[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const uids: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Cek profile.php?id=
      const profileMatch = trimmedLine.match(/profile\.php\?id=([0-9]+)/i);
      if (profileMatch) {
        uids.push(profileMatch[1]);
      } else {
        // Cek facebook.com/username
        const facebookMatch = trimmedLine.match(/facebook\.com\/([a-zA-Z0-9.]+)/i);
        if (facebookMatch) {
          uids.push(facebookMatch[1]);
        } else {
          // Ambil seluruh baris jika numeric
          if (/^\d+$/.test(trimmedLine)) {
            uids.push(trimmedLine);
          }
        }
      }
    });

    return Array.from(new Set(uids)); // Remove duplicates
  };

  // Process Batch - Frontend "Kabel"
  const processBatch = async () => {
    if (!processingRef.current || queueRef.current.length === 0) {
      setIsProcessing(false);
      return;
    }

    const batchSize = 10; // Process 10 UIDs at a time
    const batch = queueRef.current.splice(0, batchSize);

    try {
      // Panggilan API: fetch('/api/check-uid', ...)
      const promises = batch.map(async (uid) => {
        const response = await fetch('/api/check-facebook-uid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        });

        if (!response.ok) {
          throw new Error(`API request failed for ${uid}`);
        }

        return response.json();
      });

      // Execute all promises in parallel
      const results = await Promise.all(promises);

      // Umpan Balik: Update state kolom
      const kolomA = kolom.find(k => k.id === 'A');
      if (kolomA) {
        const newResults = results.map(result => ({
          uid: result.uid,
          status: result.status
        }));

        const updatedKolomA = {
          ...kolomA,
          content: {
            ...kolomA.content,
            results: [...(kolomA.content.results || []), ...newResults]
          }
        };

        setKolom(kolom.map(k => k.id === 'A' ? updatedKolomA : k));
      }

      // Lanjutkan batch berikutnya
      if (queueRef.current.length > 0 && processingRef.current) {
        setTimeout(() => processBatch(), 100);
      } else {
        setIsProcessing(false);
        console.log('Proses selesai!');
      }

    } catch (error) {
      console.error('Batch processing error:', error);
      
      // Lanjutkan ke batch berikutnya meskipun error
      if (queueRef.current.length > 0 && processingRef.current) {
        setTimeout(() => processBatch(), 100);
      } else {
        setIsProcessing(false);
      }
    }
  };

  // Update konten kolom
  const updateKonten = (kolomId: string, newContent: any) => {
    setKolom(kolom.map(k => 
      k.id === kolomId ? { ...k, content: newContent } : k
    ));
  };

  // Update nama kolom
  const updateNama = (kolomId: string, newName: string) => {
    setKolom(kolom.map(k => 
      k.id === kolomId ? { ...k, name: newName } : k
    ));
  };

  // Hapus kolom
  const hapusKolom = (kolomId: string) => {
    if (kolom.length > 1) { // Minimal 1 kolom
      setKolom(kolom.filter(k => k.id !== kolomId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <DatabaseZap className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Data Scratchpad
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Catatan sementara dengan fitur transformasi data yang powerful.
        </p>
      </div>

      {/* Panel Kontrol Global (Sticky) - Pilar 5, 7, 9 */}
      <div className="sticky top-16 z-10 px-4 pb-4">
        <GlassCard 
          className="p-4"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glare Layer */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
            }}
          />
          
          <div className="relative z-10 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* Tombol Sekunder */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddKolom}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kolom
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSalinAll}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Salin All (Excel)
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBersihkanDuplikat}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                Bersihkan Duplikat
              </Button>
            </div>
            
            {/* Tombol Primer */}
            <Button
              onClick={handleMulaiCek}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {isProcessing ? 'Memproses...' : 'Mulai Cek (Kolom A)'}
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Area Kolom (Horizontal Scroll) - Pilar 10 */}
      <div className="px-4 pb-8">
        <div className="flex overflow-x-auto gap-4 p-4 min-h-[600px]">
          {kolom.map((dataKolom) => (
            <motion.div
              key={dataKolom.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              {/* Render Bersyarat - Pilar 10 */}
              {dataKolom.type === 'RichList' ? (
                <KolomA
                  dataKolom={dataKolom}
                  updateKonten={updateKonten}
                  updateNama={updateNama}
                  hapusKolom={hapusKolom}
                />
              ) : (
                <KolomGenerik
                  dataKolom={dataKolom}
                  updateKonten={updateKonten}
                  updateNama={updateNama}
                  hapusKolom={hapusKolom}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}