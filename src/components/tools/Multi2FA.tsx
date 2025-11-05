'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { OTPAuth } from 'otpauth';
import { LockKeyhole, Copy, Plus, Trash2, Clock } from 'lucide-react';
import { Tool } from '@/lib/types';

interface CodeEntry {
  id: string;
  label: string;
  code: string;
  secret: string;
}

interface Multi2FAProps {
  tool: Tool;
}

export default function Multi2FA({ tool }: Multi2FAProps) {
  // State Management (React Hooks)
  const [rawInput, setRawInput] = useState('');
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [countdown, setCountdown] = useState(30);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Ref for timer animation
  const timerRef = useRef<NodeJS.Timeout>();

  // Fungsi generateCodes (Pilar 10)
  const generateCodes = useCallback(() => {
    if (!rawInput.trim()) {
      setCodes([]);
      return;
    }

    try {
      const lines = rawInput.trim().split('\n');
      const newCodes: CodeEntry[] = [];

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        let label = '';
        let secret = '';

        // Parsing logic: NAMA | SECRET
        if (trimmedLine.includes('|')) {
          const parts = trimmedLine.split('|');
          label = parts[0].trim();
          secret = parts[1].trim();
        } else {
          label = `Account ${index + 1}`;
          secret = trimmedLine;
        }

        // Kripto: Generate TOTP
        try {
          const totp = new OTPAuth.TOTP({
            secret: secret.replace(/\s/g, ''), // Clean secret
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
          });

          const token = totp.generate();
          const formattedCode = `${token.slice(0, 3)} ${token.slice(3)}`;

          newCodes.push({
            id: `${Date.now()}-${index}`,
            label,
            code: formattedCode,
            secret,
          });
        } catch (error) {
          console.error('Error generating code for:', label, error);
        }
      });

      setCodes(newCodes);
    } catch (error) {
      console.error('Error parsing input:', error);
      setCodes([]);
    }
  }, [rawInput]);

  // Logika Timer (useEffect)
  useEffect(() => {
    // Initial generation
    generateCodes();

    // Set up interval for countdown and regeneration
    const interval = setInterval(() => {
      const newCountdown = 30 - (Math.floor(Date.now() / 1000) % 30);
      setCountdown(newCountdown);

      // Regenerate codes when countdown resets to 30
      if (newCountdown === 30) {
        generateCodes();
      }
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, [generateCodes]);

  // Handle copy functionality
  const handleCopy = useCallback((code: string, id: string) => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.clipboard) {
      navigator.clipboard.writeText(code.replace(' ', ''));
      setCopiedId(id);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  // Handle glare effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlarePosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlarePosition({ x: -100, y: -100 });
  }, []);

  // Animation variants
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <LockKeyhole className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">{tool.name}</h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{tool.description}</p>
        </motion.div>

        {/* Timer Bar Kustom (Pilar 10) */}
        <motion.div variants={cardVariants} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Time until next codes</span>
            <span className="text-sm font-mono text-accent">{countdown}s</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: 30,
                ease: 'linear',
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Implementasi Layout (Blueprint "Mission Control") */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Kolom Input */}
          <motion.div variants={cardVariants} className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Input 2FA Accounts</h2>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Enter your 2FA accounts in format:&#10;Account Name | SECRET_KEY&#10;&#10;Example:&#10;Google | JBSWY3DPEHPK3PXP&#10;GitHub | JBSWY3DPEHPK3PXP&#10;&#10;Or just paste secret keys:"
                className="w-full h-64 p-4 bg-gray-800 text-gray-100 font-mono text-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <div className="mt-4 text-sm text-gray-400">
                <p>• Format: Account Name | SECRET_KEY</p>
                <p>• One account per line</p>
                <p>• Secret keys are processed locally</p>
              </div>
            </div>
          </motion.div>

          {/* Kolom Output ("Dashboard") */}
          <motion.div variants={cardVariants} className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Generated Codes</h2>
              
              {codes.length === 0 ? (
                <div className="text-center py-12">
                  <LockKeyhole className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No accounts added yet</p>
                  <p className="text-sm text-gray-500 mt-2">Add your 2FA accounts to see generated codes</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {codes.map((entry) => (
                    <ResultCard
                      key={entry.id}
                      entry={entry}
                      onCopy={handleCopy}
                      isCopied={copiedId === entry.id}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      glarePosition={glarePosition}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div variants={cardVariants}>
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-accent font-medium mb-2">1. Get Your Secret Keys</h4>
                <p className="text-sm text-gray-400">
                  Find your 2FA secret keys from your authenticator app or service provider.
                </p>
              </div>
              <div>
                <h4 className="text-accent font-medium mb-2">2. Enter Accounts</h4>
                <p className="text-sm text-gray-400">
                  Add your accounts using the format: Account Name | SECRET_KEY
                </p>
              </div>
              <div>
                <h4 className="text-accent font-medium mb-2">3. Generate Codes</h4>
                <p className="text-sm text-gray-400">
                  Codes are generated automatically every 30 seconds.
                </p>
              </div>
              <div>
                <h4 className="text-accent font-medium mb-2">4. Copy & Use</h4>
                <p className="text-sm text-gray-400">
                  Click the copy button to copy codes for authentication.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ResultCard Component (Bagian 4)
interface ResultCardProps {
  entry: CodeEntry;
  onCopy: (code: string, id: string) => void;
  isCopied: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  glarePosition: { x: number; y: number };
}

function ResultCard({ entry, onCopy, isCopied, onMouseMove, onMouseLeave, glarePosition }: ResultCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="glass rounded-lg p-4 relative overflow-hidden cursor-pointer group"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Glare Layer (Pilar 7 - WAJIB) */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255, 255, 255, 0.04), transparent 30%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex justify-between items-center">
        {/* Kiri: Ikon + Label */}
        <div className="flex items-center space-x-3">
          <LockKeyhole className="w-5 h-5 text-accent" />
          <span className="font-semibold text-white">{entry.label}</span>
        </div>

        {/* Kanan: Kode + Tombol */}
        <div className="flex items-center space-x-3">
          <span className="text-primary-text text-3xl font-mono" style={{ color: '#E0E0E0' }}>
            {entry.code}
          </span>
          <button
            onClick={() => onCopy(entry.code, entry.id)}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
            title="Copy code"
          >
            <Copy className={`w-4 h-4 transition-colors duration-200 ${
              isCopied ? 'text-green-400' : 'text-gray-400 hover:text-white'
            }`} />
          </button>
        </div>
      </div>

      {/* Toast Notifikasi Glassmorphism */}
      {isCopied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 rounded-lg glass pointer-events-none"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <span className="text-white text-sm font-medium">Tersalin!</span>
        </motion.div>
      )}
    </motion.div>
  );
}