'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Users, Target, Award } from 'lucide-react';
import Link from 'next/link';



export default function TentangPage() {
  const values = [
    {
      icon: Shield,
      title: "Keamanan Prioritas",
      description: "Semua data Anda diproses secara lokal di browser. Tidak ada tracking, penyimpanan, atau berbagikan informasi pribadi. Privasi Anda adalah prioritas utama kami."
    },
    {
      icon: Zap,
      title: "Kecepatan Instan",
      description: "Tools yang bekerja langsung di browser Anda. Tidak perlu download, instalasi, atau registrasi. Kinerja instan tanpa kompromi."
    },
    {
      icon: Heart,
      title: "Akses Gratis",
      description: "Semua tools kami tersedia 100% gratis. Tidak ada biaya tersembunyi, tidak ada iklan premium. Tools elegan untuk semua orang."
    },
    {
      icon: Users,
      title: "Desain untuk Fokus",
      description: "Antarmuka yang dirancang untuk menghilangkan gangguan dan membantu Anda fokus pada apa yang penting. Minimalis maksimal produktivitas."
    },
    {
      icon: Target,
      title: "Kualitas Terjamin",
      description: "Setiap tool dikembangkan dengan standar kualitas tinggi. Kami berkomitmen untuk memberikan pengalaman pengguna yang terbaik."
    },
    {
      icon: Award,
      title: "Inovasi Berkelanjutan",
      description: "Kami terus berinovasi dan menambah tools baru berdasarkan kebutuhan komunitas modern creators."
    }
  ];

  const teamMembers = [
    {
      name: "Development Team",
      role: "Full-Stack Developers & UI/UX Designers",
      description: "Tim pengembang berpengalaman dalam React, Next.js, dan TypeScript dengan fokus pada kualitas dan performa."
    },
    {
      name: "Design Team",
      role: "UI/UX Designers & Brand Strategists",
      description: "Tim desain yang menciptakan pengalaman visual yang elegan dan intuitif dengan prinsip minimalis."
    },
    {
      name: "Community Team",
      role: "Community Managers & Support Specialists",
      description: "Tim yang mendukung dan membantu komunitas pengguna Mark Tools."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-heading font-bold text-primary-text leading-tight"
              variants={containerVariants}
            >
              Tentang Mark Tools
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-secondary-text max-w-2xl mx-auto leading-relaxed"
              variants={containerVariants}
            >
              Platform digital utilities yang dirancang dengan filosofi minimalis untuk memberdayakan produktivitas maksimal modern creators.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={containerVariants}
            >
              <Link 
                href="/tools"
                className="group px-8 py-4 bg-accent text-dark-char rounded-lg hover:bg-secondary-text transition-all duration-300 font-semibold text-lg flex items-center space-x-2 transform hover:scale-105"
              >
                <span>Jelajahi Tools</span>
              </Link>
              
              <Link 
                href="#values"
                className="px-8 py-4 border border-accent text-accent rounded-lg hover:bg-accent hover:text-dark-char transition-all duration-300 font-semibold text-lg"
              >
                Nilai Kami
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        id="values"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-6">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-secondary-text max-w-2xl mx-auto">
              Prinsip yang menjadi fondasi dalam setiap tool yang kami kembangkan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div 
                  className="glass rounded-2xl p-8 h-full relative overflow-hidden cursor-pointer"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                  }}
                  onMouseLeave={() => {}}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 50%)`
                  }}
                >
                  {/* Glare Layer */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04), transparent 30%)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors duration-300">
                      <value.icon className="w-8 h-8 text-accent" />
                    </div>
                    
                    <h3 className="text-2xl font-heading font-semibold text-primary-text mb-4">
                      {value.title}
                    </h3>
                    
                    <p className="text-secondary-text leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-6">
              Tim Kami
            </h2>
            <p className="text-xl text-secondary-text max-w-2xl mx-auto">
              Tim berdedikasi yang bersemangat untuk memberikan pengalaman terbaik untuk pengguna Mark Tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div 
                  className="glass rounded-2xl p-8 h-full relative overflow-hidden cursor-pointer"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                  }}
                  onMouseLeave={() => {}}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 50%)`
                  }}
                >
                  {/* Glare Layer */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04), transparent 30%)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors duration-300">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    
                    <h3 className="text-2xl font-heading font-semibold text-primary-text mb-4">
                      {member.role}
                    </h3>
                    
                    <p className="text-secondary-text leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={containerVariants}
            className="max-w-2xl mx-auto space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-6">
              Siap untuk Memulai Perjalanan Anda
            </h2>
            <p className="text-xl text-secondary-text leading-relaxed mb-8">
              Bergabung dengan komunitas modern creators dan tingkatkan produktivitas Anda dengan tools elegan kami.
            </p>
            
            <motion.div
              variants={containerVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/tools"
                className="group px-8 py-4 bg-accent text-dark-char rounded-lg hover:bg-secondary-text transition-all duration-300 font-semibold text-lg flex items-center space-x-2 transform hover:scale-105"
              >
                <span>Mulai Sekarang</span>
              </Link>
              
              <Link 
                href="#contact"
                className="px-8 py-4 border border-accent text-accent rounded-lg hover:bg-accent hover:text-dark-char transition-all duration-300 font-semibold text-lg"
              >
                Hubungi Kami
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}