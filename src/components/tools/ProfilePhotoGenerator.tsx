'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from 'sonner';
import JSZip from 'jszip';
import NativeBanner from '@/components/ads/NativeBanner';

interface FotoCardProps {
  url: string;
  onDownload: (url: string) => void;
}

const FotoCard: React.FC<FotoCardProps> = ({ url, onDownload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <GlassCard className="overflow-hidden p-0">
        <div className="relative aspect-square">
          {/* Glare Halus (Pilar 7) */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Image Container */}
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(url)}`}
              alt="Profile photo"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback placeholder
                e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23444444'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23888888' font-family='Arial' font-size='14'%3EImage not available%3C/text%3E%3C/svg%3E`;
              }}
            />
          </div>
          
          {/* Download Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <Button
              size="sm"
              onClick={() => onDownload(url)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
              style={{ backgroundColor: 'rgba(136, 136, 136, 0.9)', color: '#121212' }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const ProfilePhotoGenerator: React.FC = () => {
  // State Management (React Hooks)
  const [gender, setGender] = useState<string>('cowo');
  const [amount, setAmount] = useState<number>(4);
  const [inputAmount, setInputAmount] = useState<string>('4');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);

  // Handle Generate
  const handleGenerate = async () => {
    setIsLoading(true);
    setPhotos([]);
    
    try {
      const response = await fetch('/api/get-pinterest-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: gender,
          amount: amount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate photos');
      }

      const data = await response.json();
      
      if (data.success && data.urls) {
        setPhotos(data.urls);
        
        // Check if fallback images were used
        const hasFallbackImages = data.urls.some(url => url.includes('picsum.photos'));
        if (hasFallbackImages) {
          toast.info(`Generated ${data.urls.length} photos using placeholder images. Pinterest API unavailable.`);
        } else {
          toast.success(`Generated ${data.urls.length} photos successfully!`);
        }
      } else {
        throw new Error(data.error || 'No photos generated');
      }
    } catch (error) {
      console.error('Error generating photos:', error);
      toast.error('Failed to generate photos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Download Single
  const handleDownload = async (url: string, filename?: string) => {
    try {
      // Validate URL before fetching
      if (!url || !url.startsWith('http')) {
        toast.error('Invalid photo URL');
        return;
      }

      // Use our proxy API to avoid CORS issues
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('Empty file received');
      }
      
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || `profile-photo-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(downloadUrl);
      toast.success('Photo downloaded successfully!');
    } catch (error) {
      console.error('Error downloading photo:', error);
      toast.error('Failed to download photo. Please try again.');
    }
  };

  // Handle Download All - Create ZIP if multiple photos
  const handleDownloadAll = async () => {
    if (photos.length === 0) {
      toast.error('No photos to download');
      return;
    }

    setIsDownloadingAll(true);

    try {
      toast.info(`Preparing ${photos.length} photos for download...`);

      // Create ZIP file
      const zip = new (await import('jszip')).default();
      
      // Add photos to ZIP sequentially to avoid overwhelming the browser
      console.log(`Starting to add ${photos.length} photos to ZIP...`);
      
      let successCount = 0;
      let failedCount = 0;
      
      for (let i = 0; i < photos.length; i++) {
        try {
          const photoUrl = photos[i];
          
          // Validate URL before fetching
          if (!photoUrl || !photoUrl.startsWith('http')) {
            console.warn(`Invalid photo URL ${i + 1}: ${photoUrl}`);
            failedCount++;
            continue;
          }
          
          console.log(`Processing photo ${i + 1}/${photos.length}: ${photoUrl}`);
          
          // Use our proxy API to avoid CORS issues
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(photoUrl)}`;
          
          // Add timeout for each photo fetch
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout for proxy
          
          const response = await fetch(proxyUrl, { 
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.warn(`Failed to fetch photo ${i + 1}: ${response.status} ${response.statusText}`);
            failedCount++;
            continue;
          }
          
          const blob = await response.blob();
          
          // Check if blob is valid image
          if (blob.size === 0) {
            console.warn(`Empty blob for photo ${i + 1}`);
            failedCount++;
            continue;
          }
          
          // Validate blob type
          const blobType = blob.type.toLowerCase();
          if (!blobType.includes('image/') && !blobType.includes('jpeg') && !blobType.includes('jpg') && !blobType.includes('png')) {
            console.warn(`Invalid blob type for photo ${i + 1}: ${blobType}`);
            failedCount++;
            continue;
          }
          
          zip.file(`photo-${i + 1}.jpg`, blob);
          successCount++;
          console.log(`Added photo ${i + 1} to ZIP`);
          
          // Small delay between processing to prevent overwhelming
          if (i % 3 === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Failed to process photo ${i + 1}:`, error);
          failedCount++;
          // Continue with next photo even if one fails
        }
      }

      console.log('All photos added to ZIP, generating file...');

      if (successCount === 0) {
        toast.error('No valid photos could be downloaded. Please try generating new photos.');
        setIsDownloadingAll(false);
        return;
      }

      toast.info(`Creating ZIP file with ${successCount} photos...`);

      // Generate ZIP file with progress
      console.log('Generating ZIP blob...');
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      console.log('ZIP blob generated, creating download link...');
      const zipUrl = URL.createObjectURL(zipBlob);

      // Download ZIP file
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `profile-photos-${gender}-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);
      console.log('ZIP file downloaded successfully!');

      if (failedCount > 0) {
        toast.warning(`Downloaded ${successCount} photos successfully. ${failedCount} photos failed to download.`);
      } else {
        toast.success(`Successfully downloaded all ${successCount} photos as ZIP file!`);
      }
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      
      // Fallback: Download photos individually if ZIP fails
      toast.error('ZIP creation failed. Downloading photos individually...');
      
      // Download photos one by one with delay
      for (let i = 0; i < photos.length; i++) {
        setTimeout(() => {
          handleDownload(photos[i], `photo-${i + 1}.jpg`);
        }, i * 500); // 500ms delay between downloads
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Handle Slider Change
  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
    setInputAmount(value[0].toString());
  };

  // Handle Input Change
  const handleInputChange = (value: string) => {
    setInputAmount(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setAmount(num);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Mission Control Layout (Pilar 10) */}
      <div className="max-w-7xl mx-auto">
        {/* Native Banner Ads - Top */}
        <NativeBanner className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Kolom Kiri - Output */}
          <div className="order-2 md:order-1">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Hasil Foto</h2>
              
              {/* Loading Area */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-gray-400 mb-4" />
                  <p className="text-gray-400">Sedang menghasilkan foto...</p>
                </div>
              )}
              
              {/* Grid Foto Area (Pilar 6) */}
              {!isLoading && photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((url, index) => (
                    <FotoCard
                      key={index}
                      url={url}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              )}
              
              {/* Empty State */}
              {!isLoading && photos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-center">
                    Belum ada foto yang dihasilkan.<br />
                    Atur pengaturan dan klik "Generate Foto"
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
          
          {/* Kolom Kanan - Input */}
          <div className="order-1 md:order-2">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Profile Photo Generator
                </h1>
                <p className="text-gray-400">
                  Hasilkan foto profil untuk cowo atau cewe dengan mudah
                </p>
              </div>
              
              {/* Panel Kontrol (Pilar 5 & 9) */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Pengaturan</h3>
                
                {/* Pilihan Gender */}
                <div className="mb-6">
                  <Label className="text-white mb-3 block">Jenis Kelamin</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={setGender}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cowo" id="cowo" />
                      <Label htmlFor="cowo" className="text-white">Cowo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cewe" id="cewe" />
                      <Label htmlFor="cewe" className="text-white">Cewe</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Pilihan Jumlah */}
                <div className="mb-6">
                  <Label className="text-white mb-3 block">
                    Jumlah Foto: {amount}
                  </Label>
                  
                  {/* Slider */}
                  <div className="mb-4">
                    <Slider
                      value={[amount]}
                      onValueChange={handleSliderChange}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>
                  
                  {/* Custom Input */}
                  <div>
                    <Label className="text-white mb-2 block">Atau masukkan angka (1-100)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={inputAmount}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Masukkan jumlah foto"
                    />
                  </div>
                </div>
                
                {/* Tombol Aksi (Pilar 9 - Hirarki Tombol) */}
                <div className="space-y-3">
                  {/* Tombol Primer */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full"
                    style={{ backgroundColor: '#888888', color: '#121212' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menghasilkan...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Generate Foto
                      </>
                    )}
                  </Button>
                  
                  {/* Tombol Sekunder */}
                  <Button
                    onClick={handleDownloadAll}
                    disabled={photos.length === 0 || isDownloadingAll}
                    variant="outline"
                    className="w-full"
                    style={{ borderColor: '#888888', color: '#888888' }}
                  >
                    {isDownloadingAll ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating ZIP...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Semua ({photos.length})
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Native Banner Ads - Bottom */}
        <NativeBanner className="mt-8" />
      </div>
    </div>
  );
};

export default ProfilePhotoGenerator;