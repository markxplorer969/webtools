import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import * as otpauth from 'otpauth';

const TokenRow = ({ label, secret }) => {
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [copyStatus, setCopyStatus] = useState(false);

  // Generate TOTP token using otpauth
  const generateToken = () => {
    try {
      const totp = new otpauth.TOTP({
        secret: secret,
        algorithm: 'SHA1',
        digits: 6,
        period: 30
      });
      return totp.generate();
    } catch (error) {
      console.error('Error generating token:', error);
      return '------';
    }
  };

  // Update token and countdown
  useEffect(() => {
    const updateToken = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = 30 - (now % 30);
      setTimeLeft(timeLeft);
      
      // Generate new token at the start of each period
      if (timeLeft === 30) {
        setToken(generateToken());
      } else if (token === '') {
        setToken(generateToken());
      }
    };

    // Initial token generation
    updateToken();

    // Update every second
    const interval = setInterval(updateToken, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  // Format token as XXX XXX
  const formatToken = (token) => {
    if (token.length === 6) {
      return token.slice(0, 3) + ' ' + token.slice(3);
    }
    return token;
  };

  // Handle copy token
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token.replace(/\s/g, ''));
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <tr className="border-b border-hue-stroke hover:bg-hue-light/50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-hue-text">
        {label}
      </td>
      <td className="px-4 py-3 text-sm font-mono text-hue-text bg-hue-light rounded">
        {formatToken(token)}
      </td>
      <td className="px-4 py-3 text-sm">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            copyStatus 
              ? 'bg-green-100 text-green-700' 
              : 'bg-hue-accent text-white hover:bg-hue-text'
          }`}
        >
          {copyStatus ? (
            <>
              <Check className="w-4 h-4" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Salin
            </>
          )}
        </button>
      </td>
    </tr>
  );
};

export default TokenRow;