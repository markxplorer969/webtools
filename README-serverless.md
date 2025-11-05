# Facebook UID Checker - Serverless Function

Serverless function untuk mengecek status Facebook UID (Live/Dead) dengan direct HTTP request ke Facebook.

## 🚀 Fitur

- ✅ GET request dengan query parameter
- ✅ Real User-Agent untuk menghindari blokir Facebook
- ✅ HTML parsing untuk deteksi "Konten Ini Tidak Tersedia Saat Ini"
- ✅ Comprehensive error handling
- ✅ CORS headers untuk cross-origin requests
- ✅ JSON response dengan proper headers
- ✅ Timeout protection (15 detik)
- ✅ Support untuk Vercel, Netlify, dan AWS Lambda

## 📁 Struktur File

```
api/
├── check-uid.js          # Serverless function utama
package-serverless.json   # Dependencies untuk serverless
README.md                # Documentation ini
```

## 🛠️ Instalasi

### Untuk Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy ke Vercel
vercel --prod
```

### Untuk Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Install dependencies
npm install --package-lock-only

# Jalankan lokal
netlify dev

# Deploy ke Netlify
netlify deploy --prod
```

### Untuk AWS Lambda
```bash
# Install dependencies
npm install axios

# Deploy menggunakan Serverless Framework atau AWS CLI
```

## 📡 API Endpoint

### GET `/api/check-uid`

**Query Parameters:**
- `id` (required) - Facebook UID yang akan dicek

**Example Request:**
```
GET /api/check-uid?id=100012345678901
```

**Success Response (200):**
```json
{
  "uid": "100012345678901",
  "status": "Live",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checkedAt": "15/01/2024, 17:30:00"
}
```

**Dead Response (200):**
```json
{
  "uid": "100012345678901",
  "status": "Dead",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checkedAt": "15/01/2024, 17:30:00"
}
```

**Error Response (400):**
```json
{
  "error": "UID parameter is required. Example: /api/check-uid?id=100012345678901"
}
```

**Error Response (500):**
```json
{
  "uid": "100012345678901",
  "status": "Error",
  "error": "Request timeout. Facebook server is not responding.",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checkedAt": "15/01/2024, 17:30:00"
}
```

## 🔧 Cara Kerja

1. **Request Validation**: Cek UID parameter dan format (hanya angka)
2. **HTTP Request**: GET request ke `https://web.facebook.com/profile.php?id=[UID]`
3. **Browser Simulation**: User-Agent dan headers lengkap untuk meniru browser asli
4. **HTML Parsing**: Cek string "Konten Ini Tidak Tersedia Saat Ini" dalam response
5. **Status Detection**: 
   - Jika ketemu → "Dead"
   - Jika tidak ketemu → "Live"
6. **JSON Response**: Return status dengan metadata

## 🛡️ Security Features

- CORS headers untuk cross-origin requests
- Input validation (numeric only)
- Timeout protection (15 detik)
- Error handling untuk berbagai jenis HTTP errors
- Rate limiting awareness (429 handling)

## 🚨 Error Handling

Function ini handle berbagai jenis error:
- **400**: Missing/invalid UID parameter
- **403**: Facebook blocked the request
- **408**: Request timeout
- **429**: Too many requests
- **500**: Server errors
- **503**: DNS/network issues

## 🌐 Deployment

### Vercel
1. Install Vercel CLI
2. Run `vercel` di project root
3. Function akan otomatis terdeteksi di `/api/check-uid.js`

### Netlify
1. Install Netlify CLI
2. Buat `netlify.toml` (opsional)
3. Run `netlify dev` untuk testing lokal
4. Deploy dengan `netlify deploy --prod`

### AWS Lambda
1. Install dependencies
2. Zip function dan dependencies
3. Upload ke Lambda console
4. Set handler ke `check-uid.handler`

## 📝 Contoh Penggunaan

### JavaScript/Fetch
```javascript
const checkUID = async (uid) => {
  try {
    const response = await fetch(`/api/check-uid?id=${uid}`);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUID('100012345678901');
```

### cURL
```bash
curl "https://your-domain.vercel.app/api/check-uid?id=100012345678901"
```

### Python/Requests
```python
import requests

def check_uid(uid):
    url = f"https://your-domain.vercel.app/api/check-uid?id={uid}"
    response = requests.get(url)
    return response.json()

result = check_uid("100012345678901")
print(result)
```

## ⚡ Performance

- **Response Time**: 2-15 detik (tergantung response Facebook)
- **Timeout**: 15 detik
- **Memory Usage**: ~50MB per request
- **Concurrent Requests**: Support high concurrency

## 📄 License

MIT License - feel free to use for commercial and personal projects.