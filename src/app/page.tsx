'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowRight, 
  FastForward, 
  ShieldCheck, 
  Sparkles, 
  Coffee
} from 'lucide-react';
import allToolsData from '@/lib/toolsData';

export default function Home() {
  // Hitung statistik
  const totalTools = allToolsData.reduce((acc, category) => acc + category.tools.length, 0);
  const totalCategories = allToolsData.length;

  // State untuk glare effect
  const [glarePositions, setGlarePositions] = useState<{[key: string]: {x: number, y: number}}>({});

  // Glare effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setGlarePositions(prev => ({
      ...prev,
      [cardId]: { x, y }
    }));
  };

  const handleMouseLeave = (cardId: string) => {
    setGlarePositions(prev => ({
      ...prev,
      [cardId]: { x: -100, y: -100 }
    }));
  };

  // Animation variants
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className="absolute top-20 left-10 w-20 h-20 bg-electric-blue/10 rounded-full blur-xl"
          />
          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute top-40 right-20 w-32 h-32 bg-mint-green/10 rounded-full blur-xl"
          />
          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 2 }}
            className="absolute bottom-20 left-1/4 w-24 h-24 bg-electric-blue/10 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-off-white mb-6"
          >
            Mark Tools
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-neutral-grey mt-4 mb-10 max-w-4xl mx-auto px-4"
          >
            Kumpulan Alat Instan untuk Produktivitas Harian Anda
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-electric-blue text-dark-charcoal font-heading font-bold text-lg py-4 px-8 rounded-full transition-all hover:bg-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-electric-blue/25"
            >
              Jelajahi Semua Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Statistics Grid - Integrated into Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 mt-12 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-lg text-center glass-hover glare-effect"
            >
              <div className="text-3xl md:text-4xl font-bold text-electric-blue mb-2">
                {totalTools}
              </div>
              <div className="text-sm text-white/70">Tools Tersedia</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-lg text-center glass-hover glare-effect"
            >
              <div className="text-3xl md:text-4xl font-bold text-electric-blue mb-2">
                {totalCategories}
              </div>
              <div className="text-sm text-white/70">Kategori</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-lg text-center glass-hover glare-effect"
            >
              <div className="text-3xl md:text-4xl font-bold text-mint-green mb-2">
                100%
              </div>
              <div className="text-sm text-white/70">Gratis</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-lg text-center glass-hover glare-effect"
            >
              <div className="text-3xl md:text-4xl font-bold text-mint-green mb-2">
                0ms
              </div>
              <div className="text-sm text-white/70">Loading Time</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-off-white mb-4">
              Kenapa Mark Tools?
            </h2>
            <p className="text-lg text-neutral-grey max-w-2xl mx-auto">
              Alat yang dirancang untuk memaksimalkan produktivitas Anda
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="relative p-6 rounded-lg h-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/15 transition-colors flex flex-col items-center text-center group glare-effect"
              onMouseMove={(e) => handleMouseMove(e, 'fast')}
              onMouseLeave={() => handleMouseLeave('fast')}
            >
              {/* Glare Layer */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 600px at ${glarePositions.fast?.x || -100}px ${glarePositions.fast?.y || -100}px, rgba(255, 255, 255, 0.1), transparent 40%)`,
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mb-6"
              >
                <FastForward className="w-8 h-8 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-white mb-4">
                Instan & Cepat
              </h3>
              <p className="text-white/70 leading-relaxed">
                Semua alat berjalan 100% di browser Anda (client-side). Tanpa upload, tanpa menunggu server.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="relative p-6 rounded-lg h-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/15 transition-colors flex flex-col items-center text-center group glare-effect"
              onMouseMove={(e) => handleMouseMove(e, 'privacy')}
              onMouseLeave={() => handleMouseLeave('privacy')}
            >
              {/* Glare Layer */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 600px at ${glarePositions.privacy?.x || -100}px ${glarePositions.privacy?.y || -100}px, rgba(255, 255, 255, 0.1), transparent 40%)`,
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mb-6"
              >
                <ShieldCheck className="w-8 h-8 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-white mb-4">
                Privasi Terjaga
              </h3>
              <p className="text-white/70 leading-relaxed">
                Data Anda tidak pernah dikirim atau disimpan di server kami. Sepenuhnya aman di perangkat Anda.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="relative p-6 rounded-lg h-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/15 transition-colors flex flex-col items-center text-center group glare-effect"
              onMouseMove={(e) => handleMouseMove(e, 'free')}
              onMouseLeave={() => handleMouseLeave('free')}
            >
              {/* Glare Layer */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 600px at ${glarePositions.free?.x || -100}px ${glarePositions.free?.y || -100}px, rgba(255, 255, 255, 0.1), transparent 40%)`,
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mb-6"
              >
                <Sparkles className="w-8 h-8 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-white mb-4">
                Gratis & Bebas Iklan
              </h3>
              <p className="text-white/70 leading-relaxed">
                Gunakan semua alat sepuasnya tanpa biaya tersembunyi atau iklan yang mengganggu.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl py-16 px-8 text-center relative overflow-hidden glass-hover glare-effect"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 border-2 border-electric-blue/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-32 h-32 border-2 border-mint-green/20 rounded-full"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Coffee className="w-8 h-8 text-electric-blue" />
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-heading font-semibold text-off-white mb-4">
                Dukung Pengembangan Mark Tools
              </h3>
              
              <p className="text-lg text-neutral-grey max-w-2xl mx-auto mb-8">
                Website ini dikelola secara independen. Jika Anda merasa terbantu, pertimbangkan untuk memberikan donasi untuk membantu biaya server dan pengembangan fitur baru.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://trakteer.id/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-electric-blue text-dark-charcoal font-bold py-3 px-8 rounded-full transition-all hover:bg-blue-400 hover:shadow-lg hover:shadow-electric-blue/25"
                >
                  <Coffee className="w-5 h-5" />
                  Trakteer Kopi
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}