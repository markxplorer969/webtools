"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Github, Instagram, Music, MessageCircle, Heart } from "lucide-react"
import { socialLinks } from "@/data/links"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 shadow-lg' 
        : 'bg-gray-900 border-b border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-white hover:text-blue-400 transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Mark Tools
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
            >
              Beranda
            </Link>
            <Link 
              href="/tools" 
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
            >
              Tools
            </Link>
            <Link 
              href="/tentang" 
              className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
            >
              Tentang
            </Link>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-700">
              <a
                href={socialLinks.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                title={socialLinks.github.display}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
                title={socialLinks.instagram.display}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
                title={socialLinks.tiktok.display}
              >
                <Music className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-110"
                title={socialLinks.whatsapp.display}
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
              >
                Beranda
              </Link>
              <Link 
                href="/tools" 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
              >
                Tools
              </Link>
              <Link 
                href="/tentang" 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
              >
                Tentang
              </Link>
              
              {/* Mobile Social Links */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-3">Ikuti Kami</p>
                <div className="flex gap-4">
                  <a
                    href={socialLinks.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                    title={socialLinks.github.display}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={socialLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
                    title={socialLinks.instagram.display}
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={socialLinks.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
                    title={socialLinks.tiktok.display}
                  >
                    <Music className="w-5 h-5" />
                  </a>
                  <a
                    href={socialLinks.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-110"
                    title={socialLinks.whatsapp.display}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}