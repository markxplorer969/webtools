import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }

    // Fetch Instagram profile page
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    // Check response status
    if (response.status === 404) {
      return NextResponse.json({ status: 'Dead' }, { status: 200 });
    } else if (response.status === 200) {
      return NextResponse.json({ status: 'Live' }, { status: 200 });
    } else {
      // For other status codes, consider it dead
      return NextResponse.json({ status: 'Dead' }, { status: 200 });
    }

  } catch (error) {
    console.error('Error checking IG username:', error);
    return NextResponse.json({ status: 'Dead', error: 'Failed to check username' }, { status: 500 });
  }
}