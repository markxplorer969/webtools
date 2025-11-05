'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Play, 
  Square, 
  Trash2, 
  Copy, 
  Users, 
  UserX, 
  AlertTriangle, 
  RefreshCw,
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { audioFeedback } from '@/lib/audioFeedback';
import { usePersistentState } from '@/lib/hooks/usePersistentState';

interface Counters {
  total: number;
  live: number;
  dead: number;
  duplicate: number;
  error: number;
}

const FacebookUidChecker = () => {
  // State Management dengan Persistent State
  const [rawInput, setRawInput] = usePersistentState<string>('fb_rawInput', '');
  const [speed, setSpeed] = usePersistentState<number>('fb_speed', 25);
  const [isChecking, setIsChecking] = useState(false);
  const [liveList, setLiveList] = usePersistentState<string[]>('fb_liveList', []);
  const [deadList, setDeadList] = usePersistentState<string[]>('fb_deadList', []);
  const [errorList, setErrorList] = usePersistentState<string[]>('fb_errorList', []);
  const [duplicateList, setDuplicateList] = usePersistentState<string[]>('fb_duplicateList', []);
  const [totalCount, setTotalCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [counters, setCounters] = usePersistentState<Counters>('fb_counters', {
    total: 0,
    live: 0,
    dead: 0,
    duplicate: 0,
    error: 0
  });
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Siap memeriksa UID...');
  const [isMounted, setIsMounted] = useState(false);
  
  const processingRef = useRef(false);
  const queueRef = useRef<string[]>([]);

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-ekstraksi link dan pembersihan
  const extractAndCleanUids = (input: string): string[] => {
    const lines = input.split('\n').filter(line => line.trim());
    const uniqueUids = new Set<string>();
    const duplicates: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Auto-ekstraksi link
      let extractedUid = '';
      
      // Cek profile.php?id=
      const profileMatch = trimmedLine.match(/profile\.php\?id=([0-9]+)/i);
      if (profileMatch) {
        extractedUid = profileMatch[1];
      } else {
        // Cek facebook.com/username
        const facebookMatch = trimmedLine.match(/facebook\.com\/([a-zA-Z0-9.]+)/i);
        if (facebookMatch) {
          extractedUid = facebookMatch[1];
        } else {
          // Ambil seluruh baris
          extractedUid = trimmedLine;
        }
      }

      if (extractedUid) {
        if (uniqueUids.has(extractedUid)) {
          duplicates.push(extractedUid);
        } else {
          uniqueUids.add(extractedUid);
        }
      }
    });

    setDuplicateList(duplicates);
    return Array.from(uniqueUids);
  };

  // Handle Start Check
  const handleStartCheck = async () => {
    if (!rawInput.trim()) {
      setStatusText('Masukkan UID terlebih dahulu...');
      if (audioFeedback && audioFeedback.playWarning) {
        audioFeedback.playWarning();
      }
      return;
    }

    setIsChecking(true);
    processingRef.current = true;
    
    // Play start sound
    if (audioFeedback?.playStart) {
      audioFeedback.playStart();
    }
    
    // Simpan input sebelum clear
    const currentInput = rawInput;
    
    // Clear hasil sebelumnya, tapi jangan clear input
    setLiveList([]);
    setDeadList([]);
    setErrorList([]);
    setDuplicateList([]);
    setProcessedCount(0);
    setProgress(0);
    queueRef.current = [];
    
    setStatusText('Menganalisis input...');

    // Langkah 2: Pembersihan & Ekstraksi Link
    const uniqueUids = extractAndCleanUids(currentInput);
    const duplicateCount = currentInput.split('\n').filter(line => line.trim()).length - uniqueUids.length;

    // Update counters dengan total yang benar (unique + duplicate)
    const totalInputCount = currentInput.split('\n').filter(line => line.trim()).length;
    setCounters({
      total: totalInputCount,
      live: 0,
      dead: 0,
      duplicate: duplicateCount,
      error: 0
    });
    setTotalCount(uniqueUids.length);
    queueRef.current = uniqueUids;

    // Mulai proses batching
    await processBatch();
  };

  // Process Batch - Ultra Fast Parallel Processing
  const processBatch = async () => {
    if (!processingRef.current || queueRef.current.length === 0) {
      setIsChecking(false);
      setStatusText('Selesai.');
      return;
    }

    const batchSize = Math.min(speed, queueRef.current.length);
    const batch = queueRef.current.splice(0, batchSize);
    
    setStatusText(`Mengecek ${batch.length} UID secara parallel...`);

    try {
      // "Kabel" - Parallel API calls untuk speed maksimal
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

      // Execute all promises in parallel - ini yang membuatnya super cepat!
      const results = await Promise.all(promises);

      // "Umpan Balik" - Process semua results sekaligus
      results.forEach((result) => {
        if (result.status === 'Live') {
          setLiveList(prev => [...prev, result.uid]);
          setCounters(prev => ({ ...prev, live: prev.live + 1 }));
        } else if (result.status === 'Dead') {
          setDeadList(prev => [...prev, result.uid]);
          setCounters(prev => ({ ...prev, dead: prev.dead + 1 }));
        } else {
          setErrorList(prev => [...prev, result.uid]);
          setCounters(prev => ({ ...prev, error: prev.error + 1 }));
        }
      });

      // Update progress
      const newProcessedCount = processedCount + batch.length;
      setProcessedCount(newProcessedCount);
      setProgress((newProcessedCount / totalCount) * 100);

      // Play progress sound for significant milestones
      if (newProcessedCount % 10 === 0 || newProcessedCount === totalCount) {
        audioFeedback?.playProgress();
      }

      // Looping: Lanjutkan batch berikutnya dengan delay minimal
      if (queueRef.current.length > 0 && processingRef.current) {
        // Reduced delay dari 1000ms ke 100ms untuk speed maksimal
        setTimeout(() => processBatch(), 100);
      } else {
        setIsChecking(false);
        setStatusText('Selesai!');
        
        // Play completion sound based on results
        if (counters.error > 0) {
          audioFeedback?.playError();
        } else if (counters.live === 0 && counters.dead > 0) {
          audioFeedback?.playWarning();
        } else {
          audioFeedback?.playComplete();
        }
      }

    } catch (error) {
      console.error('Batch processing error:', error);
      setErrorList(prev => [...prev, ...batch]);
      setCounters(prev => ({ ...prev, error: prev.error + batch.length }));
      
      // Play error sound
      audioFeedback?.playError();
      
      // Lanjutkan ke batch berikutnya meskipun error
      if (queueRef.current.length > 0 && processingRef.current) {
        setTimeout(() => processBatch(), 100);
      } else {
        setIsChecking(false);
        setStatusText('Selesai dengan error.');
        audioFeedback?.playError();
      }
    }
  };

  // Handle Stop
  const handleStop = () => {
    setIsChecking(false);
    processingRef.current = false;
    setStatusText('Dihentikan.');
    audioFeedback?.playWarning();
  };

  // Handle Clear - Sekarang jauh lebih sederhana dengan usePersistentState
  const handleClear = () => {
    setRawInput('');
    setLiveList([]);
    setDeadList([]);
    setErrorList([]);
    setDuplicateList([]);
    setTotalCount(0);
    setProcessedCount(0);
    setCounters({
      total: 0,
      live: 0,
      dead: 0,
      duplicate: 0,
      error: 0
    });
    setProgress(0);
    setStatusText('Siap memeriksa UID...');
    queueRef.current = [];
  };

  // Clear cache saat input berubah
  const clearCache = async () => {
    try {
      await fetch('/api/check-facebook-uid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clearCache: true }),
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  // Handle input change dengan cache invalidation
  const handleInputChange = (value: string) => {
    setRawInput(value);
    
    // Clear cache saat input berubah untuk memastikan fresh check
    if (value.trim() !== rawInput.trim()) {
      clearCache();
    }
  };

  // Copy to clipboard
  const copyToClipboard = (list: string[], type: string) => {
    const text = list.join('\n');
    if (typeof window !== 'undefined' && 'navigator' in window) {
      navigator.clipboard.writeText(text).then(() => {
        setStatusText(`Daftar ${type} disalin!`);
      }).catch(() => {
        console.error('Failed to copy to clipboard');
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Facebook className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Facebook Live UID Checker
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cek status Facebook UID secara batch. Deteksi akun aktif dan tidak aktif dengan cepat.
          </p>
        </div>

        {/* Mission Control Layout - 2 Kolom Desktop, 1 Kolom Mobile Terbalik */}
        <div className="grid md:grid-cols-2 gap-6 grid-flow-row-dense">
          {/* Kolom Output (Desktop: Kanan, Mobile: Atas) */}
          <div className="md:col-start-2 space-y-6">
            {/* Dashboard Statistik */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Statistik Pemeriksaan
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-white">{counters.total}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-900/30 border border-green-700/50">
                  <div className="text-2xl font-bold text-green-400">{counters.live}</div>
                  <div className="text-sm text-green-400">Live</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-900/30 border border-red-700/50">
                  <div className="text-2xl font-bold text-red-400">{counters.dead}</div>
                  <div className="text-sm text-red-400">Dead</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-900/30 border border-yellow-700/50">
                  <div className="text-2xl font-bold text-yellow-400">{counters.duplicate}</div>
                  <div className="text-sm text-yellow-400">Duplikat</div>
                </div>
              </div>
            </GlassCard>

            {/* Progress Section - Enhanced */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Status Pemeriksaan
                </h3>
                <div className="flex items-center space-x-2">
                  {isChecking && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                  <span className="text-sm text-gray-400">
                    {processedCount}/{totalCount}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar dengan visual enhancement */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-blue-400">{Math.round(progress)}%</span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {progress > 0 && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Progress indicators */}
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">0%</span>
                    <span className="text-xs text-gray-500">25%</span>
                    <span className="text-xs text-gray-500">50%</span>
                    <span className="text-xs text-gray-500">75%</span>
                    <span className="text-xs text-gray-500">100%</span>
                  </div>
                </div>
              </div>
              
              {/* Status Text dengan animasi */}
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-2">
                  {isChecking ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : progress === 100 ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  )}
                  <span className={`text-sm ${
                    isChecking ? 'text-blue-400' : 
                    progress === 100 ? 'text-green-400' : 
                    'text-gray-400'
                  }`}>
                    {statusText}
                  </span>
                </div>
              </div>
              
              {/* Quick Stats */}
              {totalCount > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <div className="text-lg font-bold text-green-400">{counters.live}</div>
                    <div className="text-xs text-gray-500">Live</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <div className="text-lg font-bold text-red-400">{counters.dead}</div>
                    <div className="text-xs text-gray-500">Dead</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <div className="text-lg font-bold text-orange-400">{counters.duplicate}</div>
                    <div className="text-xs text-gray-500">Duplikat</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <div className="text-lg font-bold text-yellow-400">{counters.error}</div>
                    <div className="text-xs text-gray-500">Error</div>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Area Hasil - Tabs */}
            <GlassCard className="p-6">
              <Tabs defaultValue="live" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="live" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Live ({liveList.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="dead" className="flex items-center space-x-2">
                    <UserX className="w-4 h-4" />
                    <span>Dead ({deadList.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="duplicate" className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Duplikat ({duplicateList.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="error" className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Error ({errorList.length})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="live" className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-green-400">UID Aktif</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(liveList, 'Live')}
                      disabled={liveList.length === 0}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Salin
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {liveList.map((uid, index) => (
                      <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800/50 rounded">
                        {uid}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="dead" className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-red-400">UID Tidak Aktif</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(deadList, 'Dead')}
                      disabled={deadList.length === 0}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Salin
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {deadList.map((uid, index) => (
                      <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800/50 rounded">
                        {uid}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="duplicate" className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-orange-400">UID Duplikat</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(duplicateList, 'Duplikat')}
                      disabled={duplicateList.length === 0}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Salin
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {duplicateList.length > 0 ? (
                      duplicateList.map((uid, index) => (
                        <div key={index} className="text-sm text-gray-300 p-2 bg-orange-900/20 border border-orange-700/50 rounded">
                          <div className="flex items-center space-x-2">
                            <Layers className="w-3 h-3 text-orange-400" />
                            <span>{uid}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Tidak ada UID duplikat</p>
                        <p className="text-xs mt-1">UID yang sama ditemukan beberapa kali dalam input</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="error" className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-yellow-400">UID Error</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(errorList, 'Error')}
                      disabled={errorList.length === 0}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Salin
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {errorList.map((uid, index) => (
                      <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800/50 rounded">
                        {uid}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </div>

          {/* Kolom Input (Desktop: Kiri, Mobile: Bawah) */}
          <div className="md:col-start-1 space-y-6">
            {/* Input Area */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Input UID</h3>
              <Textarea
                value={rawInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Masukkan UID Facebook satu per baris...&#10;Contoh:&#10;100012345678901&#10;https://web.facebook.com/profile.php?id=100012345678902&#10;facebook.com/username"
                className="min-h-[200px] bg-gray-800 border-gray-700 text-white font-mono focus:ring-blue-500 focus:border-blue-500"
              />
            </GlassCard>

            {/* Panel Kontrol - Enhanced */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  Panel Kontrol
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isChecking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-gray-400">
                    {isChecking ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>
              
              {/* Speed Control dengan visual enhancement */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 block">
                        Speed (Power)
                      </label>
                      <span className="text-xs text-gray-500">
                        Jumlah UID per batch
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-400">{speed}</span>
                    <span className="text-sm text-gray-400 block">UID/batch</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Slow</span>
                    <span>Fast</span>
                    <span>Ultra</span>
                    <span>Turbo</span>
                  </div>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                    disabled={isChecking}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                
                {/* Speed indicator */}
                <div className="mt-3 flex items-center justify-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    speed <= 10 ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                    speed <= 25 ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50' :
                    speed <= 50 ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' :
                    'bg-red-900/30 text-red-400 border border-red-700/50'
                  }`}>
                    {speed <= 10 ? '🐢 Slow Mode' : 
                     speed <= 25 ? '🚀 Fast Mode' : 
                     speed <= 50 ? '⚡ Ultra Mode' :
                     '🔥 Turbo Mode'}
                  </div>
                </div>
              </div>

              {/* Tombol Aksi dengan enhancement */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartCheck}
                  disabled={isChecking || !rawInput.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="flex items-center justify-center">
                    {isChecking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        <span>Mulai Cek</span>
                      </>
                    )}
                  </div>
                </Button>

                {isChecking && (
                  <Button
                    onClick={handleStop}
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-center">
                      <Square className="w-4 h-4 mr-2" />
                      <span>Stop Process</span>
                    </div>
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      setRawInput('');
                      setStatusText('Input dibersihkan');
                    }}
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                    disabled={isChecking}
                  >
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      <span>Clear Input</span>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={handleClear}
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                    disabled={isChecking}
                  >
                    <div className="flex items-center justify-center">
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>Reset All</span>
                    </div>
                  </Button>
                </div>

                {/* Audio Toggle - Client Side Only */}
                {isMounted && (
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      audioFeedback?.isAudioEnabled() ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {audioFeedback?.isAudioEnabled() ? (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0111 0H4a1 1 0 011-1V4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 001 1zm0 14V7a1 1 0 001-1h4a1 1 0 001-1V4a1 1 0 001-1z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-2 h-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0111 0H4a1 1 0 011-1V4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 001 1zm0 14V7a1 1 0 001-1h4a1 1 0 001-1V4a1 1 0 001-1z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-300">Audio Feedback</span>
                  </div>
                  <Button
                    onClick={() => audioFeedback?.setEnabled(!audioFeedback?.isAudioEnabled())}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    {audioFeedback?.isAudioEnabled() ? 'Disable' : 'Enable'}
                  </Button>
                </div>
                )}
              </div>
              
              {/* Info Panel */}
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-300">
                    <strong>Ultra-Fast Mode:</strong> Sekarang dengan parallel processing! 
                    Speed 25-100 untuk hasil 1-2 detik. Speed 1-10 untuk akurasi maksimal.
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FacebookUidChecker };
export default FacebookUidChecker;