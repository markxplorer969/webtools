import { NextRequest, NextResponse } from 'next/server';

interface CheckResult {
  uid: string;
  status: 'live' | 'dead' | 'error';
}

export async function POST(request: NextRequest) {
  try {
    const { uids } = await request.json();
    
    if (!Array.isArray(uids) || uids.length === 0) {
      return NextResponse.json({ error: 'Invalid UIDs array' }, { status: 400 });
    }

    // Langkah 4: Gunakan Promise.allSettled untuk memproses semua uids secara paralel
    const results = await Promise.allSettled(
      uids.map(async (uid: string) => {
        const url = `https://web.facebook.com/profile.php?id=${uid}`;
        
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
            },
          });

          const html = await response.text();
          
          // Langkah 5: Logika Analisis
          if (html.includes("Konten Ini Tidak Tersedia Saat Ini") || 
              html.includes("Content Not Available") ||
              html.includes("This content isn't available right now")) {
            return { uid, status: 'dead' as const };
          } else if (response.ok) {
            return { uid, status: 'live' as const };
          } else {
            return { uid, status: 'error' as const };
          }
        } catch (error) {
          return { uid, status: 'error' as const };
        }
      })
    );

    // Process results from Promise.allSettled
    const processedResults: CheckResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return { uid: uids[index], status: 'error' as const };
      }
    });

    // Langkah 6: Kirim respon
    return NextResponse.json(processedResults);
    
  } catch (error) {
    console.error('Error in check-uid API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}