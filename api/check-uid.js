const axios = require('axios');

// Handler function untuk Vercel/Netlify serverless function
module.exports = async (req, res) => {
  // Set CORS headers untuk semua request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Hanya menerima GET request
  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({
      error: 'Method not allowed. Only GET requests are supported.'
    });
  }

  try {
    // Ambil UID dari query parameter
    const { id: uid } = req.query;

    // Validasi UID
    if (!uid) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        error: 'UID parameter is required. Example: /api/check-uid?id=100012345678901'
      });
    }

    // Validasi format UID (hanya angka)
    if (!/^\d+$/.test(uid)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        error: 'Invalid UID format. UID must contain only numbers.'
      });
    }

    // Buat URL Facebook profile
    const facebookUrl = `https://web.facebook.com/profile.php?id=${uid}`;

    // Setup headers untuk meniru browser asli
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    };

    // Request ke Facebook dengan timeout
    const response = await axios.get(facebookUrl, {
      headers,
      timeout: 15000, // 15 detik timeout
      maxRedirects: 5,
      validateStatus: function (status) {
        // Terima status 200-299 dan 404 (untuk handle profile tidak ada)
        return (status >= 200 && status < 300) || status === 404;
      }
    });

    // Ambil HTML response
    const htmlContent = response.data;

    // Periksa apakah HTML mengandung "Konten Ini Tidak Tersedia Saat Ini"
    const unavailableText = "Konten Ini Tidak Tersedia Saat Ini";
    const isUnavailable = htmlContent.includes(unavailableText);

    // Deteksi status berdasarkan konten HTML
    let status;
    if (isUnavailable) {
      status = "Dead";
    } else if (htmlContent.includes('profile') || htmlContent.includes('facebook') || response.status === 200) {
      status = "Live";
    } else {
      status = "Dead"; // Default ke Dead jika tidak jelas
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    
    // Kembalikan response JSON
    return res.status(200).json({
      uid: uid,
      status: status,
      timestamp: new Date().toISOString(),
      checkedAt: new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta'
      })
    });

  } catch (error) {
    console.error('Error checking UID:', error.message);

    // Handle berbagai jenis error
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Facebook server is not responding.';
      statusCode = 408;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'DNS lookup failed. Cannot reach Facebook servers.';
      statusCode = 503;
    } else if (error.response) {
      // Error dari response Facebook
      if (error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
        statusCode = 429;
      } else if (error.response.status === 403) {
        errorMessage = 'Access forbidden. Facebook blocked the request.';
        statusCode = 403;
      } else {
        errorMessage = `Facebook returned status ${error.response.status}`;
        statusCode = error.response.status;
      }
    } else if (error.request) {
      errorMessage = 'No response received from Facebook servers.';
      statusCode = 503;
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    
    // Kembalikan error response
    return res.status(statusCode).json({
      uid: req.query.id || 'unknown',
      status: "Error",
      error: errorMessage,
      timestamp: new Date().toISOString(),
      checkedAt: new Date().localeString('id-ID', {
        timeZone: 'Asia/Jakarta'
      })
    });
  }
};

// Export untuk berbagai platform
module.exports.handler = module.exports; // AWS Lambda
module.exports.default = module.exports; // Vercel/Netlify