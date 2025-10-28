import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required' }, { status: 400 });
    }

    let apiUrl = 'https://www.1secmail.com/api/v1/?';

    if (action === 'generate') {
      // Generate random email
      apiUrl += 'action=genRandomMailbox&count=1';
    } else if (action === 'read') {
      // Read inbox
      const login = searchParams.get('login');
      const domain = searchParams.get('domain');

      if (!login || !domain) {
        return NextResponse.json({ error: 'Login and domain parameters are required for read action' }, { status: 400 });
      }

      apiUrl += `action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`;
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "generate" or "read"' }, { status: 400 });
    }

    // Fetch from 1secmail API
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from 1secmail API: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the JSON data from 1secmail to React
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error with temp mail API:', error);
    return NextResponse.json({ error: 'Failed to process temp mail request' }, { status: 500 });
  }
}