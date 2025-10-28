import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Play, Square, Trash2, Plus, Copy, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import AnimatedPage from '../AnimatedPage';

const FacebookUIDChecker = () => {
  const [inputData, setInputData] = useState('');
  const [liveList, setLiveList] = useState([]);
  const [deadList, setDeadList] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [duplicateList, setDuplicateList] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [counters, setCounters] = useState({
    total: 0,
    live: 0,
    dead: 0,
    error: 0,
    duplicate: 0
  });
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('5');
  const [errorMessage, setErrorMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [clickingButton, setClickingButton] = useState('');
  const stopCheckRef = useRef(false);

  // Helper function to parse Facebook input
  const parseFacebookInput = (line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;
    
    console.log(`🔍 Parsing line: "${trimmedLine}"`);
    
    // Extract UID from profile.php?id=... format
    const profileMatch = trimmedLine.match(/profile\.php\?id=(\d+)/);
    if (profileMatch) {
      console.log(`✅ Found profile.php UID: ${profileMatch[1]}`);
      return profileMatch[1];
    }
    
    // Extract UID from full URL with numbers at the end
    const urlMatch = trimmedLine.match(/facebook\.com\/.*?(\d{8,})/);
    if (urlMatch) {
      console.log(`✅ Found URL UID: ${urlMatch[1]}`);
      return urlMatch[1];
    }
    
    // Extract UID from username URLs (like /username.123 or /username)
    const usernameMatch = trimmedLine.match(/facebook\.com\/([a-zA-Z0-9.-]+)/);
    if (usernameMatch) {
      console.log(`✅ Found username format: ${usernameMatch[1]}`);
      // For usernames, we'll return the full identifier as-is
      return usernameMatch[1];
    }
    
    // Check if it's a pure UID (8+ digits to be more flexible)
    if (/^\d{8,}$/.test(trimmedLine)) {
      console.log(`✅ Found pure UID: ${trimmedLine}`);
      return trimmedLine;
    }
    
    console.log(`❌ No valid format found for: "${trimmedLine}"`);
    return null;
  };

  const handleStartCheck = async () => {
    console.log('🚀 Starting check process...');
    
    // Clear previous errors
    setErrorMessage('');
    
    // Validate input
    if (!inputData.trim()) {
      setErrorMessage('❌ Silakan masukkan UID atau link Facebook terlebih dahulu');
      return;
    }

    console.log('📝 Input data validated, parsing UIDs...');
    
    // Reset states
    setLiveList([]);
    setDeadList([]);
    setErrorList([]);
    setDuplicateList([]);
    setDuplicateCount(0);
    setCounters({ total: 0, live: 0, dead: 0, error: 0, duplicate: 0 });
    setIsChecking(true);
    setProgress(0);
    stopCheckRef.current = false;

    // Parse input data
    const lines = inputData.split('\n');
    const allUIDs = [];
    const seenUIDs = new Set();
    const duplicateUIDs = [];
    let duplicateCount = 0;

    lines.forEach(line => {
      const uid = parseFacebookInput(line);
      if (uid) {
        if (seenUIDs.has(uid)) {
          duplicateCount++;
          if (!duplicateUIDs.includes(uid)) {
            duplicateUIDs.push(uid);
          }
        } else {
          seenUIDs.add(uid);
          allUIDs.push(uid);
        }
      }
    });

    const uniqueUIDs = Array.from(seenUIDs);
    
    if (uniqueUIDs.length === 0) {
      setErrorMessage('❌ Tidak ada UID valid yang ditemukan. Pastikan format input benar.');
      setIsChecking(false);
      return;
    }

    setDuplicateCount(duplicateCount);
    setDuplicateList(duplicateUIDs);
    const concurrencyLimit = parseInt(speed) || 5;
    
    setCounters(prev => ({ ...prev, total: uniqueUIDs.length }));
    
    console.log(`📊 Found ${uniqueUIDs.length} unique UIDs, ${duplicateCount} duplicates`);
    console.log(`⚡ Processing with concurrency limit: ${concurrencyLimit}`);

    // Process in batches
    const batches = [];
    for (let i = 0; i < uniqueUIDs.length; i += concurrencyLimit) {
      batches.push(uniqueUIDs.slice(i, i + concurrencyLimit));
    }

    const newLiveList = [];
    const newDeadList = [];
    const newErrorList = [];

    for (let i = 0; i < batches.length; i++) {
      if (stopCheckRef.current) {
        console.log('⏹️ Process stopped by user');
        break;
      }

      console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batches[i].length} UIDs)`);

      const batch = batches[i];
      const promises = batch.map(async (uid) => {
        try {
          console.log(`🔍 Checking UID: ${uid}`);
          const response = await fetch(`/api/check-uid?id=${encodeURIComponent(uid)}`);
          
          if (!response.ok) {
            console.log(`❌ API Error for UID ${uid}: ${response.status}`);
            return { uid, status: 'Error' };
          }
          
          const data = await response.json();
          console.log(`✅ UID ${uid}: ${data.status}`);
          return { uid, status: data.status };
        } catch (error) {
          console.log(`❌ Network Error for UID ${uid}:`, error.message);
          return { uid, status: 'Error' };
        }
      });

      const results = await Promise.allSettled(promises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { uid, status } = result.value;
          if (status === 'Live') {
            newLiveList.push(uid);
          } else if (status === 'Dead') {
            newDeadList.push(uid);
          } else {
            newErrorList.push(uid);
          }
        } else {
          const uid = batch[results.indexOf(result)];
          newErrorList.push(uid);
        }
      });

      // Update progress
      const currentProgress = ((i + 1) / batches.length) * 100;
      setProgress(currentProgress);
      
      // Update counters
      setCounters({
        total: uniqueUIDs.length,
        live: newLiveList.length,
        dead: newDeadList.length,
        error: newErrorList.length,
        duplicate: duplicateUIDs.length
      });

      // Small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        console.log('⏳ Waiting 1 second before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Process completed! Live: ${newLiveList.length}, Dead: ${newDeadList.length}, Error: ${newErrorList.length}`);

    setLiveList(newLiveList);
    setDeadList(newDeadList);
    setErrorList(newErrorList);
    setIsChecking(false);
    setProgress(100);
  };

  const handleStopCheck = () => {
    console.log('⏹️ Stop requested');
    stopCheckRef.current = true;
    setIsChecking(false);
  };

  const handleClear = () => {
    console.log('🧹 Clearing all data');
    setInputData('');
    setLiveList([]);
    setDeadList([]);
    setErrorList([]);
    setDuplicateList([]);
    setDuplicateCount(0);
    setCounters({ total: 0, live: 0, dead: 0, error: 0, duplicate: 0 });
    setProgress(0);
    setErrorMessage('');
    setCopySuccess('');
    setClickingButton('');
    stopCheckRef.current = false;
  };

  const handleCopyLive = async () => {
    setClickingButton('live');
    const text = liveList.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Live UIDs berhasil disalin!');
      console.log('📋 Live UIDs copied to clipboard');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Gagal menyalin!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
    setTimeout(() => setClickingButton(''), 150);
  };

  const handleCopyDead = async () => {
    setClickingButton('dead');
    const text = deadList.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Dead UIDs berhasil disalin!');
      console.log('📋 Dead UIDs copied to clipboard');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Gagal menyalin!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
    setTimeout(() => setClickingButton(''), 150);
  };

  const handleCopyError = async () => {
    setClickingButton('error');
    const text = errorList.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Error UIDs berhasil disalin!');
      console.log('📋 Error UIDs copied to clipboard');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Gagal menyalin!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
    setTimeout(() => setClickingButton(''), 150);
  };

  const handleCopyDuplicates = async () => {
    setClickingButton('duplicate');
    const text = duplicateList.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Duplicate UIDs berhasil disalin!');
      console.log('📋 Duplicate UIDs copied to clipboard');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Gagal menyalin!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
    setTimeout(() => setClickingButton(''), 150);
  };

  const handleCopyDuplicatesCount = async () => {
    if (duplicateCount > 0) {
      setClickingButton('duplicate-count');
      try {
        await navigator.clipboard.writeText(duplicateCount.toString());
        setCopySuccess('Jumlah duplikat berhasil disalin!');
        console.log('📋 Duplicate count copied to clipboard');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        setCopySuccess('Gagal menyalin!');
        setTimeout(() => setCopySuccess(''), 2000);
      }
      setTimeout(() => setClickingButton(''), 150);
    }
  };

  // Test function to add dummy data
  const handleAddTestData = () => {
    setLiveList(['1000000000000001', '1000000000000002']);
    setDeadList(['1000000000000003', '1000000000000004']);
    setErrorList(['1000000000000005']);
    setDuplicateList(['1000000000000001', '1000000000000003']); // Duplicate UIDs
    setDuplicateCount(2);
    setCounters({
      total: 5,
      live: 2,
      dead: 2,
      error: 1
    });
    setCopySuccess('Data testing ditambahkan!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Facebook className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-hue-text">Facebook UID Checker</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-hue-paragraph"
          >
            Check if Facebook UIDs are live or dead in bulk
          </motion.p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {copySuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>{copySuccess}</span>
            </div>
          </motion.div>
        )}

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-hue-stroke rounded-lg p-6 shadow-sm mb-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hue-text mb-2">
                Input Facebook UIDs atau Links
              </label>
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="https://www.facebook.com/profile.php?id=1000000000000001&#10;https://www.facebook.com/username&#10;https://www.facebook.com/username.123&#10;1000000000000002&#10;1000000000000003"
                className="w-full min-h-[150px] border border-hue-stroke rounded-md p-3 focus:ring-2 focus:ring-hue-accent focus:border-hue-accent font-mono text-sm resize-none"
                disabled={isChecking}
              />
              <p className="text-xs text-hue-paragraph mt-1">
                💡 <strong>Tip:</strong> Paste data dari Excel, Notepad, atau sumber lainnya. Satu UID/link per baris.
              </p>
            </div>

            {/* Control Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-hue-text">Speed:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="w-20 border border-hue-stroke rounded-md px-2 py-1 focus:ring-2 focus:ring-hue-accent focus:border-hue-accent"
                  disabled={isChecking}
                />
                <span className="text-xs text-hue-paragraph">(1-20)</span>
              </div>

              <div className="flex gap-2">
                {!isChecking ? (
                  <button
                    onClick={handleStartCheck}
                    disabled={!inputData.trim()}
                    className="flex items-center gap-2 bg-hue-accent text-hue-text font-semibold px-4 py-2 rounded-md hover:bg-hue-text hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    Mulai Cek
                  </button>
                ) : (
                  <button
                    onClick={handleStopCheck}
                    className="flex items-center gap-2 bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    Stop Cek
                  </button>
                )}

                <button
                  onClick={handleClear}
                  disabled={isChecking}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Bersihkan
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics & Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white border border-hue-stroke rounded-lg p-4 mb-6 shadow-sm"
        >
          <div className="grid grid-cols-5 gap-2 text-center text-sm mb-4">
            <div>
              <div className="font-semibold text-hue-text">Total</div>
              <div className="text-lg font-bold text-hue-accent">{counters.total}</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">Live</div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-lg font-bold text-green-600">{counters.live}</div>
                {counters.live > 0 && (
                  <button
                    onClick={handleCopyLive}
                    className={`p-1.5 text-green-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      clickingButton === 'live'
                        ? 'bg-green-200 scale-95 shadow-inner'
                        : 'hover:bg-green-100 hover:text-green-700 hover:scale-110'
                    }`}
                    title="Salin semua Live UIDs"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-600">Dead</div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-lg font-bold text-red-600">{counters.dead}</div>
                {counters.dead > 0 && (
                  <button
                    onClick={handleCopyDead}
                    className={`p-1.5 text-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      clickingButton === 'dead'
                        ? 'bg-red-200 scale-95 shadow-inner'
                        : 'hover:bg-red-100 hover:text-red-700 hover:scale-110'
                    }`}
                    title="Salin semua Dead UIDs"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">Duplikat</div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-lg font-bold text-orange-600">{duplicateCount}</div>
                {duplicateCount > 0 && (
                  <button
                    onClick={handleCopyDuplicatesCount}
                    className={`p-1.5 text-orange-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      clickingButton === 'duplicate-count'
                        ? 'bg-orange-200 scale-95 shadow-inner'
                        : 'hover:bg-orange-100 hover:text-orange-700 hover:scale-110'
                    }`}
                    title="Salin jumlah duplikat"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-600">Error</div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-lg font-bold text-gray-600">{counters.error}</div>
                {counters.error > 0 && (
                  <button
                    onClick={handleCopyError}
                    className={`p-1.5 text-gray-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      clickingButton === 'error'
                        ? 'bg-gray-200 scale-95 shadow-inner'
                        : 'hover:bg-gray-100 hover:text-gray-700 hover:scale-110'
                    }`}
                    title="Salin semua Error UIDs"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isChecking && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-hue-paragraph">
                <span>🔄 Processing... {Math.round(progress)}%</span>
                <span>Live: {counters.live} | Dead: {counters.dead} | Error: {counters.error}</span>
              </div>
              <div className="w-full bg-hue-stroke rounded-full h-2">
                <motion.div
                  className="bg-hue-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Card */}
        {(liveList.length > 0 || deadList.length > 0 || errorList.length > 0 || duplicateList.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white border border-hue-stroke rounded-lg shadow-sm overflow-hidden"
          >
            {/* Tabs */}
            <div className="border-b border-hue-stroke">
              <div className="flex">
                <button
                  className={`flex-1 py-3 px-4 font-medium transition-colors ${
                    liveList.length > 0
                      ? 'text-hue-accent border-b-2 border-hue-accent bg-hue-light/30'
                      : 'text-hue-paragraph opacity-50 cursor-not-allowed'
                  }`}
                  disabled={liveList.length === 0}
                >
                  ✅ Live Accounts ({liveList.length})
                </button>
                <button
                  className={`flex-1 py-3 px-4 font-medium transition-colors ${
                    deadList.length > 0
                      ? 'text-hue-accent border-b-2 border-hue-accent bg-hue-light/30'
                      : 'text-hue-paragraph opacity-50 cursor-not-allowed'
                  }`}
                  disabled={deadList.length === 0}
                >
                  ❌ Dead Accounts ({deadList.length})
                </button>
                {errorList.length > 0 && (
                  <button
                    className={`flex-1 py-3 px-4 font-medium transition-colors text-hue-accent border-b-2 border-hue-accent bg-hue-light/30`}
                  >
                    ⚠️ Error ({errorList.length})
                  </button>
                )}
                {duplicateList.length > 0 && (
                  <button
                    className={`flex-1 py-3 px-4 font-medium transition-colors text-hue-accent border-b-2 border-hue-accent bg-hue-light/30`}
                  >
                    🔄 Duplikat ({duplicateList.length})
                  </button>
                )}
              </div>
            </div>

            {/* Live Accounts Section */}
            {liveList.length > 0 && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-hue-text flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Live Accounts
                  </h3>
                  <button
                    onClick={handleCopyLive}
                    className={`flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-md ${
                      clickingButton === 'live' ? 'bg-green-600 scale-95' : ''
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-hue-light sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hue-stroke">
                      {liveList.map((uid, index) => (
                        <tr key={uid} className="hover:bg-hue-light/30">
                          <td className="px-4 py-2 text-sm text-hue-paragraph">{index + 1}</td>
                          <td className="px-4 py-2 text-sm font-mono text-hue-text">{uid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Dead Accounts Section */}
            {deadList.length > 0 && (
              <div className="p-6 border-t border-hue-stroke">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-hue-text flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Dead Accounts
                  </h3>
                  <button
                    onClick={handleCopyDead}
                    className={`flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-md ${
                      clickingButton === 'dead' ? 'bg-red-600 scale-95' : ''
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-hue-light sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hue-stroke">
                      {deadList.map((uid, index) => (
                        <tr key={uid} className="hover:bg-hue-light/30">
                          <td className="px-4 py-2 text-sm text-hue-paragraph">{index + 1}</td>
                          <td className="px-4 py-2 text-sm font-mono text-hue-text">{uid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error Accounts Section */}
            {errorList.length > 0 && (
              <div className="p-6 border-t border-hue-stroke">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-hue-text flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    Error Accounts
                  </h3>
                  <button
                    onClick={handleCopyError}
                    className={`flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium shadow-md ${
                      clickingButton === 'error' ? 'bg-gray-600 scale-95' : ''
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-hue-light sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hue-stroke">
                      {errorList.map((uid, index) => (
                        <tr key={uid} className="hover:bg-hue-light/30">
                          <td className="px-4 py-2 text-sm text-hue-paragraph">{index + 1}</td>
                          <td className="px-4 py-2 text-sm font-mono text-hue-text">{uid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Duplicate Accounts Section */}
            {duplicateList.length > 0 && (
              <div className="p-6 border-t border-hue-stroke">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-hue-text flex items-center gap-2">
                    <Copy className="w-5 h-5 text-orange-600" />
                    Duplicate Accounts
                  </h3>
                  <button
                    onClick={handleCopyDuplicates}
                    className={`flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-md ${
                      clickingButton === 'duplicate' ? 'bg-orange-600 scale-95' : ''
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-hue-light sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-hue-text uppercase">UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hue-stroke">
                      {duplicateList.map((uid, index) => (
                        <tr key={uid} className="hover:bg-hue-light/30">
                          <td className="px-4 py-2 text-sm text-hue-paragraph">{index + 1}</td>
                          <td className="px-4 py-2 text-sm font-mono text-hue-text">{uid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!isChecking && liveList.length === 0 && deadList.length === 0 && errorList.length === 0 && duplicateList.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white border border-hue-stroke rounded-lg p-12 text-center"
          >
            <div className="text-hue-paragraph">
              <Facebook className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Belum ada data</h3>
              <p className="text-sm">
                Masukkan UID atau link Facebook dan klik "Mulai Cek" untuk memulai proses pengecekan.
              </p>
            </div>
          </motion.div>
        )}

        {/* Cara Penggunaan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Cara Penggunaan:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Masukkan <strong>UID Facebook</strong> atau <strong>link profil</strong> (satu per baris)</li>
                <li>Format yang didukung:
                  <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                    <li><code className="bg-blue-100 px-1 rounded">https://www.facebook.com/profile.php?id=1000000000000001</code></li>
                    <li><code className="bg-blue-100 px-1 rounded">https://www.facebook.com/username</code></li>
                    <li><code className="bg-blue-100 px-1 rounded">https://www.facebook.com/username.123</code></li>
                    <li><code className="bg-blue-100 px-1 rounded">1000000000000001</code> (UID murni, minimal 8 digit)</li>
                  </ul>
                </li>
                <li>Atur <strong>Speed</strong> (1-20) - semakin tinggi semakin cepat tapi berisiko terkena limit</li>
                <li>Klik <strong>"Mulai Cek"</strong> dan tunggu proses selesai</li>
                <li>Hasil akan ditampilkan di tab <strong>Live Accounts</strong> dan <strong>Dead Accounts</strong></li>
                <li>Gunakan <strong>"Salin Semua"</strong> untuk menyalin semua UID yang live, dead, atau error</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default FacebookUIDChecker;