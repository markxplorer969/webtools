'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, RefreshCw, Shield, Clock, Smartphone } from 'lucide-react'

export default function TwoFactorGenerator() {
  const [secret, setSecret] = useState('')
  const [accountName, setAccountName] = useState('')
  const [issuer, setIssuer] = useState('MyApp')
  const [currentCode, setCurrentCode] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [showSecret, setShowSecret] = useState(false)

  // Generate a random secret key
  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setSecret(result)
  }

  // Generate TOTP code (simplified version)
  const generateTOTP = (secret: string) => {
    // This is a simplified version - in production, you'd use a proper TOTP library
    const time = Math.floor(Date.now() / 1000)
    const counter = Math.floor(time / 30)
    
    // Simple hash simulation (replace with proper HMAC-SHA1 in production)
    const hash = simpleHash(secret + counter)
    const code = (hash % 1000000).toString().padStart(6, '0')
    
    return code
  }

  const simpleHash = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  // Generate QR code URL
  const generateQRCode = () => {
    if (!secret || !accountName) return
    
    const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
    setQrCodeUrl(qrUrl)
  }

  // Update TOTP code every second
  useEffect(() => {
    if (!secret) return

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const timeLeft = 30 - (now % 30)
      setTimeRemaining(timeLeft)
      
      if (timeLeft === 30) {
        setCurrentCode(generateTOTP(secret))
      }
    }, 1000)

    // Generate initial code
    setCurrentCode(generateTOTP(secret))

    return () => clearInterval(interval)
  }, [secret])

  // Generate QR code when dependencies change
  useEffect(() => {
    generateQRCode()
  }, [secret, accountName, issuer])

  // Initialize with a random secret
  useEffect(() => {
    generateSecret()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">2FA Code Generator</h1>
          <p className="text-lg text-gray-600">Generate Time-based One-Time Passwords (TOTP)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Setup Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Setup 2FA
              </CardTitle>
              <CardDescription>
                Configure your 2FA settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  placeholder="user@example.com"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="issuer">Service Name</Label>
                <Input
                  id="issuer"
                  placeholder="MyApp"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="secret">Secret Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="secret"
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSecret}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => copyToClipboard(secret)}
                variant="outline"
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Secret
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                QR Code
              </CardTitle>
              <CardDescription>
                Scan with your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCodeUrl && accountName ? (
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg border">
                    <img 
                      src={qrCodeUrl} 
                      alt="2FA QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with Google Authenticator, Authy, or similar app
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Enter account name to generate QR code
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Code Section */}
        {secret && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Code
              </CardTitle>
              <CardDescription>
                Your 2FA code refreshes every 30 seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-mono font-bold text-gray-900 tracking-wider">
                  {currentCode || '------'}
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000"
                        style={{ width: `${(timeRemaining / 30) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {timeRemaining}s
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => copyToClipboard(currentCode)}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div><strong>Step 1:</strong> Enter your account name and service name</div>
              <div><strong>Step 2:</strong> Copy the secret key or scan the QR code with your authenticator app</div>
              <div><strong>Step 3:</strong> Your authenticator app will start generating codes</div>
              <div><strong>Step 4:</strong> Use the generated codes for 2FA authentication</div>
              <div><strong>Step 5:</strong> Codes refresh every 30 seconds automatically</div>
            </div>
            <Separator className="my-4" />
            <div className="text-xs text-gray-500">
              <p><strong>Important:</strong> Store your secret key safely. If you lose access to your authenticator app, you'll need this key to restore access.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}