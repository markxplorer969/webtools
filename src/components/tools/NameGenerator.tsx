'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

// Import data nama
import { INDONESIA_DEPAN_COWO } from '@/lib/data/names/indonesia_depan_cowo';
import { INDONESIA_DEPAN_CEWE } from '@/lib/data/names/indonesia_depan_cewe';
import { INDONESIA_BELAKANG } from '@/lib/data/names/indonesia_belakang';
import { INGGRIS_DEPAN_COWO } from '@/lib/data/names/inggris_depan_cowo';
import { INGGRIS_DEPAN_CEWE } from '@/lib/data/names/inggris_depan_cewe';
import { INGGRIS_BELAKANG } from '@/lib/data/names/inggris_belakang';
import { CHINA_DEPAN_COWO } from '@/lib/data/names/china_depan_cowo';
import { CHINA_DEPAN_CEWE } from '@/lib/data/names/china_depan_cewe';
import { CHINA_BELAKANG } from '@/lib/data/names/china_belakang';
import { JEPANG_DEPAN_COWO } from '@/lib/data/names/jepang_depan_cowo';
import { JEPANG_DEPAN_CEWE } from '@/lib/data/names/jepang_depan_cewe';
import { JEPANG_BELAKANG } from '@/lib/data/names/jepang_belakang';
import { CHINA_AKSARA_DEPAN_COWO } from '@/lib/data/names/china_aksara_depan_cowo';
import { CHINA_AKSARA_DEPAN_CEWE } from '@/lib/data/names/china_aksara_depan_cewe';
import { CHINA_AKSARA_BELAKANG } from '@/lib/data/names/china_aksara_belakang';
import { JEPANG_AKSARA_DEPAN_COWO } from '@/lib/data/names/jepang_aksara_depan_cowo';
import { JEPANG_AKSARA_DEPAN_CEWE } from '@/lib/data/names/jepang_aksara_depan_cewe';
import { JEPANG_AKSARA_BELAKANG } from '@/lib/data/names/jepang_aksara_belakang';

const NameGenerator = () => {
  // State management
  const [source, setSource] = useState('indonesia');
  const [gender, setGender] = useState('cowo');
  const [structure, setStructure] = useState('depan_belakang');
  const [aksara, setAksara] = useState('latin');
  const [amount, setAmount] = useState([10]);
  const [results, setResults] = useState<string[]>([]);

  // Fungsi untuk mendapatkan nama depan berdasarkan sumber, gender, dan aksara
  const getFirstNameList = () => {
    if (aksara === 'aksara') {
      switch (source) {
        case 'china':
          return gender === 'cowo' ? CHINA_AKSARA_DEPAN_COWO : 
                 gender === 'cewe' ? CHINA_AKSARA_DEPAN_CEWE :
                 [...CHINA_AKSARA_DEPAN_COWO, ...CHINA_AKSARA_DEPAN_CEWE];
        case 'jepang':
          return gender === 'cowo' ? JEPANG_AKSARA_DEPAN_COWO : 
                 gender === 'cewe' ? JEPANG_AKSARA_DEPAN_CEWE :
                 [...JEPANG_AKSARA_DEPAN_COWO, ...JEPANG_AKSARA_DEPAN_CEWE];
        default:
          return CHINA_AKSARA_DEPAN_COWO;
      }
    } else {
      switch (source) {
        case 'indonesia':
          return gender === 'cowo' ? INDONESIA_DEPAN_COWO : 
                 gender === 'cewe' ? INDONESIA_DEPAN_CEWE :
                 [...INDONESIA_DEPAN_COWO, ...INDONESIA_DEPAN_CEWE];
        case 'inggris':
          return gender === 'cowo' ? INGGRIS_DEPAN_COWO : 
                 gender === 'cewe' ? INGGRIS_DEPAN_CEWE :
                 [...INGGRIS_DEPAN_COWO, ...INGGRIS_DEPAN_CEWE];
        case 'china':
          return gender === 'cowo' ? CHINA_DEPAN_COWO : 
                 gender === 'cewe' ? CHINA_DEPAN_CEWE :
                 [...CHINA_DEPAN_COWO, ...CHINA_DEPAN_CEWE];
        case 'jepang':
          return gender === 'cowo' ? JEPANG_DEPAN_COWO : 
                 gender === 'cewe' ? JEPANG_DEPAN_CEWE :
                 [...JEPANG_DEPAN_COWO, ...JEPANG_DEPAN_CEWE];
        default:
          return INDONESIA_DEPAN_COWO;
      }
    }
  };

  // Fungsi untuk mendapatkan nama belakang berdasarkan sumber dan aksara
  const getLastNameList = () => {
    if (aksara === 'aksara') {
      switch (source) {
        case 'china':
          return CHINA_AKSARA_BELAKANG;
        case 'jepang':
          return JEPANG_AKSARA_BELAKANG;
        default:
          return CHINA_AKSARA_BELAKANG;
      }
    } else {
      switch (source) {
        case 'indonesia':
          return INDONESIA_BELAKANG;
        case 'inggris':
          return INGGRIS_BELAKANG;
        case 'china':
          return CHINA_BELAKANG;
        case 'jepang':
          return JEPANG_BELAKANG;
        default:
          return INDONESIA_BELAKANG;
      }
    }
  };

  // Fungsi untuk menghasilkan nama acak
  const getRandomName = (list: string[]) => {
    return list[Math.floor(Math.random() * list.length)];
  };

  // Handle generate names
  const handleGenerate = () => {
    const newResults: string[] = [];
    const firstNameList = getFirstNameList();
    const lastNameList = getLastNameList();

    for (let i = 0; i < amount[0]; i++) {
      const firstName = getRandomName(firstNameList);
      
      if (structure === 'depan_saja') {
        newResults.push(firstName);
      } else {
        const lastName = getRandomName(lastNameList);
        newResults.push(`${firstName} ${lastName}`);
      }
    }

    setResults(newResults);
    toast.success(`Berhasil menghasilkan ${newResults.length} nama!`);
  };

  // Handle copy single name
  const handleCopySingle = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success('Nama berhasil disalin!');
  };

  // Handle copy all results
  const handleCopyAll = () => {
    if (results.length === 0) {
      toast.error('Tidak ada hasil untuk disalin!');
      return;
    }
    
    const allNames = results.join('\n');
    navigator.clipboard.writeText(allNames);
    toast.success(`Berhasil menyalin ${results.length} nama!`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Name Generator</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Hasilkan nama unik (Indonesia, Inggris, China, Jepang) dengan opsi aksara untuk China dan Jepang.
          </p>
        </div>

        {/* Layout Grid - Mission Control 2-Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolom Kiri - Kontrol */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Pengaturan Generator</h2>
              
              {/* Kontrol Sumber */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sumber Nama
                </label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Pilih sumber" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="indonesia" className="text-white">Indonesia</SelectItem>
                    <SelectItem value="inggris" className="text-white">Inggris</SelectItem>
                    <SelectItem value="china" className="text-white">China</SelectItem>
                    <SelectItem value="jepang" className="text-white">Jepang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kontrol Gender */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Pilih gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="cowo" className="text-white">Cowo</SelectItem>
                    <SelectItem value="cewe" className="text-white">Cewe</SelectItem>
                    <SelectItem value="semua" className="text-white">Semua</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kontrol Aksara */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jenis Aksara
                </label>
                <Select value={aksara} onValueChange={setAksara}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Pilih aksara" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="latin" className="text-white">Latin (A-Z)</SelectItem>
                    <SelectItem value="aksara" className="text-white">Aksara (China/Jepang)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kontrol Struktur Nama */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Struktur Nama
                </label>
                <Select value={structure} onValueChange={setStructure}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Pilih struktur" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="depan_saja" className="text-white">Depan Saja</SelectItem>
                    <SelectItem value="depan_belakang" className="text-white">Depan & Belakang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kontrol Jumlah - Enhanced Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    Jumlah Nama
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                      {amount[0]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {amount[0] === 1 ? 'nama' : 'nama'}
                    </span>
                  </div>
                </div>
                
                {/* Custom Slider dengan Visual Feedback */}
                <div className="relative">
                  <Slider
                    value={amount}
                    onValueChange={setAmount}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  
                  {/* Visual Indicators */}
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">1</span>
                    <span className="text-xs text-gray-500">10</span>
                    <span className="text-xs text-gray-500">25</span>
                    <span className="text-xs text-gray-500">50</span>
                  </div>
                  
                  {/* Quick Select Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => setAmount([5])}
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs ${
                        amount[0] === 5 
                          ? 'bg-accent/20 text-accent border-accent/30' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      5
                    </Button>
                    <Button
                      onClick={() => setAmount([10])}
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs ${
                        amount[0] === 10 
                          ? 'bg-accent/20 text-accent border-accent/30' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      10
                    </Button>
                    <Button
                      onClick={() => setAmount([20])}
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs ${
                        amount[0] === 20 
                          ? 'bg-accent/20 text-accent border-accent/30' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      20
                    </Button>
                    <Button
                      onClick={() => setAmount([50])}
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs ${
                        amount[0] === 50 
                          ? 'bg-accent/20 text-accent border-accent/30' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      50
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerate}
                  className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </Button>
                <Button 
                  onClick={handleCopyAll}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Salin Semua
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Kolom Kanan - Hasil */}
          <div className="space-y-6">
            <GlassCard className="p-6 min-h-[600px]">
              <h2 className="text-xl font-semibold text-white mb-6">Hasil Generator</h2>
              
              {/* Area Hasil dengan Animasi */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {results.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <p className="text-gray-400">Klik tombol "Generate" untuk memulai</p>
                    </motion.div>
                  ) : (
                    results.map((name, index) => (
                      <motion.div
                        key={`${name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-white font-medium">{name}</span>
                        <Button
                          onClick={() => handleCopySingle(name)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;