import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const image = formData.get('image') as File;
    const username = formData.get('username') as string;

    // Validation
    if (!image) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    if (username.length > 20) {
      return NextResponse.json(
        { error: 'Username must be 20 characters or less' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    console.log(`Generating Fake ML Lobby for username: ${username}, image: ${image.name}, size: ${image.size}`);

    // Create FormData for external API
    const externalFormData = new FormData();
    externalFormData.append('image', image);
    externalFormData.append('username', username.trim());

    try {
      // Call external API
      const response = await fetch('https://api.zenzxz.my.id/api/maker/fakeml', {
        method: 'POST',
        body: externalFormData,
        signal: AbortSignal.timeout(30000) // 30 seconds timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('External API error:', response.status, errorText);
        throw new Error(`External API error: ${response.status}`);
      }

      // Get the image buffer from response
      const imageBuffer = await response.arrayBuffer();
      
      if (imageBuffer.byteLength === 0) {
        throw new Error('Received empty image from external API');
      }

      // Convert buffer to base64
      const base64String = Buffer.from(imageBuffer).toString('base64');
      
      // Determine content type from response or default to jpeg
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const dataUrl = `data:${contentType};base64,${base64String}`;

      console.log(`Successfully generated Fake ML Lobby for ${username}, image size: ${imageBuffer.byteLength} bytes`);

      return NextResponse.json({
        success: true,
        result: dataUrl,
        username: username.trim(),
        imageSize: imageBuffer.byteLength
      });

    } catch (error) {
      console.error('Error in Fake ML Lobby API:', error);
      
      let errorMessage = 'Failed to generate Fake ML Lobby';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout. Please try again.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('External API')) {
          errorMessage = 'External service is currently unavailable. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in Fake ML Lobby API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Fake ML Lobby Generator API',
    description: 'Generate fake Mobile Legends lobby images with custom avatar and username',
    usage: {
      method: 'POST',
      contentType: 'multipart/form-data',
      body: {
        image: 'File (required) - The user avatar/image file (max 5MB, JPEG/PNG/WebP)',
        username: 'String (required) - The ML username (max 20 chars)'
      },
      example: {
        image: 'File object',
        username: 'PlayerName'
      }
    }
  });
}