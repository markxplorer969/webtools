'use client';

import { Metadata } from 'next';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, RefreshCw, Shield, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// SEO Metadata (Pilar 12)
export const metadata: Metadata = {
  title: 'Password Generator - Mark Tools',
  description: 'Create strong, unique passwords with customizable options. Advanced password generator with character type selection, strength indicator, and security tips. Generate secure passwords instantly.',
  keywords: ['password generator', 'password creator', 'strong password', 'secure password', 'random password', 'password strength', 'Mark Tools'],
  authors: [{ name: 'Mark Tools Team' }],
  creator: 'Mark Tools',
  publisher: 'Mark Tools',
  robots: 'index, follow',
  openGraph: {
    title: 'Password Generator - Mark Tools',
    description: 'Create strong, unique passwords with customizable options. Advanced password generator with character type selection, strength indicator, and security tips.',
    url: 'https://marktools.com/tools/password-generator',
    siteName: 'Mark Tools',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://marktools.com/tools/password-generator/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Password Generator - Mark Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator - Mark Tools',
    description: 'Create strong, unique passwords with customizable options.',
    images: ['https://marktools.com/tools/password-generator/twitter-image.jpg'],
    creator: '@marktools',
    site: '@marktools',
  },
  alternates: {
    canonical: 'https://marktools.com/tools/password-generator',
    languages: {
      'en-US': 'https://marktools.com/en/tools/password-generator',
      'id-ID': 'https://marktools.com/id/tools/password-generator',
    },
  },
};

interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('medium');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    let similarChars = 'ilLo01O';
    let ambiguousChars = '{}[]()/\\\'"`~,;.<>';

    if (settings.includeLowercase) {
      charset += settings.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    }
    if (settings.includeUppercase) {
      charset += settings.excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (settings.includeNumbers) {
      charset += settings.excludeSimilar ? '23456789' : '0123456789';
    }
    if (settings.includeSymbols) {
      let symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
      if (settings.excludeAmbiguous) {
        symbols = symbols.split('').filter(char => !ambiguousChars.includes(char)).join('');
      }
      charset += symbols;
    }

    if (charset === '') {
      toast.error('Please select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < settings.length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    
    // Length bonus
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (pwd.length >= 16) strength++;
    
    // Character variety bonus
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else if (strength <= 6) setPasswordStrength('strong');
    else setPasswordStrength('very-strong');
  };

  const copyToClipboard = () => {
    if (!password) {
      toast.error('Generate a password first');
      return;
    }
    
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'strong': return 'text-green-400';
      case 'very-strong': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const getStrengthBg = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      case 'very-strong': return 'Very Strong';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    generatePassword();
  }, []);

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
            <Key className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Password Generator</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Create strong, unique passwords with customizable options
          </p>
        </motion.div>

        {/* Password Display */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      readOnly
                      className="bg-gray-800 border-gray-700 text-white pr-10 font-mono text-lg"
                      placeholder="Generated password will appear here"
                    />
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={generatePassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Password Strength */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Password Strength</span>
                    <Badge className={`${getStrengthBg()} text-white`}>
                      {getStrengthText()}
                    </Badge>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthBg()} transition-all duration-300`}
                      style={{ 
                        width: passwordStrength === 'weak' ? '25%' : 
                               passwordStrength === 'medium' ? '50%' : 
                               passwordStrength === 'strong' ? '75%' : '100%' 
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Password Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your password requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Password Length</Label>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {settings.length}
                  </Badge>
                </div>
                <Slider
                  value={[settings.length]}
                  onValueChange={(value) => setSettings({ ...settings, length: value[0] })}
                  max={64}
                  min={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>4</span>
                  <span>64</span>
                </div>
              </div>

              {/* Character Types */}
              <div className="space-y-4">
                <Label className="text-gray-300">Character Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={settings.includeUppercase}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeUppercase: checked as boolean })
                      }
                    />
                    <Label htmlFor="uppercase" className="text-gray-300">
                      Uppercase Letters (A-Z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={settings.includeLowercase}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeLowercase: checked as boolean })
                      }
                    />
                    <Label htmlFor="lowercase" className="text-gray-300">
                      Lowercase Letters (a-z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={settings.includeNumbers}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeNumbers: checked as boolean })
                      }
                    />
                    <Label htmlFor="numbers" className="text-gray-300">
                      Numbers (0-9)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={settings.includeSymbols}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeSymbols: checked as boolean })
                      }
                    />
                    <Label htmlFor="symbols" className="text-gray-300">
                      Symbols (!@#$%^&*)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <Label className="text-gray-300">Advanced Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-similar"
                      checked={settings.excludeSimilar}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, excludeSimilar: checked as boolean })
                      }
                    />
                    <Label htmlFor="exclude-similar" className="text-gray-300">
                      Exclude Similar (i, l, 1, L, o, 0, O)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-ambiguous"
                      checked={settings.excludeAmbiguous}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, excludeAmbiguous: checked as boolean })
                      }
                    />
                    <Label htmlFor="exclude-ambiguous" className="text-gray-300">
                      Exclude Ambiguous ({'{', '}', '[', ']', '(', ')', '/', '\\', '\'', '"', '`', '~', ',', ';', '.', '<', '>', '?'})
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={generatePassword}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Tips */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Security Tips</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Use unique passwords for each account</li>
                    <li>• Consider using a password manager for secure storage</li>
                    <li>• Enable two-factor authentication when available</li>
                    <li>• Update your passwords regularly</li>
                    <li>• Avoid using personal information in passwords</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}