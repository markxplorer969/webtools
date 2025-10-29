"use client"

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, Users, UserX, AlertCircle, Copy, Loader2 } from 'lucide-react'

interface CheckResult {
  uid: string;
  status: 'live' | 'dead' | 'error';
}

export default function FacebookUidChecker() {
  // Langkah 7: Inisialisasi semua state yang diperlukan
  const [rawInput, setRawInput] = useState('')
  const [speed, setSpeed] = useState(5)
  const [isChecking, setIsChecking] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [liveList, setLiveList] = useState<CheckResult[]>([])
  const [deadList, setDeadList] = useState<CheckResult[]>([])
  const [duplicateList, setDuplicateList] = useState<string[]>([])
  const [errorList, setErrorList] = useState<CheckResult[]>([])
  const [activeTab, setActiveTab] = useState<'live' | 'dead' | 'error' | 'duplicate'>('live')
  
  const uniqueUidListRef = useRef<string[]>([])

  // Fungsi untuk menyalin ke clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Fungsi untuk mengekstrak UID dari input
  const extractUids = (input: string): string[] => {
    const uidRegex = /(?:id=|facebook\.com\/)(\d+)/g
    const matches = input.match(uidRegex)
    if (!matches) return []
    
    return matches.map(match => {
      const uid = match.split(/(?:id=|facebook\.com\/)/)[1]
      return uid
    }).filter(uid => uid && /^\d+$/.test(uid))
  }

  // Implementasi Logika Frontend (Fungsi handleStartCheck)
  const handleStartCheck = async () => {
    if (!rawInput.trim()) return

    setIsChecking(true)
    
    // Reset semua list dan counter
    setLiveList([])
    setDeadList([])
    setErrorList([])
    setDuplicateList([])
    setProcessedCount(0)

    // Langkah 2: Pembersihan Input
    const extractedUids = extractUids(rawInput)
    
    // Gunakan Set untuk menemukan duplikat
    const uniqueUids = new Set(extractedUids)
    const duplicates = extractedUids.filter((uid, index) => extractedUids.indexOf(uid) !== index)
    
    setDuplicateList([...new Set(duplicates)])
    uniqueUidListRef.current = Array.from(uniqueUids)
    setTotalCount(uniqueUidListRef.current.length)

    // Langkah 3: Logika Batching
    await processBatch()
  }

  // Worker function untuk processing batch
  const processBatch = async () => {
    if (!isChecking || uniqueUidListRef.current.length === 0) {
      setIsChecking(false)
      return
    }

    // Ambil speed item pertama dari antrian
    const batch = uniqueUidListRef.current.splice(0, speed)
    
    try {
      const response = await fetch('/api/check-uid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uids: batch }),
      })

      const results: CheckResult[] = await response.json()

      // Update State (Langkah 7)
      results.forEach(result => {
        if (result.status === 'live') {
          setLiveList(prev => [...prev, result])
        } else if (result.status === 'dead') {
          setDeadList(prev => [...prev, result])
        } else {
          setErrorList(prev => [...prev, result])
        }
      })

      setProcessedCount(prev => prev + results.length)

      // Lanjutkan ke batch berikutnya jika masih ada antrian
      if (uniqueUidListRef.current.length > 0 && isChecking) {
        setTimeout(() => processBatch(), 1000) // Delay 1 detik antar batch
      } else {
        setIsChecking(false)
      }
    } catch (error) {
      console.error('Error processing batch:', error)
      setErrorList(prev => [...prev, ...batch.map(uid => ({ uid, status: 'error' as const }))])
      setProcessedCount(prev => prev + batch.length)
      
      if (uniqueUidListRef.current.length > 0 && isChecking) {
        setTimeout(() => processBatch(), 1000)
      } else {
        setIsChecking(false)
      }
    }
  }

  // Logika Tombol "Stop"
  const handleStopCheck = () => {
    setIsChecking(false)
  }

  // Progress percentage
  const progressPercentage = totalCount > 0 ? (processedCount / totalCount) * 100 : 0

  // Get current list based on active tab
  const getCurrentList = () => {
    switch (activeTab) {
      case 'live': return liveList
      case 'dead': return deadList
      case 'error': return errorList
      case 'duplicate': return duplicateList.map(uid => ({ uid, status: 'duplicate' as const }))
      default: return liveList
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Kolom Kiri */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Input UID</h2>
          <p className="text-gray-400 text-sm mb-4">
            Masukkan URL Facebook atau UID. Satu per baris atau dipisahkan koma.
          </p>
        </div>

        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="https://www.facebook.com/profile.php?id=100012345678901&#10;https://facebook.com/100012345678902&#10;100012345678903"
          className="w-full h-64 bg-gray-800 text-white p-4 rounded-lg font-mono text-sm border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          disabled={isChecking}
        />

        {/* Panel Kontrol Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="space-y-4">
            {/* Speed Control */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Speed: {speed} UID per batch
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled={isChecking}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isChecking ? (
                <button
                  onClick={handleStartCheck}
                  disabled={!rawInput.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Mulai Cek
                </button>
              ) : (
                <button
                  onClick={handleStopCheck}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="space-y-6">
        {/* Dashboard Statistik Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Statistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{liveList.length}</div>
              <div className="text-sm text-gray-400">Live</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{deadList.length}</div>
              <div className="text-sm text-gray-400">Dead</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{errorList.length}</div>
              <div className="text-sm text-gray-400">Error</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{duplicateList.length}</div>
              <div className="text-sm text-gray-400">Duplikat</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{processedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {isChecking && (
              <div className="flex items-center justify-center mt-3 text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Memproses...</span>
              </div>
            )}
          </div>
        )}

        {/* Area Hasil Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Hasil</h3>
            <div className="flex gap-2">
              {(['live', 'dead', 'error', 'duplicate'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'live' && ` (${liveList.length})`}
                  {tab === 'dead' && ` (${deadList.length})`}
                  {tab === 'error' && ` (${errorList.length})`}
                  {tab === 'duplicate' && ` (${duplicateList.length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {getCurrentList().length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Belum ada data</p>
              </div>
            ) : (
              <div className="space-y-2">
                {getCurrentList().map((item, index) => (
                  <div
                    key={`${item.uid}-${index}`}
                    className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                  >
                    <span className="text-white font-mono text-sm">{item.uid}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'live' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'dead' ? 'bg-red-500/20 text-red-400' :
                        item.status === 'error' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.uid)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}