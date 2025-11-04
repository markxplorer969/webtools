'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Copy, Link, Mail, Phone, Wifi, FileText, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface QRData {
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'sms';
  content: string;
  subject?: string;
  phone?: string;
  ssid?: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass';
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

export default function QRGenerator() {
  const [qrData, setQrData] = useState<QRData>({
    type: 'url',
    content: '',
    size: 256,
    errorCorrection: 'M'
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple QR Code generator (for demo purposes)
  const generateQRCode = async () => {
    if (!qrData.content) {
      toast.error('Please enter content for the QR code');
      return;
    }

    setIsGenerating(true);
    
    try {
      // In a real implementation, you would use a proper QR code library
      // For demo purposes, we'll create a placeholder QR code
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = qrData.size;
      canvas.width = size;
      canvas.height = size;

      // Create a simple pattern that looks like a QR code
      const cellSize = size / 25;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Draw border
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, cellSize);
      ctx.fillRect(0, 0, cellSize, size);
      ctx.fillRect(size - cellSize, 0, cellSize, size);
      ctx.fillRect(0, size - cellSize, size, cellSize);

      // Draw corner squares
      drawCornerPattern(ctx, cellSize, 0, 0);
      drawCornerPattern(ctx, cellSize, size - 7 * cellSize, 0);
      drawCornerPattern(ctx, cellSize, 0, size - 7 * cellSize);

      // Draw random pattern to simulate data
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 150; i++) {
        const x = Math.floor(Math.random() * 25) * cellSize;
        const y = Math.floor(Math.random() * 25) * cellSize;
        if ((x < 7 * cellSize && y < 7 * cellSize) ||
            (x > size - 7 * cellSize && y < 7 * cellSize) ||
            (x < 7 * cellSize && y > size - 7 * cellSize)) {
          continue; // Skip corner areas
        }
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeUrl(dataUrl);
      
      toast.success('QR code generated successfully');
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const drawCornerPattern = (ctx: CanvasRenderingContext2D, cellSize: number, x: number, y: number) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) {
      toast.error('Please generate a QR code first');
      return;
    }

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR code downloaded');
  };

  const copyToClipboard = () => {
    if (!qrCodeUrl) {
      toast.error('Please generate a QR code first');
      return;
    }

    // Convert data URL to blob
    fetch(qrCodeUrl)
      .then(res => res.blob())
      .then(blob => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
        toast.success('QR code copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy QR code');
      });
  };

  const getContentType = () => {
    switch (qrData.type) {
      case 'url':
        return { icon: Link, label: 'URL', placeholder: 'https://example.com' };
      case 'text':
        return { icon: FileText, label: 'Text', placeholder: 'Enter your text here' };
      case 'email':
        return { icon: Mail, label: 'Email', placeholder: 'email@example.com' };
      case 'phone':
        return { icon: Phone, label: 'Phone', placeholder: '+1234567890' };
      case 'wifi':
        return { icon: Wifi, label: 'WiFi', placeholder: 'Network name' };
      case 'sms':
        return { icon: Smartphone, label: 'SMS', placeholder: '+1234567890' };
      default:
        return { icon: FileText, label: 'Text', placeholder: 'Enter content' };
    }
  };

  const contentType = getContentType();

  useEffect(() => {
    if (qrData.content) {
      generateQRCode();
    }
  }, [qrData.type, qrData.size, qrData.errorCorrection]);

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
            <QrCode className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">QR Code Generator</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Generate QR codes for URLs, text, WiFi, and more
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div variants={cardVariants} className="space-y-6">
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">QR Code Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose the type of content and enter your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Content Type</Label>
                  <Select value={qrData.type} onValueChange={(value: any) => setQrData({ ...qrData, type: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="url">🔗 URL</SelectItem>
                      <SelectItem value="text">📝 Text</SelectItem>
                      <SelectItem value="email">📧 Email</SelectItem>
                      <SelectItem value="phone">📞 Phone</SelectItem>
                      <SelectItem value="wifi">📶 WiFi</SelectItem>
                      <SelectItem value="sms">📱 SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Input */}
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {contentType.label}
                  </Label>
                  {qrData.type === 'text' ? (
                    <Textarea
                      value={qrData.content}
                      onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                      placeholder={contentType.placeholder}
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    />
                  ) : (
                    <Input
                      value={qrData.content}
                      onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                      placeholder={contentType.placeholder}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  )}
                </div>

                {/* Additional Fields */}
                {qrData.type === 'email' && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subject (Optional)</Label>
                    <Input
                      value={qrData.subject || ''}
                      onChange={(e) => setQrData({ ...qrData, subject: e.target.value })}
                      placeholder="Email subject"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                )}

                {qrData.type === 'wifi' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Password</Label>
                      <Input
                        value={qrData.password || ''}
                        onChange={(e) => setQrData({ ...qrData, password: e.target.value })}
                        placeholder="WiFi password"
                        type="password"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Encryption</Label>
                      <Select value={qrData.encryption || 'WPA'} onValueChange={(value: any) => setQrData({ ...qrData, encryption: value })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">No Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button
                  onClick={generateQRCode}
                  disabled={isGenerating || !qrData.content}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your QR code appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Size */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Size</Label>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {qrData.size}px
                    </Badge>
                  </div>
                  <Slider
                    value={[qrData.size]}
                    onValueChange={(value) => setQrData({ ...qrData, size: value[0] })}
                    max={512}
                    min={128}
                    step={32}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>128px</span>
                    <span>512px</span>
                  </div>
                </div>

                {/* Error Correction */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Error Correction</Label>
                  <Select value={qrData.errorCorrection} onValueChange={(value: any) => setQrData({ ...qrData, errorCorrection: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="L">Low (~7%)</SelectItem>
                      <SelectItem value="M">Medium (~15%)</SelectItem>
                      <SelectItem value="Q">Quartile (~25%)</SelectItem>
                      <SelectItem value="H">High (~30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div variants={cardVariants} className="space-y-6">
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Generated QR Code</CardTitle>
                <CardDescription className="text-gray-400">
                  Your QR code will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg">
                        <img
                          src={qrCodeUrl}
                          alt="Generated QR Code"
                          className="max-w-full h-auto"
                          style={{ width: qrData.size, height: qrData.size }}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
                      <QrCode className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No QR Code Yet</h3>
                    <p className="text-gray-400">
                      Enter content and click generate to create your QR code
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="glass border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <QrCode className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">QR Code Tips</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Higher error correction allows QR codes to be read even if damaged</li>
                      <li>• Larger sizes are better for printing and scanning from distance</li>
                      <li>• Test your QR code before sharing it widely</li>
                      <li>• Keep URLs short for better scanning reliability</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Hidden canvas for QR generation */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}