import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6 px-6 mt-12">
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-2">
          © 2025 Mark Tools. All rights reserved.
        </p>
        <Link 
          href="/kebijakan-privasi" 
          className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
        >
          Kebijakan Privasi
        </Link>
      </div>
    </footer>
  );
}