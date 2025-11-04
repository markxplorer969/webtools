'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, ExternalLink, Trash2, BarChart, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  customAlias?: string;
}



export default function URLShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [isShortening, setIsShortening] = useState(false);

  // Load URLs from localStorage on mount
  useEffect(() => {
    const savedUrls = localStorage.getItem('shortened-urls');
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
    }
  }, []);

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    if (urls.length > 0) {
      localStorage.setItem('shortened-urls', JSON.stringify(urls));
    }
  }, [urls]);

  const generateShortCode = (url: string, alias?: string): string => {
    if (alias && alias.trim()) {
      return alias.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }
    
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    let urlToShorten = originalUrl.trim();
    
    // Add protocol if missing
    if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
      urlToShorten = 'https://' + urlToShorten;
    }

    if (!isValidUrl(urlToShorten)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsShortening(true);

    try {
      // Check if custom alias already exists
      if (customAlias.trim()) {
        const existing = urls.find(url => url.shortCode === customAlias.trim().toLowerCase());
        if (existing) {
          toast.error('This custom alias is already taken');
          setIsShortening(false);
          return;
        }
      }

      const shortCode = generateShortCode(urlToShorten, customAlias);
      const shortUrl = `${window.location.origin}/s/${shortCode}`;

      const newUrl: ShortenedURL = {
        id: Date.now().toString(),
        originalUrl: urlToShorten,
        shortCode,
        shortUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
        customAlias: customAlias.trim() || undefined
      };

      setUrls([newUrl, ...urls]);
      setOriginalUrl('');
      setCustomAlias('');
      
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL');
    } finally {
      setIsShortening(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const deleteUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
    toast.success('URL deleted');
  };

  const incrementClicks = (id: string) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clicks, 0);
  };

  const getTopUrl = () => {
    if (urls.length === 0) return null;
    return urls.reduce((top, current) => 
      current.clicks > top.clicks ? current : top
    );
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
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Link className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">URL Shortener</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Create short, memorable URLs for long links
          </p>
        </motion.div>

        {/* Stats */}
        {urls.length > 0 && (
          <motion.div variants={cardVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Link className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{urls.length}</div>
                      <div className="text-sm text-gray-400">Total URLs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{getTotalClicks()}</div>
                      <div className="text-sm text-gray-400">Total Clicks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white truncate">
                        {getTopUrl()?.shortCode || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400">Top URL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* URL Shortener Form */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Shorten URL</CardTitle>
              <CardDescription className="text-gray-400">
                Enter a long URL to create a short, shareable link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Original URL *</Label>
                <Input
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Custom Alias (Optional)</Label>
                <Input
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-custom-link"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500">
                  Leave empty for random short code. Use letters, numbers, and hyphens only.
                </p>
              </div>

              <Button
                onClick={shortenUrl}
                disabled={isShortening || !originalUrl.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isShortening ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* URLs List */}
        {urls.length > 0 && (
          <motion.div variants={cardVariants}>
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Shortened URLs</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and track your shortened links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Original URL</TableHead>
                        <TableHead className="text-gray-300">Short URL</TableHead>
                        <TableHead className="text-gray-300">Clicks</TableHead>
                        <TableHead className="text-gray-300">Created</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urls.map((url) => (
                        <TableRow key={url.id} className="border-gray-700">
                          <TableCell className="text-gray-300">
                            <div className="max-w-xs truncate" title={url.originalUrl}>
                              {url.originalUrl}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 font-mono">
                                {url.shortUrl}
                              </span>
                              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                {url.customAlias || 'auto'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex items-center space-x-1">
                              <span>{url.clicks}</span>
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => copyToClipboard(url.shortUrl)}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  window.open(url.shortUrl, '_blank');
                                  incrementClicks(url.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => deleteUrl(url.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {urls.length === 0 && (
          <motion.div variants={cardVariants} className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <Link className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No shortened URLs yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first short URL to get started
            </p>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Link className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">URL Shortener Tips</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Use custom aliases for branded, memorable links</li>
                    <li>• Short URLs are perfect for social media and marketing</li>
                    <li>• Track clicks to measure engagement</li>
                    <li>• All URLs are stored locally in your browser</li>
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