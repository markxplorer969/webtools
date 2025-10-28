'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search 
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-electric-blue' : 'text-neutral-grey'
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Cari tools yang Anda butuhkan..."
          className="w-full pl-12 pr-4 py-3 bg-dark-grey border border-neutral-grey rounded-lg 
                     text-off-white placeholder-neutral-grey
                     focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20
                     transition-all duration-200"
        />
      </div>
    </div>
  );
}