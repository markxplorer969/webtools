"use client"

import { useState, useEffect, useCallback, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import * as OTPAuth from 'otpauth'
import { LockKeyhole, Copy } from 'lucide-react'

interface CodeItem {
  label: string
  code: string
}

interface ResultCardProps {
  item: CodeItem
  onCopy: (code: string) => void
}

const ResultCard = ({ item, onCopy }: ResultCardProps) => {
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setGlarePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {/* Glare Effect Layer */}
      {isHovered && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${glarePosition.x}px ${glarePosition.y}px, rgba(255,255,255,0.1), transparent)`,
          }}
        />
      )}
      
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LockKeyhole className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">{item.label}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-3xl text-blue-400 font-bold">
            {item.code}
          </span>
          <button
            onClick={() => onCopy(item.code.replace(/\s/g, ''))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
            title="Salin kode"
          >
            <Copy className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Multi2FA() {
  const [rawInput, setRawInput] = useState('')
  const [codes, setCodes] = useState<CodeItem[]>([])
  const [countdown, setCountdown] = useState(30)

  const generateCodes = useCallback(() => {
    if (!rawInput.trim()) {
      setCodes([])
      return
    }

    const lines = rawInput.split('\n').filter(line => line.trim())
    
    const newCodes: CodeItem[] = lines.map((line, index) => {
      try {
        let label = ''
        let secret = ''
        
        if (line.includes('|')) {
          const parts = line.split('|').map(p => p.trim())
          label = parts[0] || `Secret ${index + 1}`
          secret = parts[1] || ''
        } else {
          label = `Secret ${index + 1}`
          secret = line.trim()
        }
        
        if (!secret) {
          return { label, code: 'NO SECRET' }
        }
        
        // Clean secret and create TOTP
        const cleanSecret = secret.replace(/\s/g, '').toUpperCase()
        const totp = new OTPAuth.TOTP({
          secret: OTPAuth.Secret.fromBase32(cleanSecret),
          algorithm: 'SHA1',
          digits: 6,
          period: 30
        })
        
        const token = totp.generate()
        const formattedCode = token.replace(/(.{3})/, '$1 ')
        
        return { label, code: formattedCode }
        
      } catch (error) {
        return { label: line.split('|')[0]?.trim() || `Secret ${index + 1}`, code: 'SECRET ERROR' }
      }
    })
    
    setCodes(newCodes)
  }, [rawInput])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown = 30 - (Math.floor(Date.now() / 1000) % 30)
      setCountdown(newCountdown)
      
      if (newCountdown === 30) {
        generateCodes()
      }
    }, 1000)

    // Initial generation
    generateCodes()

    return () => clearInterval(interval)
  }, [generateCodes])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Input */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Input Secret Keys</h2>
          <p className="text-gray-400 mb-4">
            Masukkan secret key 2FA Anda. Format: NAMA (opsional) | KODE SECRET
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">
            Secret Keys (satu per baris):
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Google Authenticator | JBSWY3DPEHPK3PXP&#10;Microsoft Authenticator | JBSWY3DPEHPK3PXQ&#10;JBSWY3DPEHPK3PXR"
            className="w-full bg-gray-800 text-white min-h-[400px] p-4 rounded-lg font-mono text-sm border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
        
        <div className="text-sm text-gray-400">
          <p className="mb-2">💡 <strong>Contoh format:</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• Nama Layanan | SECRETKEY</li>
            <li>• SECRETKEY (tanpa nama)</li>
            <li>• Gmail | JBSWY3DPEHPK3PXP</li>
          </ul>
        </div>
      </div>

      {/* Right Column - Output Dashboard */}
      <div className="space-y-4">
        {/* Mobile: Show Output First */}
        <div className="md:hidden">
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard Kode</h2>
        </div>
        
        {/* Timer Bar */}
        <div className="bg-gray-800 rounded-full p-1">
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: 30,
                ease: 'linear',
                repeat: Infinity,
              }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-400">Refresh dalam </span>
            <span className="text-sm font-bold text-blue-400">{countdown}s</span>
          </div>
        </div>

        {/* Desktop: Show Output Title */}
        <div className="hidden md:block">
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard Kode</h2>
        </div>
        
        {/* Codes Dashboard */}
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          {codes.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <LockKeyhole className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Belum ada kode 2FA. Masukkan secret keys di kolom input.
              </p>
            </div>
          ) : (
            codes.map((item, index) => (
              <ResultCard
                key={`${item.label}-${index}`}
                item={item}
                onCopy={handleCopy}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}