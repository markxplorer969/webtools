'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { ArrowRight, Sparkles, Shield, Facebook, Instagram, FileText, User, Zap, Heart } from 'lucide-react';

export default function Home() {
  const featuredTools = [
    {
      icon: Shield,
      title: "2FA Authenticator",
      description: "Manage your 2FA tokens with auto-refresh",
      slug: "2fa-generator",
      color: "text-green-600"
    },
    {
      icon: Facebook,
      title: "FB UID Checker",
      description: "Check Facebook account status in bulk",
      slug: "facebook-uid",
      color: "text-blue-600"
    },
    {
      icon: Instagram,
      title: "IG Username Checker",
      description: "Verify Instagram username availability",
      slug: "ig-username-checker",
      color: "text-pink-600"
    },
    {
      icon: FileText,
      title: "Temp Notes",
      description: "Mini spreadsheet with auto-save",
      slug: "temp-notes",
      color: "text-emerald-600"
    },
    {
      icon: User,
      title: "Username Generator",
      description: "Create Indonesian-style usernames",
      slug: "username-generator",
      color: "text-indigo-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center text-center gap-8 p-4 relative min-h-screen">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-hue-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            MarkTools
          </motion.h1>

          <motion.div 
            className="text-2xl md:text-4xl text-hue-paragraph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Kumpulan Tools untuk{' '}
            <span className="text-hue-accent font-semibold">Developer</span>
          </motion.div>

          <motion.p 
            className="text-lg md:text-xl text-hue-paragraph max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Koleksi 5+ tools powerful untuk meningkatkan produktivitas Anda. 
            Dari 2FA authenticator hingga username generator, semua yang Anda butuhkan dalam satu platform.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.a
              href="/tools"
              className="bg-hue-accent text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-hue-text transition-colors duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(245, 130, 174, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Jelajahi Semua Tools
              <ArrowRight size={20} />
            </motion.a>
            
            <motion.a
              href="/about"
              className="border-2 border-hue-stroke text-hue-text px-8 py-4 rounded-full font-semibold text-lg hover:bg-hue-text hover:text-hue-background transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: '#001858',
                color: '#fef6e4'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Pelajari Lebih Lanjut
            </motion.a>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            {[
              { number: "7+", label: "Tools Available" },
              { number: "100%", label: "Free to Use" },
              { number: "24/7", label: "Always Online" },
              { number: "10K+", label: "Happy Users" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-hue-accent mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-hue-paragraph">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 text-hue-blue opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles size={30} />
          </motion.div>

          <motion.div
            className="absolute top-40 right-10 text-hue-accent opacity-20"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap size={25} />
          </motion.div>
        </div>

        {/* Featured Tools Section */}
        <section className="py-20 bg-hue-light/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-hue-text mb-4">
                Featured Tools
              </h2>
              <p className="text-lg md:text-xl text-hue-paragraph max-w-2xl mx-auto">
                Tools paling populer yang sering digunakan oleh pengguna kami
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, index) => (
                <motion.a
                  key={index}
                  href={`/tools/${tool.slug}`}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-white p-6 rounded-2xl border-2 border-hue-stroke/20 hover:border-hue-accent/50 transition-all duration-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-hue-light ${tool.color}`}>
                        <tool.icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-hue-text group-hover:text-hue-accent transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-hue-paragraph mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-hue-accent font-medium group-hover:text-hue-text transition-colors">
                      <span>Coba Sekarang</span>
                      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="/tools"
                className="inline-flex items-center gap-2 px-8 py-3 bg-hue-text text-white rounded-full font-semibold hover:bg-hue-accent transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat Semua Tools
                <ArrowRight size={18} />
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-hue-text mb-4">
                Mengapa MarkTools?
              </h2>
              <p className="text-lg md:text-xl text-hue-paragraph max-w-2xl mx-auto">
                Platform yang dirancang untuk memberikan pengalaman terbaik dengan teknologi modern
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Zap, 
                  title: "Lightning Fast", 
                  desc: "Optimasi performa dengan teknologi terkini untuk pengalaman yang cepat dan responsif" 
                },
                { 
                  icon: Shield, 
                  title: "Secure & Private", 
                  desc: "Data Anda aman dengan enkripsi dan tidak ada penyimpanan informasi pribadi yang tidak perlu" 
                },
                { 
                  icon: Heart, 
                  title: "Free Forever", 
                  desc: "Semua tools gratis untuk digunakan tanpa batasan, dukung kami untuk terus berkembang" 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
                    className="flex justify-center mb-6"
                  >
                    <div className="p-4 rounded-2xl bg-hue-light text-hue-accent">
                      <feature.icon size={40} />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-hue-text mb-3">{feature.title}</h3>
                  <p className="text-hue-paragraph leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}