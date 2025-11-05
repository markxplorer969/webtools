'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Copy, 
  Filter, 
  Play, 
  X,
  Trash2,
  Download,
  Eye,
  EyeOff,
  DatabaseZap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { usePersistentState } from '@/lib/hooks/usePersistentState';
import { toast } from 'sonner';

// Interface untuk tipe data
interface Header {
  id: string;
  name: string;
}

interface Row {
  id: string;
  cols: { [key: string]: string };
  status: 'default' | 'live' | 'dead' | 'dupe' | 'error';
}

// Default Headers
const DEFAULT_HEADERS: Header[] = [
  { id: 'A', name: 'Profil FB (UID/Link)' },
  { id: 'B', name: 'Kolom B' },
  { id: 'C', name: 'Kolom C' },
  { id: 'D', name: 'Kolom D' },
];

// Default Rows
const DEFAULT_ROWS: Row[] = [
  { id: 'row1', cols: { A: '', B: '', C: '', D: '' }, status: 'default' },
  { id: 'row2', cols: { A: '', B: '', C: '', D: '' }, status: 'default' },
  { id: 'row3', cols: { A: '', B: '', C: '', D: '' }, status: 'default' },
];

export default function TempNotes() {
  // State Management dengan Persistent State (Pilar 21)
  const [headers, setHeaders] = usePersistentState<Header[]>('tempnotes_headers', DEFAULT_HEADERS);
  const [rows, setRows] = usePersistentState<Row[]>('tempnotes_rows', DEFAULT_ROWS);
  const [isChecking, setIsChecking] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
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
    const newKolomId = String.fromCharCode(65 + headers.length); // A, B, C, ...
    const newHeader: Header = {
      id: newKolomId,
      name: `Kolom ${newKolomId}`
    };
    
    // Update headers
    setHeaders([...headers, newHeader]);
    
    // Update rows dengan kolom baru
    const updatedRows = rows.map(row => ({
      ...row,
      cols: { ...row.cols, [newKolomId]: '' }
    }));
    setRows(updatedRows);
    
    toast.success('Kolom berhasil ditambahkan');
  };

  // Handle Tambah Baris
  const handleAddBaris = () => {
    const newBarisId = `row${Date.now()}`;
    const newCols: { [key: string]: string } = {};
    
    // Inisialisasi kolom untuk baris baru
    headers.forEach(header => {
      newCols[header.id] = '';
    });
    
    const newRow: Row = {
      id: newBarisId,
      cols: newCols,
      status: 'default'
    };
    
    setRows([...rows, newRow]);
    toast.success('Baris berhasil ditambahkan');
  };

  // Handle Update Cell Content
  const handleCellChange = (rowId: string, colId: string, value: string) => {
    const updatedRows = rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          cols: { ...row.cols, [colId]: value }
        };
      }
      return row;
    });
    setRows(updatedRows);
  };

  // Handle Update Header Name
  const handleHeaderChange = (headerId: string, newName: string) => {
    const updatedHeaders = headers.map(header => {
      if (header.id === headerId) {
        return { ...header, name: newName };
      }
      return header;
    });
    setHeaders(updatedHeaders);
  };

  // Handle Hapus Baris
  const handleHapusBaris = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
      toast.success('Baris berhasil dihapus');
    }
  };

  // Handle Hapus Kolom
  const handleHapusKolom = (headerId: string) => {
    if (headers.length > 1) {
      // Update headers
      const updatedHeaders = headers.filter(header => header.id !== headerId);
      setHeaders(updatedHeaders);
      
      // Update rows (hapus kolom dari semua baris)
      const updatedRows = rows.map(row => {
        const newCols = { ...row.cols };
        delete newCols[headerId];
        return { ...row, cols: newCols };
      });
      setRows(updatedRows);
      
      toast.success('Kolom berhasil dihapus');
    }
  };

  // Handle Hapus Duplikat (PERBAIKAN - Hanya salah satu)
  const handleHapusDuplikat = () => {
    const uidMap = new Map<string, boolean>();
    const rowsToKeep: Row[] = [];
    let removedCount = 0;
    
    // Iterasi melalui semua baris
    rows.forEach(row => {
      const uid = row.cols.A?.trim();
      
      if (!uid) {
        // Keep rows dengan empty UID
        rowsToKeep.push(row);
        return;
      }
      
      if (!uidMap.has(uid)) {
        // Pertama kali melihat UID ini, simpan barisnya
        uidMap.set(uid, true);
        rowsToKeep.push(row);
      } else {
        // UID sudah ada sebelumnya, ini adalah duplikat, hapus
        removedCount++;
      }
    });
    
    setRows(rowsToKeep);
    
    if (removedCount > 0) {
      toast.success(`${removedCount} baris duplikat dihapus. 1 baris disimpan untuk setiap UID.`);
    } else {
      toast.info('Tidak ada duplikat yang ditemukan.');
    }
  };

  // Handle Cek Duplikat (BARU - Pilar 23)
  const handleCekDuplikat = () => {
    const uidMap = new Map<string, Row[]>();
    
    // Group rows by UID di kolom A
    rows.forEach(row => {
      const uid = row.cols.A?.trim();
      if (uid) {
        if (!uidMap.has(uid)) {
          uidMap.set(uid, []);
        }
        uidMap.get(uid)!.push(row);
      }
    });
    
    // Update status untuk duplikat
    const updatedRows = rows.map(row => {
      const uid = row.cols.A?.trim();
      if (uid && uidMap.get(uid)!.length > 1) {
        return { ...row, status: 'dupe' };
      }
      return row;
    });
    
    setRows(updatedRows);
    toast.success('Duplikat ditandai.');
  };

  // Handle Hapus Dead (BARU)
  const handleHapusDead = () => {
    const rowsBersih = rows.filter(row => row.status !== 'dead');
    setRows(rowsBersih);
    toast.success('Baris \'Dead\' dihapus.');
  };

  // Handle Clear All
  const handleClearAll = () => {
    setRows(DEFAULT_ROWS);
    setHeaders(DEFAULT_HEADERS);
    setProcessedCount(0);
    setTotalCount(0);
    toast.success('Semua data berhasil dihapus');
  };

  // Handle Salin All (Excel Format)
  const handleSalinAll = () => {
    let content = '';
    
    // Add headers
    content += headers.map(h => h.name).join('\t') + '\n';
    
    // Add rows
    rows.forEach(row => {
      const rowData = headers.map(header => row.cols[header.id] || '').join('\t');
      content += rowData + '\t' + row.status + '\n';
    });
    
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Data berhasil disalin ke clipboard');
    });
  };

  // Handle Export Excel
  const handleExportExcel = () => {
    let csvContent = '';
    
    // Add headers
    csvContent += headers.map(h => h.name).join(',') + ',Status\n';
    
    // Add rows
    rows.forEach(row => {
      const rowData = headers.map(header => {
        const cell = row.cols[header.id] || '';
        // Escape commas and quotes in CSV
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += rowData + ',' + row.status + '\n';
    });
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tempnotes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('File CSV berhasil diunduh');
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

  // Handle Cek Status FB
  const handleCekStatusFB = async () => {
    // Extract UIDs dari kolom A
    const allUids: string[] = [];
    rows.forEach(row => {
      if (row.cols.A?.trim()) {
        const uids = extractUids(row.cols.A);
        allUids.push(...uids);
      }
    });

    if (allUids.length === 0) {
      toast.error('Tidak ada UID yang ditemukan di kolom A');
      return;
    }

    setIsChecking(true);
    processingRef.current = true;
    setProcessedCount(0);
    setTotalCount(allUids.length);
    
    // Reset status
    const resetRows = rows.map(row => ({ ...row, status: 'default' }));
    setRows(resetRows);
    
    queueRef.current = allUids;
    
    // Mulai proses batch
    await processBatch();
  };

  // Process Batch - Frontend "Kabel"
  const processBatch = async () => {
    if (!processingRef.current || queueRef.current.length === 0) {
      setIsChecking(false);
      return;
    }

    const batchSize = 10; // Process 10 UIDs at a time
    const batch = queueRef.current.splice(0, batchSize);

    try {
      // Panggilan API: fetch('/api/check-facebook-uid', ...)
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

      // Umpan Balik: Update state rows
      const updatedRows = rows.map(row => {
        if (!row.cols.A?.trim()) return row;
        
        const rowUids = extractUids(row.cols.A);
        const matchingResult = results.find(result => 
          rowUids.includes(result.uid)
        );
        
        if (matchingResult) {
          return {
            ...row,
            status: matchingResult.status.toLowerCase() as 'live' | 'dead' | 'error'
          };
        }
        
        return row;
      });

      setRows(updatedRows);
      setProcessedCount(prev => prev + batch.length);

      // Lanjutkan batch berikutnya
      if (queueRef.current.length > 0 && processingRef.current) {
        setTimeout(() => processBatch(), 100);
      } else {
        setIsChecking(false);
        toast.success('Pemeriksaan selesai!');
      }

    } catch (error) {
      console.error('Batch processing error:', error);
      
      // Lanjutkan ke batch berikutnya meskipun error
      if (queueRef.current.length > 0 && processingRef.current) {
        setTimeout(() => processBatch(), 100);
      } else {
        setIsChecking(false);
        toast.error('Terjadi error saat memeriksa status');
      }
    }
  };

  // Get row styling based on status
  const getRowStyle = (status: string) => {
    switch (status) {
      case 'live':
        return 'border-l-4 border-l-green-500 bg-green-900/10';
      case 'dead':
        return 'border-l-4 border-l-red-500 bg-red-900/10';
      case 'dupe':
        return 'border-l-4 border-l-yellow-500 bg-yellow-900/10';
      case 'error':
        return 'border-l-4 border-l-orange-500 bg-orange-900/10';
      default:
        return 'border-l-4 border-l-accent/30 bg-accent/5';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <DatabaseZap className="w-8 h-8 text-accent" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">
            TempNotes Spreadsheet
          </h1>
        </div>
        <p className="text-secondary-text max-w-2xl mx-auto">
          Notes cepat DENGAN checker FB UID Live/Dead dan deteksi duplikat terintegrasi.
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
          
          <div className="relative z-10">
            {/* Progress Bar untuk checking */}
            {isChecking && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-primary-text">Memeriksa Status FB...</span>
                  <span className="text-sm text-accent font-semibold">
                    {processedCount}/{totalCount}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(processedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
            
            {/* Tombol Primer */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Button
                onClick={handleCekStatusFB}
                disabled={isChecking}
                className="bg-accent hover:bg-secondary-text text-dark-charcoal font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                {isChecking ? 'Memeriksa...' : 'Cek Status FB'}
              </Button>
              
              {/* Tombol "Merah" (Destruktif) */}
              <Button
                onClick={handleHapusDuplikat}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10 font-semibold"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Hapus Duplikat
              </Button>
              
              <Button
                onClick={handleHapusDead}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10 font-semibold"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Hapus Dead
              </Button>
              
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10 font-semibold"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            {/* Tombol Sekunder */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleAddKolom}
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent/10 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kolom
              </Button>
              
              <Button
                onClick={handleAddBaris}
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent/10 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Baris
              </Button>
              
              <Button
                onClick={handleSalinAll}
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent/10 font-semibold"
              >
                <Copy className="w-4 h-4 mr-2" />
                Salin All
              </Button>
              
              <Button
                onClick={handleExportExcel}
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent/10 font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
            
            {/* Tombol Tersier */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                onClick={handleCekDuplikat}
                variant="ghost"
                size="sm"
                className="text-secondary-text hover:text-primary-text font-medium"
              >
                <Filter className="w-4 h-4 mr-2" />
                Cek Duplikat
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Area Spreadsheet (Pilar 5) */}
      <div className="px-4 pb-8">
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `40px repeat(${headers.length}, 1fr) 60px 40px` }}>
                <div className="text-center text-xs text-secondary-text font-semibold">#</div>
                {headers.map((header) => (
                  <div key={header.id} className="relative group">
                    <input
                      type="text"
                      value={header.name}
                      onChange={(e) => handleHeaderChange(header.id, e.target.value)}
                      className="w-full px-2 py-1 bg-gray-800/50 text-primary-text text-sm font-semibold border border-divider rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {/* Tombol Hapus Kolom - Hanya untuk kolom selain A */}
                    {header.id !== 'A' && (
                      <button
                        onClick={() => handleHapusKolom(header.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-700"
                        title="Hapus Kolom"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="text-center text-xs text-secondary-text font-semibold">Status</div>
                <div className="text-center text-xs text-secondary-text font-semibold">Aksi</div>
              </div>
              
              {/* Data Rows */}
              {rows.map((row, index) => (
                <div 
                  key={row.id}
                  className={`grid gap-2 mb-2 p-2 rounded transition-all duration-200 ${getRowStyle(row.status)}`}
                  style={{ gridTemplateColumns: `40px repeat(${headers.length}, 1fr) 60px 40px` }}
                >
                  <div className="text-center text-sm text-secondary-text flex items-center justify-center">
                    {index + 1}
                  </div>
                  {headers.map((header) => (
                    <div key={`${row.id}-${header.id}`} className="relative group">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleCellChange(row.id, header.id, e.currentTarget.textContent || '')}
                        className="w-full px-2 py-1 bg-gray-800/50 text-primary-text text-sm border border-divider rounded focus:outline-none focus:ring-2 focus:ring-accent min-h-[32px] whitespace-pre-wrap"
                      >
                        {row.cols[header.id] || ''}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center">
                    {row.status === 'live' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {row.status === 'dead' && <XCircle className="w-4 h-4 text-red-500" />}
                    {row.status === 'dupe' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    {row.status === 'error' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    {row.status === 'default' && <div className="w-4 h-4 bg-accent/50 rounded-full" />}
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleHapusBaris(row.id)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all duration-200"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}