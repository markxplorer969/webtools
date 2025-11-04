'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, UserX, AlertCircle, CheckCircle, Clock, Copy, Zap, Activity, Play, Pause, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

interface CheckResult {
  uid: string;
  status: 'Live' | 'Dead' | 'Error';
}

interface StoredSession {
  liveList: string[];
  deadList: string[];
  errorList: string[];
  duplicateList: string[];
  timestamp: number;
}

const FacebookUidChecker: React.FC = () => {
  // State Management (React Hooks)
  const [rawInput, setRawInput] = useState<string>('');
  const [speed, setSpeed] = useState<number>(10);
  const [proxyKey, setProxyKey] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [liveList, setLiveList] = useState<string[]>([]);
  const [deadList, setDeadList] = useState<string[]>([]);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [duplicateList, setDuplicateList] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Siap untuk memulai...');
  
  // Refs for processing
  const processingRef = useRef<boolean>(false);
  const queueRef = useRef<string[]>([]);

  // Persistensi Sesi (Pilar 21 - Vibe "Pintar")
  useEffect(() => {
    try {
      const stored = localStorage.getItem('facebook-uid-checker-session');
      if (stored) {
        const session: StoredSession = JSON.parse(stored);
        // Only restore if less than 24 hours old
        if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
          setLiveList(session.liveList || []);
          setDeadList(session.deadList || []);
          setErrorList(session.errorList || []);
          setDuplicateList(session.duplicateList || []);
          setTotalCount(session.liveList.length + session.deadList.length + session.errorList.length + session.duplicateList.length);
          setProcessedCount(session.liveList.length + session.deadList.length + session.errorList.length + session.duplicateList.length);
          setStatusText('Session dipulih dari penyimpanan lokal');
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }, []);

  // Save to localStorage whenever lists change
  useEffect(() => {
    if (liveList.length > 0 || deadList.length > 0 || errorList.length > 0 || duplicateList.length > 0) {
      const session: StoredSession = {
        liveList,
        deadList,
        errorList,
        duplicateList,
        timestamp: Date.now()
      };
      localStorage.setItem('facebook-uid-checker-session', JSON.stringify(session));
    }
  }, [liveList, deadList, errorList, duplicateList]);

  // Logika Otomatis (Pilar 18 - Jantungnya)
  const debouncedInput = useDebounce(rawInput, 1000);

  // Auto-trigger when debounced input changes
  useEffect(() => {
    if (!debouncedInput.trim()) {
      // Clear all lists when input is empty
      setLiveList([]);
      setDeadList([]);
      setErrorList([]);
      setDuplicateList([]);
      setTotalCount(0);
      setProcessedCount(0);
      setStatusText('Siap untuk memulai...');
      queueRef.current = [];
      return;
    }

    // Prevent multiple processing
    if (processingRef.current) return;
    processingRef.current = true;
    setIsChecking(true);

    const processInput = async () => {
      try {
        setStatusText('Menganalisis input...');
        
        // Step 2: Cleaning and Deduplication
        const uids = debouncedInput
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => {
            // Extract UID from various formats
            const uidMatch = line.match(/(?:id=)(\d+)|https:\/\/(?:facebook\.com\/profile\.php\?id=)(\d+)/);
            return uidMatch ? uidMatch[1] || uidMatch[2] : line;
          })
          .filter(uid => uid.length > 0);
        
        // Find duplicates
        const uniqueUids = Array.from(new Set(uids));
        const duplicates = uids.filter((uid, index) => uids.indexOf(uid) !== index);
        
        setDuplicateList(duplicates);
        setTotalCount(uniqueUids.length);
        setProcessedCount(0);
        queueRef.current = uniqueUids;
        
        setStatusText(`Siap memulai... (0/${uniqueUids.length})`);
        
        // Step 3: Batch Processing
        await processBatch();
        
      } catch (error) {
        console.error('Error processing input:', error);
        setStatusText('Error memproses input');
      } finally {
        processingRef.current = false;
        setIsChecking(false);
      }
    };

    processInput();
  }, [debouncedInput]);

  // Batch Processing Function
  const processBatch = async () => {
    const queue = queueRef.current;
    if (queue.length === 0) return;
    
    const batchSize = Math.min(speed, 20); // Dynamic batch size based on speed
    const batch = queue.splice(0, batchSize);
    
    setStatusText(`Mengecek ${batch.length} UID...`);
    
    try {
      const response = await fetch('/api/check-uid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Proxy-Key': proxyKey || '',
        },
        body: JSON.stringify({ uids: batch }),
      });

      if (!response.ok) {
        throw new Error('Failed to check UIDs');
      }

      const data = await response.json();
      
      // Update lists based on results
      data.results.forEach((result: CheckResult) => {
        switch (result.status) {
          case 'Live':
            setLiveList(prev => [...prev, result.uid]);
            break;
          case 'Dead':
            setDeadList(prev => [...prev, result.uid]);
            break;
          case 'Error':
            setErrorList(prev => [...prev, result.uid]);
            break;
        }
      });
      
      setProcessedCount(prev => prev + batch.length);
      setStatusText(`Mengecek... (${processedCount}/${totalCount})`);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error in batch processing:', error);
      // Add all UIDs in batch to error list
      batch.forEach(uid => {
        setErrorList(prev => [...prev, uid]);
      });
      setProcessedCount(prev => prev + batch.length);
    }
    
    // Continue processing if there are more items
    if (queueRef.current.length > 0 && isChecking) {
      setTimeout(() => processBatch(), 1000);
    }
  };

  // Handle Start Check
  const handleStartCheck = () => {
    if (!rawInput.trim()) {
      toast.error('Please enter some UIDs to check');
      return;
    }
    
    processingRef.current = false;
    setIsChecking(true);
    processInput();
  };

  // Handle Stop
  const handleStop = () => {
    processingRef.current = false;
    setIsChecking(false);
    setStatusText('Dihentikan');
  };

  // Copy list to clipboard
  const copyList = (list: string[], listName: string) => {
    const text = list.join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`${listName} copied to clipboard!`);
  };

  // Clear all data
  const clearAll = () => {
    setRawInput('');
    setLiveList([]);
    setDeadList([]);
    setErrorList([]);
    setDuplicateList([]);
    setTotalCount(0);
    setProcessedCount(0);
    setStatusText('Siap untuk memulai...');
    queueRef.current = [];
    localStorage.removeItem('facebook-uid-checker-session');
    toast.success('All data cleared');
  };

  // Animation variants (Pilar 22 - Vibe "Hidup")
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const exitVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Live':
        return {
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          icon: CheckCircle,
          label: 'Live'
        };
      case 'Dead':
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          icon: UserX,
          label: 'Dead'
        };
      default:
        return {
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          icon: AlertCircle,
          label: 'Error'
        };
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <UserCheck className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Facebook UID Checker</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tool checker Facebook UID otomatis dengan persistensi sesi dan batch processing
          </p>
        </motion.div>

        {/* Layout Mission Control (Pilar 10) */}
        <div className="grid grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Input (Kiri) */}
          <motion.div variants={cardVariants} className="space-y-4">
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-white">Input UIDs</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Paste Facebook UIDs, satu per baris. Sistem akan otomatis memprosesnya.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Facebook UIDs</label>
                  <Textarea
                    value={rawInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter Facebook UIDs, satu per baris:
1000000000001
1000000002
https://facebook.com/profile.php?id=1000000003"
1000000004"
                    className="min-h-[200px] bg-gray-800 border-gray-700 text-white font-mono text-sm resize-none"
                  />
                </div>
                
                {/* Panel Kontrol (Pilar 5 & 20) */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Speed (Power)</label>
                    <Slider
                      value={[speed]}
                      onValue={(value) => setSpeed(value)}
                      max={50}
                      min={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      {speed} UID/batch
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Proxy API Key (Optional)</label>
                    <Input
                      value={proxyKey}
                      onChange={(e) => setProxyKey(e.target.value)}
                      placeholder="Masukkan proxy key (opsional)"
                      className="w-full bg-gray-800 border-gray-700 text-white font-mono text-sm"
                    />
                  </div>
                </div>
                
                {/* Tombol Aksi (Pilar 9) */}
                <div className="flex space-x-2">
                  <Button
                    onClick={handleStartCheck}
                    disabled={isChecking || !rawInput.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg flex items-center space-x-2"
                  >
                    {isChecking ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Mulai Cek</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleStop}
                    disabled={!isChecking}
                    variant="outline"
                    className="px-6 py-3 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Kolom Output (Kanan) */}
          <motion.div variants={cardVariants} className="space-y-4">
            {/* Dashboard Statistik (Pilar 5) */}
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-white">Dashboard Statistik</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalCount}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{liveList.length}</div>
                    <div className="text-xs text-gray-400">Live</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{deadList.length}</div>
                    <div className="text-xs text-gray-400">Dead</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{errorList.length}</div>
                    <div className="text-xs text-gray-400">Error</div>
                  </div>
                </div>
                
                {/* Progress Bar (Pilar 4) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{processedCount}/{totalCount}</span>
                  </div>
                  <motion.div 
                    className="h-2 bg-accent rounded-full overflow-hidden"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: `${(processedCount / totalCount) * 100}%` 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-full bg-accent" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Area Hasil (Tabs - Pilar 5, 9, 22) */}
            <motion.div variants={cardVariants}>
              <Card className="glass border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Hasil Pemeriksaan</CardTitle>
                  <CardDescription className="text-gray-400">
                    Hasil pemeriksaan UID dengan animasi real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="live" className="w-full">
                    <TabsList className="grid w-full grid grid-cols-3">
                      <TabsTrigger value="live" className="data-[state=active]:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="font-medium text-green-400">Live ({liveList.length})</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="dead" className="data-[state=active]:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <UserX className="w-4 h-4 text-red-400" />
                          <span className="font-medium text-red-400">Dead ({deadList.length})</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="error" className="data-[state=active]:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="font-medium text-yellow-400">Error ({errorList.length})</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </TabsList>
                  
                  <TabsContent value="live" className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {liveList.map((uid, index) => (
                          <motion.div
                            key={uid}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={exitVariants}
                            custom={index}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-green-500/30"
                          >
                            <span className="text-green-400 font-mono text-sm">{uid}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyList([uid], 'Live UIDs')}
                              className="text-green-400 hover:text-green-300 hover:bg-gray-700"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {liveList.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Belum ada UID yang live</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dead" className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {deadList.map((uid, index) => (
                          <motion.div
                            key={uid}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={exitVariants}
                            custom={index}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border-red-500/30"
                          >
                            <span className="text-red-400 font-mono text-sm">{uid}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyList([uid], 'Dead UIDs')}
                              className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {deadList.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <UserX className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Belum ada UID yang dead</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="error" className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {errorList.map((uid, index) => (
                          <motion.div
                            key={uid}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={exitVariants}
                            custom={index}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border-yellow-500/30"
                          >
                            <span className="text-yellow-400 font-mono text-sm">{uid}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyList([uid], 'Error UIDs')}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-gray-700"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {errorList.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Belum ada error</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FacebookUidChecker;