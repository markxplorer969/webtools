'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Trash2, Copy, RefreshCw, QrCode, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TwoFactorAccount {
  id: string;
  name: string;
  secret: string;
  issuer: string;
  algorithm: string;
  digits: number;
  period: number;
}

export default function Multi2FAAuthenticator() {
  const [accounts, setAccounts] = useState<TwoFactorAccount[]>([]);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountSecret, setNewAccountSecret] = useState('');
  const [newAccountIssuer, setNewAccountIssuer] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [codes, setCodes] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(30);

  // Load accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('2fa-accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
  }, []);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('2fa-accounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  // Generate TOTP codes
  useEffect(() => {
    const generateCodes = () => {
      const newCodes: { [key: string]: string } = {};
      accounts.forEach(account => {
        newCodes[account.id] = generateTOTP(account.secret, account.period, account.digits);
      });
      setCodes(newCodes);
    };

    generateCodes();
    const interval = setInterval(generateCodes, 1000);

    return () => clearInterval(interval);
  }, [accounts]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simple TOTP implementation (for demo purposes)
  const generateTOTP = (secret: string, period: number = 30, digits: number = 6): string => {
    // In a real implementation, you would use a proper TOTP library
    // This is a simplified version for demonstration
    const time = Math.floor(Date.now() / 1000 / period);
    const hash = simpleHash(secret + time);
    const code = hash.toString().padStart(digits, '0').slice(-digits);
    return code;
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const addAccount = () => {
    if (!newAccountName || !newAccountSecret) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAccount: TwoFactorAccount = {
      id: Date.now().toString(),
      name: newAccountName,
      secret: newAccountSecret,
      issuer: newAccountIssuer || 'Unknown',
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    };

    setAccounts([...accounts, newAccount]);
    setNewAccountName('');
    setNewAccountSecret('');
    setNewAccountIssuer('');
    setShowAddForm(false);
    toast.success('Account added successfully');
  };

  const removeAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast.success('Account removed');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard');
  };

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
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Multi-2FA Authenticator</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Secure 2FA code generator for multiple accounts
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Codes refresh in {timeLeft}s</span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all duration-1000"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Add Account Button */}
        <motion.div variants={cardVariants} className="flex justify-center">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Account
          </Button>
        </motion.div>

        {/* Add Account Form */}
        {showAddForm && (
          <motion.div
            variants={cardVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add New Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your account details to generate 2FA codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Account Name *</Label>
                    <Input
                      id="name"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      placeholder="e.g., Google, GitHub"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="issuer" className="text-gray-300">Issuer</Label>
                    <Input
                      id="issuer"
                      value={newAccountIssuer}
                      onChange={(e) => setNewAccountIssuer(e.target.value)}
                      placeholder="e.g., Google Inc."
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secret" className="text-gray-300">Secret Key *</Label>
                  <Input
                    id="secret"
                    value={newAccountSecret}
                    onChange={(e) => setNewAccountSecret(e.target.value)}
                    placeholder="Enter your 2FA secret key"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={addAccount}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Account
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Accounts Grid */}
        {accounts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {accounts.map((account) => (
              <motion.div key={account.id} variants={cardVariants}>
                <Card className="glass border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white">{account.name}</CardTitle>
                      </div>
                      <Button
                        onClick={() => removeAccount(account.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-gray-400">
                      {account.issuer}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-3xl font-mono font-bold text-white tracking-wider">
                            {codes[account.id] || '------'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => copyToClipboard(codes[account.id] || '')}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              const newCode = generateTOTP(account.secret, account.period, account.digits);
                              setCodes({ ...codes, [account.id]: newCode });
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                          {account.digits} digits
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                          {account.period}s
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                          {account.algorithm}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={cardVariants} className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No accounts yet</h3>
            <p className="text-gray-400 mb-6">
              Add your first 2FA account to start generating security codes
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Account
            </Button>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Security Notice</h4>
                  <p className="text-gray-400 text-sm">
                    This is a demo implementation for educational purposes. For production use, 
                    please use a properly vetted authenticator app with proper encryption and security measures.
                    Your accounts are stored locally in your browser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}