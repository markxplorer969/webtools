'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link 
          href="/" 
          className="text-xl font-bold text-gray-100 hover:text-blue-400 transition-colors"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Mark Tools
        </Link>
      </div>
      
      <nav className="flex gap-6">
        <Link 
          href="/tools" 
          className="text-gray-400 hover:text-blue-400 transition-colors"
        >
          Tools
        </Link>
        <Link 
          href="/tentang" 
          className="text-gray-400 hover:text-blue-400 transition-colors"
        >
          Tentang
        </Link>
      </nav>
    </header>
  );
}