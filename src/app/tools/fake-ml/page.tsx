'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Download, Users, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
/* import NativeBanner from '@/components/ads/NativeBanner'; */

const FakeMLLobby: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl('');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (username.length > 20) {
      toast.error('Username must be 20 characters or less');
      return;
    }

    setIsLoading(true);
    setImageUrl('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('username', username.trim());

      const response = await fetch('/api/tools/fake-ml', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lobby');
      }

      const data = await response.json();
      
      if (data.success && data.result) {
        setImageUrl(data.result);
        toast.success('Fake ML Lobby generated successfully!');
      } else {
        throw new Error(data.error || 'No image generated');
      }
    } catch (error) {
      console.error('Error generating fake ML lobby:', error);
      toast.error('Failed to generate lobby. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) {
      toast.error('No image to download');
      return;
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `fake-ml-lobby-${username}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully!');
  };

  const handleReset = () => {
    setUsername('');
    setSelectedImage(null);
    setImageUrl('');
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
<div className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Users className="w-10 h-10" />
            Fake ML Lobby
          </h1>
          <p className="text-gray-300">
            Buat fake Mobile Legends lobby dengan avatar dan username kustom
          </p>
        </div>

     /*   {/* Native Banner Ads - Top }
        <NativeBanner className="mb-8" /> */

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Avatar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="space-y-2">
                <Label className="text-white">Avatar Image</Label>
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                    ${isDragging ? 'border-blue-400 bg-blue-400/10' : 'border-gray-400 bg-gray-400/5'}
                    ${selectedImage ? 'border-green-400 bg-green-400/10' : ''}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {selectedImage ? (
                    <div className="space-y-4">
                      <ImageIcon className="w-12 h-12 mx-auto text-green-400" />
                      <div className="text-white">
                        <p className="font-medium">{selectedImage.name}</p>
                        <p className="text-sm text-gray-400">{formatFileSize(selectedImage.size)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div className="text-white">
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-400">JPEG, PNG, WebP (max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username ML</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">
                  {username.length}/20 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedImage || !username.trim() || isLoading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Generate Lobby
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Generated Lobby
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-400 mb-4" />
                  <p className="text-gray-300">Generating fake ML lobby...</p>
                </div>
              )}

              {!isLoading && !imageUrl && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-center">
                    No lobby generated yet.<br />
                    Upload an image and enter username to get started
                  </p>
                </div>
              )}

              {!isLoading && imageUrl && (
                <div className="space-y-4">
                  {/* Generated Image */}
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt="Generated Fake ML Lobby"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

    /*    {/* Native Banner Ads - Bottom }
       <NativeBanner className="mt-8" /> */

        {/* Instructions */}
        <Card className="mt-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Upload your avatar image (JPEG, PNG, or WebP, max 5MB)</li>
              <li>Enter your ML username (maximum 20 characters)</li>
              <li>Click "Generate Lobby" to create fake ML lobby image</li>
              <li>Download the generated image using the download button</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> This tool is for entertainment purposes only. Please use responsibly and don't use for misleading others.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FakeMLLobby;