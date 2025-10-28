'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  FastForward, 
  ShieldCheck, 
  Sparkles, 
  Coffee,
  QrCode,
  KeyRound,
  FileText,
  Palette,
  Paintbrush,
  ShieldCheck as Shield,
  Link as LinkIcon,
  CaseUpper,
  Image,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import allToolsData from '@/lib/toolsData';

export default function Home() {
  // Hitung statistik
  const totalTools = allToolsData.reduce((acc, category) => acc + category.tools.length, 0);
  const totalCategories = allToolsData.length;

  // Ambil 6 tools pertama untuk preview
  const featuredTools = allToolsData.flatMap(category => category.tools).slice(0, 6);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
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
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-2 text-neutral-grey"
            >
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-sm">100% Gratis • Tanpa Registrasi</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-dark-grey p-6 rounded-lg text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-electric-blue mb-2">
                {totalTools}
              </div>
              <div className="text-sm text-neutral-grey">Tools Tersedia</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-dark-grey p-6 rounded-lg text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-electric-blue mb-2">
                {totalCategories}
              </div>
              <div className="text-sm text-neutral-grey">Kategori</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-dark-grey p-6 rounded-lg text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-mint-green mb-2">
                100%
              </div>
              <div className="text-sm text-neutral-grey">Gratis</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-dark-grey p-6 rounded-lg text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-mint-green mb-2">
                0ms
              </div>
              <div className="text-sm text-neutral-grey">Loading Time</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools Preview */}
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
              Tools Populer
            </h2>
            <p className="text-lg text-neutral-grey max-w-2xl mx-auto">
              Intip beberapa tools yang paling banyak digunakan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-dark-grey p-6 rounded-lg opacity-60 cursor-not-allowed relative group"
                >
                  {/* Badge */}
                  <span className="absolute top-3 right-3 bg-neutral-grey text-dark-charcoal text-xs font-bold py-1 px-2 rounded-full">
                    Segera Hadir
                  </span>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="mb-4"
                    >
                      <IconComponent className="w-12 h-12 text-electric-blue opacity-80" />
                    </motion.div>
                    <h3 className="text-lg font-heading font-semibold text-off-white mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-neutral-grey leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 border-2 border-electric-blue text-electric-blue font-semibold py-3 px-6 rounded-full transition-all hover:bg-electric-blue hover:text-dark-charcoal hover:scale-105"
            >
              Lihat Semua Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-dark-grey p-8 rounded-lg text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FastForward className="w-8 h-8 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-off-white mb-4">
                Instan & Cepat
              </h3>
              <p className="text-neutral-grey leading-relaxed">
                Semua alat berjalan 100% di browser Anda (client-side). Tanpa upload, tanpa menunggu server.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-dark-grey p-8 rounded-lg text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <ShieldCheck className="w-8 h-8 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-off-white mb-4">
                Privasi Terjaga
              </h3>
              <p className="text-neutral-grey leading-relaxed">
                Data Anda tidak pernah dikirim atau disimpan di server kami. Sepenuhnya aman di perangkat Anda.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-dark-grey p-8 rounded-lg text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-8 h-8 text-electric-blue" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-off-white mb-4">
                Gratis & Bebas Iklan
              </h3>
              <p className="text-neutral-grey leading-relaxed">
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
            className="bg-dark-grey rounded-2xl py-16 px-8 text-center relative overflow-hidden"
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