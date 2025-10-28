import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import TokenRow from './TokenRow';
import * as otpauth from 'otpauth';

const TwoFactorAuth = () => {
  const [inputSecrets, setInputSecrets] = useState('');
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Simulate TOTP countdown (30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = 30 - (now % 30);
      setGlobalProgress((timeLeft / 30) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Parse input secrets with useMemo
  const activeKeys = useMemo(() => {
    if (!inputSecrets.trim()) return [];
    
    const lines = inputSecrets.trim().split('\n');
    const keys = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Parse format: SECRET_KEY | Label
      const parts = trimmedLine.split('|');
      const secret = parts[0]?.trim() || '';
      const label = parts.slice(1).join('|').trim() || `Key ${index + 1}`;
      
      if (secret) {
        keys.push({
          id: Date.now() + index,
          label: label,
          secret: secret
        });
      }
    });
    
    return keys;
  }, [inputSecrets]);

  const handleExport = () => {
    const data = activeKeys.map(item => `${item.secret} | ${item.label}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-tokens.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputSecrets(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-hue-stroke">
        {/* Header */}
        <div className="p-6 border-b border-hue-stroke">
          <h1 className="text-2xl font-bold text-hue-text mb-2">Two Factor Authenticator</h1>
          <p className="text-hue-paragraph">Manage your 2FA tokens with automatic code generation</p>
        </div>

        {/* Global Progress Bar */}
        <div className="px-6 py-4 bg-hue-light border-b border-hue-stroke">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-hue-text">Token Refresh</span>
            <span className="text-sm text-hue-paragraph">{Math.floor(globalProgress)}%</span>
          </div>
          <div className="w-full bg-hue-stroke rounded-full h-2">
            <div 
              className="bg-hue-accent h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
        </div>

        {/* Instructions Card */}
        <div className="p-6 border-b border-hue-stroke">
          <div className="bg-white border border-hue-stroke rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-hue-text mb-4">Cara menggunakan</h2>
            <ol className="list-decimal list-inside space-y-2 text-hue-paragraph">
              <li>Ketik secret key di textarea (satu per baris).</li>
              <li>Format: SECRET_KEY | Label (label opsional).</li>
              <li>Token muncul otomatis.</li>
              <li>Token refresh otomatis 30 detik.</li>
              <li>Klik 'Salin'.</li>
            </ol>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hue-text mb-2">
                Secret Keys
              </label>
              <textarea
                value={inputSecrets}
                onChange={(e) => setInputSecrets(e.target.value)}
                placeholder="JBSWY3DPEHPK3PXP | Google&#10;JBSWY3DPEHPK3PXQ | GitHub&#10;JBSWY3DPEHPK3PXR | Discord&#10;&#10;Atau tanpa label:&#10;JBSWY3DPEHPK3PXP"
                className="w-full h-32 px-3 py-2 border border-hue-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-hue-accent focus:border-transparent font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-hue-accent text-white rounded-md hover:bg-hue-text transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              
              <button
                onClick={handleExport}
                disabled={activeKeys.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-hue-text text-white rounded-md hover:bg-hue-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Tokens Table */}
        <div className="p-6">
          {activeKeys.length === 0 ? (
            <div className="text-center py-12 text-hue-paragraph">
              <p>No tokens added yet</p>
              <p className="text-sm mt-2">Add tokens using the format "SECRET_KEY | Label"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hue-stroke bg-hue-light">
                    <th className="px-4 py-3 text-left text-xs font-medium text-hue-text uppercase tracking-wider">
                      Label
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-hue-text uppercase tracking-wider">
                      Kode 2FA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-hue-text uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-hue-stroke">
                  {activeKeys.map((item) => (
                    <TokenRow
                      key={item.id}
                      label={item.label}
                      secret={item.secret}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;