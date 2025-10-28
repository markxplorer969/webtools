import React, { useState } from 'react';
import { Play, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const InstagramUsernameChecker = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(5); // concurrent requests

  const checkUsername = async (username) => {
    try {
      const response = await fetch(`/api/check-ig-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      return {
        username,
        status: data.status,
        error: null
      };
    } catch (error) {
      return {
        username,
        status: 'Error',
        error: error.message
      };
    }
  };

  const processBatch = async (usernames) => {
    const batches = [];
    for (let i = 0; i < usernames.length; i += speed) {
      batches.push(usernames.slice(i, i + speed));
    }

    const allResults = [];
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResults = await Promise.allSettled(
        batch.map(username => checkUsername(username))
      );
      
      const processedResults = batchResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            username: batch[index],
            status: 'Error',
            error: result.reason?.message || 'Unknown error'
          };
        }
      });
      
      allResults.push(...processedResults);
      setProgress(((i + 1) / batches.length) * 100);
      
      // Small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return allResults;
  };

  const handleCheck = async () => {
    if (!inputText.trim()) return;
    
    const usernames = inputText.trim().split('\n').filter(username => username.trim());
    if (usernames.length === 0) return;
    
    setIsChecking(true);
    setProgress(0);
    setResults([]);
    
    try {
      const checkResults = await processBatch(usernames);
      setResults(checkResults);
    } catch (error) {
      console.error('Error checking usernames:', error);
    } finally {
      setIsChecking(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResults([]);
    setProgress(0);
  };

  const handleClearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Live':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Dead':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live':
        return 'text-green-600 bg-green-50';
      case 'Dead':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const liveCount = results.filter(r => r.status === 'Live').length;
  const deadCount = results.filter(r => r.status === 'Dead').length;
  const errorCount = results.filter(r => r.status === 'Error').length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Instagram Username Checker</h1>
          <p className="text-gray-600">Check if Instagram usernames are available or taken</p>
        </div>

        {/* Input Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Usernames (one per line)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="johndoe&#10;janedoe&#10;username123"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                disabled={isChecking}
              />
            </div>
            
            {/* Speed Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed: {speed} concurrent requests
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
                disabled={isChecking}
              />
            </div>
            
            {/* Progress Bar */}
            {isChecking && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCheck}
                disabled={isChecking || !inputText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                {isChecking ? 'Checking...' : 'Check Usernames'}
              </button>
              
              <button
                onClick={handleClear}
                disabled={isChecking}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
              
              {results.length > 0 && (
                <button
                  onClick={handleClearResults}
                  disabled={isChecking}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear Results
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="p-6">
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Live</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-1">{liveCount}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900">Dead</span>
                </div>
                <div className="text-2xl font-bold text-red-600 mt-1">{deadCount}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">Error</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600 mt-1">{errorCount}</div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        {result.username}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {getStatusIcon(result.status)}
                          {result.status}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {result.error || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramUsernameChecker;