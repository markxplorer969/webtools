'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <Layout>
      <SEO 
        title="About MarkTools - Our Story & Mission"
        description="Learn about MarkTools, our mission to provide powerful web tools for developers and creators. Built with modern technologies and user-centric design."
        canonical="/about"
      />
      <AnimatedPage>
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-16">
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-hue-text">
                Tentang MarkTools
              </h1>
              <div className="w-24 h-1 bg-hue-accent mx-auto rounded-full"></div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="space-y-6 text-lg md:text-xl text-hue-paragraph leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p>
                MarkTools adalah kumpulan tools digital yang dirancang untuk membantu developer dan kreator dalam pekerjaan sehari-hari. 
                Dengan antarmuka yang intuitif dan desain yang menarik, kami berkomitmen untuk menyediakan pengalaman pengguna yang terbaik.
              </p>
              
              <p>
                Dibuat dengan <span className="text-hue-accent font-semibold">❤️</span> menggunakan teknologi modern seperti React, Next.js, dan Tailwind CSS, 
                MarkTools menggabungkan fungsionalitas powerful dengan desain yang elegan.
              </p>

              <p>
                Setiap tool dikembangkan dengan perhatian detail untuk memastikan performa optimal dan pengalaman pengguna yang menyenangkan.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { title: "Modern Design", desc: "Desain kontemporer dengan Happy Hues" },
                { title: "Performance First", desc: "Optimasi kecepatan dan efisiensi" },
                { title: "User Friendly", desc: "Antarmuka yang mudah digunakan" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-hue-light p-6 rounded-xl border-2 border-hue-stroke/20"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(0, 24, 88, 0.1)"
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <h3 className="text-lg font-bold text-hue-text mb-2">{feature.title}</h3>
                  <p className="text-sm text-hue-paragraph">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="space-y-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-2xl font-semibold text-hue-text">Hubungi Kami</h2>
              <div className="flex justify-center space-x-6">
                {[
                  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
                  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
                  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: FaEnvelope, href: "mailto:contact@marktools.com", label: "Email" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-hue-accent text-white p-3 rounded-full hover:bg-hue-text transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                  >
                    <social.icon size={20} />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="mt-16 text-center text-hue-paragraph"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <p className="flex items-center justify-center gap-2">
                Dibuat dengan <FaHeart className="text-hue-accent fill-current" size={16} /> oleh Tim MarkTools
              </p>
              <p className="text-sm mt-2">
                © 2024 MarkTools. All rights reserved.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default AboutPage;