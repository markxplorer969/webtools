'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, AlertCircle, Users, UserCheck, UserX, Copy, ExternalLink } from 'lucide-react'

interface UIDResult {
  uid: string
  status: 'live' | 'dead' | 'error'
  profileUrl?: string
  name?: string
}

export default function FacebookUIDChecker() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<UIDResult[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    dead: 0,
    duplicate: 0,
    error: 0
  })

  const extractUIDs = (text: string): string[] => {
    const uidPattern = /\b\d{10,}\b/g
    const urlPattern = /facebook\.com\/(?:profile\.php\?id=)?(\d{10,})/gi
    const uids = new Set<string>()
    
    let match
    while ((match = uidPattern.exec(text)) !== null) {
      uids.add(match[0])
    }
    
    while ((match = urlPattern.exec(text)) !== null) {
      uids.add(match[1])
    }
    
    return Array.from(uids)
  }

  const checkUIDs = async () => {
    const uids = extractUIDs(input)
    if (uids.length === 0) {
      alert('Please enter valid Facebook UIDs or URLs')
      return
    }

    setIsChecking(true)
    const newResults: UIDResult[] = []
    const newStats = { total: uids.length, live: 0, dead: 0, duplicate: 0, error: 0 }

    for (const uid of uids) {
      try {
        const response = await fetch('/api/check-uid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid })
        })
        
        const data = await response.json()
        
        if (data.exists) {
          newResults.push({
            uid,
            status: 'live',
            profileUrl: data.profileUrl,
            name: data.name
          })
          newStats.live++
        } else {
          newResults.push({
            uid,
            status: 'dead'
          })
          newStats.dead++
        }
      } catch (error) {
        newResults.push({
          uid,
          status: 'error'
        })
        newStats.error++
      }
    }

    setResults(newResults)
    setStats(newStats)
    setIsChecking(false)
  }

  const liveAccounts = results.filter(r => r.status === 'live')
  const deadAccounts = results.filter(r => r.status === 'dead')
  const errorAccounts = results.filter(r => r.status === 'error')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Facebook UID Checker</h1>
          <p className="text-lg text-gray-600">Check if Facebook UIDs are live or dead in bulk</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Enter Facebook UIDs or URLs</CardTitle>
            <CardDescription>
              Enter one UID or URL per line, or separate with commas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter Facebook UIDs or profile URLs...&#10;Example:&#10;100012345678901&#10;https://www.facebook.com/100012345678901&#10;https://www.facebook.com/profile.php?id=100012345678901"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] font-mono"
            />
            <div className="mt-4 flex gap-4">
              <Button 
                onClick={checkUIDs} 
                disabled={isChecking || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isChecking ? 'Checking...' : 'Check UIDs'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setInput('')
                  setResults([])
                  setStats({ total: 0, live: 0, dead: 0, duplicate: 0, error: 0 })
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="bg-white">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.live}</div>
                  <div className="text-sm text-green-600">Live</div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">{stats.dead}</div>
                  <div className="text-sm text-red-600">Dead</div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.duplicate}</div>
                  <div className="text-sm text-yellow-600">Duplicate</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <XCircle className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-600">{stats.error}</div>
                  <div className="text-sm text-gray-600">Error</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {liveAccounts.length > 0 && (
                <Card>
                  <CardHeader className="bg-green-50 border-b">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Live Accounts ({liveAccounts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {liveAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex-1">
                            <div className="font-mono text-sm text-gray-900">{account.uid}</div>
                            {account.name && (
                              <div className="text-sm text-gray-600 mt-1">{account.name}</div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {account.profileUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(account.profileUrl, '_blank')}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(account.uid)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(deadAccounts.length > 0 || errorAccounts.length > 0) && (
                <Card>
                  <CardHeader className="bg-red-50 border-b">
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Dead Accounts ({deadAccounts.length + errorAccounts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {deadAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="font-mono text-sm text-gray-900">{account.uid}</div>
                          <Badge variant="destructive">Dead</Badge>
                        </div>
                      ))}
                      {errorAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="font-mono text-sm text-gray-900">{account.uid}</div>
                          <Badge variant="secondary">Error</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>Step 1:</strong> Enter Facebook UIDs or profile URLs in the text area</div>
              <div><strong>Step 2:</strong> Click "Check UIDs" to verify each account</div>
              <div><strong>Step 3:</strong> View results separated into Live and Dead accounts</div>
              <div><strong>Step 4:</strong> Click "View Profile" to visit live accounts</div>
              <div><strong>Step 5:</strong> Use copy button to copy individual UIDs</div>
              <div><strong>Step 6:</strong> Clear results to check new batch of UIDs</div>
            </div>
            <Separator className="my-4" />
            <div className="text-xs text-gray-500">
              <p><strong>Supported formats:</strong></p>
              <p>• UID: 100012345678901</p>
              <p>• URL: https://www.facebook.com/100012345678901</p>
              <p>• Profile: https://www.facebook.com/profile.php?id=100012345678901</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}