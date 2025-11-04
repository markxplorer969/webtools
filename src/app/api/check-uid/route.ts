import { NextRequest, NextResponse } from 'next/server';

interface CheckResult {
  uid: string;
  status: 'Live' | 'Dead' | 'Error';
}

export async function POST(request: NextRequest) {
  try {
    const { uids } = await request.json();
    
    if (!Array.isArray(uids) || uids.length === 0) {
      return NextResponse.json({ error: 'Invalid UIDs array' }, { status: 400 });
    }

    // Process all UIDs in parallel using Promise.allSettled
    const results = await Promise.allSettled(
      uids.map(async (uid: string): Promise<CheckResult> => {
        try {
          // Anti-blocking: Use standard browser User-Agent
          const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
          
          const response = await fetch(`https://web.facebook.com/profile.php?id=${uid}`, {
            method: 'GET',
            headers: {
              'User-Agent': userAgent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000),
          });

          if (!response.ok) {
            return { uid, status: 'Error' };
          }

          const html = await response.text();
          
          // Check if content is unavailable (Pilar 5 - Analysis)
          if (html.includes("Konten Ini Tidak Tersedia Saat Ini") || 
              html.includes("This Content Isn't Available Right Now") ||
              html.includes("Content Not Found") ||
              response.status === 404) {
            return { uid, status: 'Dead' };
          }

          // Check if it's a valid profile
          if (html.includes("profile_picture") || 
              html.includes("timeline") ||
              html.includes("about") ||
              html.includes("friends")) {
            return { uid, status: 'Live' };
          }

          return { uid, status: 'Dead' };

        } catch (error) {
          console.error(`Error checking UID ${uid}:`, error);
          return { uid, status: 'Error' };
        }
      })
    );

    // Extract results from Promise.allSettled
    const processedResults: CheckResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return { uid: uids[index], status: 'Error' };
      }
    });

    return NextResponse.json({ results: processedResults });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}