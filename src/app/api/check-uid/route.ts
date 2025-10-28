import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('id') || searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { uid: "", status: "Error", error: "UID parameter is required" }, 
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return await checkUID(uid);

  } catch (error) {
    console.error('Error checking FB UID:', error);
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('id') || searchParams.get('uid') || "";
    
    return NextResponse.json(
      { uid: uid, status: "Error" }, 
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const uid = body.uid;

    if (!uid) {
      return NextResponse.json(
        { uid: "", status: "Error", error: "UID parameter is required" }, 
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return await checkUID(uid);

  } catch (error) {
    console.error('Error checking FB UID:', error);
    
    return NextResponse.json(
      { uid: "", status: "Error" }, 
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

async function checkUID(uid: string) {
  // Determine the correct URL format based on the input
  let profileUrl;
  if (/^\d+$/.test(uid)) {
    // Pure UID, use profile.php format
    profileUrl = `https://web.facebook.com/profile.php?id=${uid}`;
  } else {
    // Username or other format, use direct URL
    profileUrl = `https://web.facebook.com/${uid}`;
  }

  console.log(`🔍 Checking URL: ${profileUrl}`);

  try {
    // Fetch Facebook profile page
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          uid: uid, 
          status: "Error",
          exists: false
        }, 
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const html = await response.text();
    
    // Check if the content contains "Konten Ini Tidak Tersedia Saat Ini"
    if (html.includes('Konten Ini Tidak Tersedia Saat Ini')) {
      return NextResponse.json(
        { 
          uid: uid, 
          status: "Dead",
          exists: false
        }, 
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Try to extract profile name
    let name = null;
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      name = titleMatch[1].replace(' | Facebook', '').trim();
    }

    // If the specific string is not found, consider it Live
    return NextResponse.json(
      { 
        uid: uid, 
        status: "Live",
        exists: true,
        profileUrl: profileUrl,
        name: name
      }, 
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error fetching Facebook profile:', error);
    return NextResponse.json(
      { 
        uid: uid, 
        status: "Error",
        exists: false
      }, 
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}