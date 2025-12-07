import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Image URL is required' },
      { status: 400 }
    );
  }

  try {
    // Validate URL
    const url = new URL(imageUrl);
    if (!url.protocol.startsWith('http')) {
      return NextResponse.json(
        { error: 'Invalid URL protocol' },
        { status: 400 }
      );
    }

    // Additional security: Only allow image domains
    const allowedDomains = ['i.pinimg.com', 'pinimg.com', 'pinterest.com', 'picsum.photos', 'images.unsplash.com', 'cdn'];
    const hostname = url.hostname.toLowerCase();
    const isAllowed = allowedDomains.some(domain => hostname.includes(domain)) || 
                     hostname.includes('pinterest') || 
                     hostname.includes('cdn') ||
                     hostname.includes('unsplash') ||
                     hostname.includes('picsum');

    if (!isAllowed) {
      console.warn(`Blocked request to potentially unsafe domain: ${hostname}`);
      return NextResponse.json(
        { error: 'Domain not allowed for security reasons' },
        { status: 403 }
      );
    }

    console.log(`Proxying image: ${imageUrl}`);

    // Fetch the image from the original URL
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'Referer': 'https://www.pinterest.com/',
      },
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Validate that we got image data
    if (imageBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Empty image data received' },
        { status: 400 }
      );
    }

    // Additional validation: Check if it's actually an image
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid content type - not an image' },
        { status: 400 }
      );
    }

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error in image proxy:', error);
    
    let errorMessage = 'Failed to proxy image';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('URL')) {
        errorMessage = 'Invalid image URL provided.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Image Proxy API',
    description: 'Proxy image requests to bypass CORS restrictions',
    usage: {
      method: 'GET',
      query: {
        url: 'string (required) - The image URL to proxy'
      },
      example: '/api/proxy-image?url=https://example.com/image.jpg'
    }
  });
}