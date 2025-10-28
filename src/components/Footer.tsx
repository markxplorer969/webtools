"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Github, Heart, Mail, MessageCircle, Instagram, Music, Code } from "lucide-react"
import { socialLinks, donationLinks, otherLinks } from "@/data/links"

export default function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="bg-gray-900 py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">Mark Tools</h3>
            <p className="text-gray-400 text-sm mb-4">
              Koleksi tools gratis untuk meningkatkan produktivitas Anda.
            </p>
            <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm">
              <span>Dibuat dengan</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              <span>oleh Mark</span>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Ikuti Kami</h4>
            <div className="flex justify-center space-x-6 mb-4">
              <a
                href={socialLinks.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
                title={socialLinks.instagram.display}
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={socialLinks.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
                title={socialLinks.tiktok.display}
              >
                <Music className="w-6 h-6" />
              </a>
              <a
                href={socialLinks.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                title={socialLinks.github.display}
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href={socialLinks.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-110"
                title={socialLinks.whatsapp.display}
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Hubungi kami di{" "}
              <a 
                href="mailto:markpengembara76@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                markpengembara76@gmail.com
              </a>
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h4>
            <div className="space-y-2">
              <Link
                href={otherLinks.privacy.url}
                className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
              >
                {otherLinks.privacy.display}
              </Link>
              <Link
                href={otherLinks.terms.url}
                className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
              >
                {otherLinks.terms.display}
              </Link>
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              ❤️ Dukung pengembangan tools ini dengan donasi
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href={donationLinks.saweria.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                {donationLinks.saweria.display}
              </a>
              <a
                href={donationLinks.paypal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                {donationLinks.paypal.display}
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {mounted ? new Date().getFullYear() : 2025} Mark Tools. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}