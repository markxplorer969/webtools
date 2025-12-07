import { NextRequest, NextResponse } from 'next/server';

// 100 Query untuk masing-masing gender (Pilar 1 - "100 query")
const maleQueries = [
  'pria ganteng indonesia', 'cowo keren indonesia', 'pria tampan indonesia', 'cowok ganteng',
  'pria stylish indonesia', 'cowok modern indonesia', 'pria elegan indonesia', 'cowok kece indonesia',
  'pria maskulin indonesia', 'cowok tampan natural', 'pria berkelas indonesia', 'cowok aesthetic',
  'pria casual indonesia', 'cowok formal indonesia', 'pria sporty indonesia', 'cowok gentle',
  'pria smart indonesia', 'cowok profesional indonesia', 'pria artistik indonesia', 'cowok trendy',
  'pria klasik indonesia', 'cowok vintage indonesia', 'pria minimalis indonesia', 'cowok urban',
  'pria outdoor indonesia', 'cowok adventure indonesia', 'pria fitness indonesia', 'cowok athletic',
  'pria intellectual indonesia', 'cowok educated indonesia', 'pria sophisticated indonesia', 'cowok charming',
  'pria friendly indonesia', 'cowok approachable indonesia', 'pria confident indonesia', 'cowok charismatic',
  'pria creative indonesia', 'cowok innovative indonesia', 'pria unique indonesia', 'cowok distinctive',
  'pria handsome indonesia', 'cowok good looking indonesia', 'pria attractive indonesia', 'cowok appealing',
  'pria elegant style indonesia', 'cowok fashion indonesia', 'pria trendy look indonesia', 'cowok modern style',
  'pria casual look indonesia', 'cowok relaxed style indonesia', 'pria formal attire indonesia', 'cowok business look',
  'pria sporty look indonesia', 'cowok athletic style indonesia', 'pria outdoor style indonesia', 'cowok adventure look',
  'pria urban style indonesia', 'cowok city look indonesia', 'pria street style indonesia', 'cowok casual street',
  'pria minimalist indonesia', 'cowok simple style indonesia', 'pria clean look indonesia', 'cowok neat appearance',
  'pria sophisticated indonesia', 'cowok refined look indonesia', 'pria polished style indonesia', 'cowok elegant appearance',
  'pria natural look indonesia', 'cowok organic style indonesia', 'pria authentic appearance indonesia', 'cowok genuine look',
  'pria cool indonesia', 'cowok trendy indonesia', 'pria modern indonesia', 'cowok fashionable indonesia',
  'pria handsome man indonesia', 'cowok good looking man indonesia', 'pria attractive man indonesia', 'cowok appealing man indonesia',
  'pria stylish man indonesia', 'cowo fashionable man indonesia', 'pria elegant man indonesia', 'cowok sophisticated man indonesia'
];

const femaleQueries = [
  'wanita cantik indonesia', 'cewek cantik indonesia', 'gadis cantik indonesia', 'perempuan cantik',
  'wanita elegan indonesia', 'cewek elegan indonesia', 'gadis berkelas indonesia', 'perempuan sophisticated',
  'wanita modern indonesia', 'cewek modern indonesia', 'gadis kekinian indonesia', 'perempuan trendy',
  'wanita natural indonesia', 'cewek natural indonesia', 'gadis natural beauty indonesia', 'perempuan authentic',
  'wanita stylish indonesia', 'cewek stylish indonesia', 'gadis fashionable indonesia', 'perempuan chic',
  'wanita minimalis indonesia', 'cewek minimalis indonesia', 'gadis simple beauty indonesia', 'perempuan clean look',
  'wanita artistic indonesia', 'cewek artistic indonesia', 'gadis creative indonesia', 'perempuan unique',
  'wanita professional indonesia', 'cewek professional indonesia', 'gadis career woman indonesia', 'perempuan executive',
  'wanita friendly indonesia', 'cewek friendly indonesia', 'gadis approachable indonesia', 'perempuan warm',
  'wanita confident indonesia', 'cewek confident indonesia', 'gadis self assured indonesia', 'perempuan poised',
  'wanita charming indonesia', 'cewek charming indonesia', 'gadis enchanting indonesia', 'perempuan captivating',
  'wanita graceful indonesia', 'cewek graceful indonesia', 'gadis elegant movement indonesia', 'perempuan refined',
  'wanita vibrant indonesia', 'cewek vibrant indonesia', 'gadis energetic indonesia', 'perempuan lively',
  'wanita serene indonesia', 'cewek serene indonesia', 'gadis calm beauty indonesia', 'perempuan tranquil',
  'wanita mysterious indonesia', 'cewek mysterious indonesia', 'gadis intriguing indonesia', 'perempuan enigmatic',
  'wanita bold indonesia', 'cewek bold indonesia', 'gadis daring indonesia', 'perempuan confident',
  'wanita delicate indonesia', 'cewek delicate indonesia', 'gadis gentle beauty indonesia', 'perempuan refined',
  'wanita exotic indonesia', 'cewek exotic indonesia', 'gadis unique beauty indonesia', 'perempuan distinctive',
  'wanita timeless indonesia', 'cewek timeless indonesia', 'gadis classic beauty indonesia', 'perempuan eternal',
  'wanita radiant indonesia', 'cewek radiant indonesia', 'gadis glowing beauty indonesia', 'perempuan luminous',
  'wanita angelic indonesia', 'cewek angelic indonesia', 'gadis ethereal beauty indonesia', 'perempuan divine',
  'wanita sophisticated indonesia', 'cewek sophisticated indonesia', 'gadis cultured beauty indonesia', 'perempuan refined',
  'wanita intellectual indonesia', 'cewek intellectual indonesia', 'gadis smart beauty indonesia', 'perempuan intelligent',
  'wanita adventurous indonesia', 'cewek adventurous indonesia', 'gadis explorer indonesia', 'perempuan daring',
  'wanita bohemian indonesia', 'cewek bohemian indonesia', 'gadis free spirited indonesia', 'perempuan artistic',
  'wanita glamorous indonesia', 'cewek glamorous indonesia', 'gadis hollywood beauty indonesia', 'perempuan stunning',
  'wanita innocent indonesia', 'cewek innocent indonesia', 'gadis pure beauty indonesia', 'perempuan angelic',
  'wanita fierce indonesia', 'cewek fierce indonesia', 'gadis strong beauty indonesia', 'perempuan powerful',
  'wanita whimsical indonesia', 'cewek whimsical indonesia', 'gadis playful beauty indonesia', 'perempuan charming',
  'wanita regal indonesia', 'cewek regal indonesia', 'gadis royal beauty indonesia', 'perempuan majestic',
  'wanita dreamy indonesia', 'cewek dreamy indonesia', 'gadis ethereal beauty indonesia', 'perempuan mystical',
  'wanita urban indonesia', 'cewek urban indonesia', 'gadis city beauty indonesia', 'perempuan metropolitan',
  'wanita rustic indonesia', 'cewek rustic indonesia', 'gadis natural beauty indonesia', 'perempuan earthy',
  'wanita vintage indonesia', 'cewek vintage indonesia', 'gadis retro beauty indonesia', 'perempuan classic',
  'wanita futuristic indonesia', 'cewek futuristic indonesia', 'gadis modern beauty indonesia', 'perempuan contemporary',
  'wanita tropical indonesia', 'cewek tropical indonesia', 'gadis exotic beauty indonesia', 'perempuan island',
  'wanita mystical indonesia', 'cewek mystical indonesia', 'gadis enchanting beauty indonesia', 'perempuan magical',
  'wanita beautiful indonesia', 'cewek beautiful indonesia', 'gadis pretty indonesia', 'perempuan gorgeous',
  'wanita lovely indonesia', 'cewek lovely indonesia', 'gadis cute indonesia', 'perempuan adorable',
  'wanita sweet indonesia', 'cewek sweet indonesia', 'gadis charming indonesia', 'perempuan delightful'
];

function getRandomQuery(gender: string): string {
  const queries = gender === 'cowo' ? maleQueries : femaleQueries;
  const randomIndex = Math.floor(Math.random() * queries.length);
  return queries[randomIndex];
}

export async function POST(request: NextRequest) {
  try {
    const { gender, amount = 4 } = await request.json();

    // Validation
    if (!gender || !['cowo', 'cewe'].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender parameter. Must be "cowo" or "cewe"' },
        { status: 400 }
      );
    }

    if (amount < 1 || amount > 100) {
      return NextResponse.json(
        { error: 'Amount must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Get random query
    const query = getRandomQuery(gender);
    const apiUrl = `https://api.zenzxz.my.id/api/search/pinterest?query=${encodeURIComponent(query)}`;

    console.log(`Fetching Pinterest images for ${gender} with query: ${query}`);

    // Call Pinterest API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`Pinterest API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Pinterest API response:', data);

    // Handle different response formats
    let photos = [];
    
    if (data.result && Array.isArray(data.result)) {
      photos = data.result;
    } else if (data.data && Array.isArray(data.data)) {
      photos = data.data;
    } else if (Array.isArray(data)) {
      photos = data;
    } else {
      return NextResponse.json(
        { error: 'Unexpected API response format' },
        { status: 422 }
      );
    }

    if (photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos found' },
        { status: 404 }
      );
    }

    // Extract URLs and limit to requested amount
    const imageUrls = photos
      .slice(0, amount)
      .map((item: any) => {
        // Try different URL fields
        const url = item.directLink || item.image_url || item.url || item.image;
        return url;
      })
      .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid image URLs found' },
        { status: 404 }
      );
    }

    console.log(`Successfully extracted ${imageUrls.length} image URLs`);

    return NextResponse.json({
      success: true,
      urls: imageUrls,
      query: query,
      total: imageUrls.length,
      gender: gender
    });

  } catch (error) {
    console.error('Error in get-pinterest-images API:', error);
    
    let errorMessage = 'Failed to generate photos';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
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

export async function GET() {
  return NextResponse.json({
    message: 'Pinterest Images API',
    description: 'Generate profile photos using Pinterest API',
    usage: {
      method: 'POST',
      body: {
        gender: 'cowo | cewe (required)',
        amount: 'number (1-100, default: 4)'
      },
      example: {
        gender: 'cowo',
        amount: 4
      }
    }
  });
}