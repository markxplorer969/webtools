import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles } from 'lucide-react';

const IndoUsernameGen = () => {
  const [keyword, setKeyword] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Indonesian words arrays
  const adjectives = [
    'cantik', 'ganteng', 'manis', 'cakep', 'boleh', 'asyik', 'seru', 'keren',
    'hebat', 'jago', 'pintar', 'cerdas', 'bijak', 'baik', 'ramah', 'sopan',
    'muda', 'mudi', 'remaja', 'dewasa', 'senang', 'gembira', 'bahagia', 'ceria',
    'periang', 'lucu', 'humoris', 'setia', 'jujur', 'tulus', 'ikhlas', 'sabar',
    'tenang', 'damai', 'sejuk', 'hangat', 'nyaman', 'aman', 'pasti', 'yakin',
    'percaya', 'optimis', 'positif', 'proaktif', 'kreatif', 'inovatif', 'inspiratif',
    'motivasi', 'sukses', 'berhasil', 'menang', 'juara', 'pemenang', 'champion',
    'bintang', 'star', 'famous', 'viral', 'trending', 'populer', 'terkenal',
    'artis', 'idola', 'panutan', 'teladan', 'contoh', 'rolemodel', 'inspirasi'
  ];

  const slangWords = [
    'gue', 'lo', 'kamu', 'dia', 'mereka', 'kita', 'saya', 'aku',
    'bro', 'sis', 'guy', 'girl', 'buddy', 'friend', 'sahabat', 'teman',
    'jomblo', 'single', 'pacar', 'couple', 'relationship', 'cinta', 'love',
    'sayang', 'honey', 'baby', 'dear', 'sweetheart', 'darling', 'angel',
    'devil', 'demon', 'vampire', 'werewolf', 'zombie', 'ghost', 'spirit',
    'dragon', 'phoenix', 'unicorn', 'fairy', 'wizard', 'witch', 'magic',
    'power', 'energy', 'force', 'strength', 'mighty', 'super', 'ultra',
    'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta', 'nano',
    'micro', 'milli', 'kilo', 'hecto', 'deca', 'centi', 'deci', 'base'
  ];

  const numbers = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '404', '777', '888', '999', '123', '456', '789', '321', '654',
    '007', '101', '202', '303', '404', '505', '606', '707', '808', '909'
  ];

  const separators = ['_', '.', '-', '', '__', '--'];

  const generateUsernames = () => {
    if (!keyword.trim()) return;

    const baseKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    const generatedUsernames = new Set();

    // Generate combinations
    for (let i = 0; i < 50; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const slang = slangWords[Math.floor(Math.random() * slangWords.length)];
      const num = numbers[Math.floor(Math.random() * numbers.length)];
      const sep = separators[Math.floor(Math.random() * separators.length)];

      // Different patterns
      const patterns = [
        `${baseKeyword}${sep}${adj}`,
        `${adj}${sep}${baseKeyword}`,
        `${baseKeyword}${sep}${slang}`,
        `${slang}${sep}${baseKeyword}`,
        `${baseKeyword}${sep}${num}`,
        `${num}${sep}${baseKeyword}`,
        `${adj}${sep}${baseKeyword}${sep}${num}`,
        `${baseKeyword}${sep}${adj}${sep}${slang}`,
        `${slang}${sep}${adj}${sep}${baseKeyword}`,
        `${baseKeyword}${adj}`,
        `${adj}${baseKeyword}`,
        `${baseKeyword}${num}`,
        `${num}${baseKeyword}`,
        `${baseKeyword}${slang}`,
        `${slang}${baseKeyword}`,
        `the${sep}${baseKeyword}`,
        `${baseKeyword}${sep}official`,
        `real${sep}${baseKeyword}`,
        `${baseKeyword}${sep}id`,
        `${baseKeyword}${sep}indo`,
        `${baseKeyword}${sep}aja`,
        `${baseKeyword}banget`,
        `si${baseKeyword}`,
        `${baseKeyword}ku`,
        `${baseKeyword}mu`,
        `${baseKeyword}nya`,
        `${baseKeyword}lah`,
        `${baseKeyword}dong`,
        `${baseKeyword}deh`,
        `${baseKeyword}nih`,
        `${baseKeyword}tok`,
        `${baseKeyword}sekali`,
        `${baseKeyword}pisan`,
        `${baseKeyword}terus`,
        `${baseKeyword}selalu`,
        `${baseKeyword}forever`,
        `${baseKeyword}only`,
        `${baseKeyword}x`,
        `x${baseKeyword}`,
        `${baseKeyword}y`,
        `y${baseKeyword}`,
        `${baseKeyword}z`,
        `z${baseKeyword}`
      ];

      // Add random patterns
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      generatedUsernames.add(randomPattern);
    }

    // Convert to array and shuffle
    const usernamesArray = Array.from(generatedUsernames).slice(0, 30);
    setUsernames(usernamesArray.sort(() => Math.random() - 0.5));
  };

  const handleCopy = async (username, index) => {
    try {
      await navigator.clipboard.writeText(username);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyAll = async () => {
    try {
      const allUsernames = usernames.join('\n');
      await navigator.clipboard.writeText(allUsernames);
      // Show feedback
      const button = document.getElementById('copy-all-btn');
      if (button) {
        button.innerHTML = '<Check className="w-4 h-4 mr-2" />Copied!';
        setTimeout(() => {
          button.innerHTML = '<Copy className="w-4 h-4 mr-2" />Copy All';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy all:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateUsernames();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Indonesian Username Generator</h1>
          <p className="text-gray-600">Generate creative Indonesian-style usernames</p>
        </div>

        {/* Input Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Keyword
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your name or keyword (e.g., rina, budi, gamer)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={generateUsernames}
                  disabled={!keyword.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </button>
              </div>
            </div>

            {usernames.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Generated {usernames.length} usernames
                </span>
                <button
                  onClick={handleCopyAll}
                  id="copy-all-btn"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="p-6">
          {usernames.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No usernames generated yet</p>
              <p className="text-sm mt-2">Enter a keyword and click Generate to create usernames</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {usernames.map((username, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-mono text-sm text-gray-900 truncate flex-1">
                    {username}
                  </span>
                  <button
                    onClick={() => handleCopy(username, index)}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy username"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Generate More Button */}
          {usernames.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={generateUsernames}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Generate More
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Tips:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use your real name or nickname as base keyword</li>
            <li>• Try English words like "gamer", "pro", "king", "queen"</li>
            <li>• Combine with Indonesian words for unique usernames</li>
            <li>• Add numbers if your preferred username is taken</li>
            <li>• Check availability on social media platforms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IndoUsernameGen;