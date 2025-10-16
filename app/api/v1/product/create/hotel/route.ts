import { NextRequest, NextResponse } from 'next/server';

const HOTEL_CREATE_URL = 'http://45.33.68.176:9091/api/v1/product/create/hotel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Creating hotel with payload:', body);
    
    const backendResponse = await fetch(HOTEL_CREATE_URL, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      console.error('Backend error:', backendResponse.status, backendResponse.statusText);
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { responseCode: backendResponse.status, responseMessage: errorData.responseMessage || 'Backend error' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json();
    
    console.log('Hotel created successfully:', responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in hotel creation API:', error);
    return NextResponse.json(
      { responseCode: 500, responseMessage: 'Failed to create hotel' },
      { status: 500 }
    );
  }
}
