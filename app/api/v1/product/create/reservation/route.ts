import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🚀 Reservation Create API Request:', {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: 'http://45.33.68.176:9091/api/v1/product/create/reservation',
      payload: body
    });

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { responseCode: 401, responseMessage: 'Authorization token required', data: null },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];

    // Make request to backend
    const backendResponse = await fetch('http://45.33.68.176:9091/api/v1/product/create/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    
    console.log('✅ Reservation Create Backend Response:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      data: data
    });

    return NextResponse.json(data, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('❌ Reservation Create API Error:', error);
    return NextResponse.json(
      {
        responseCode: 500,
        responseMessage: 'Internal server error',
        data: null
      },
      { status: 500 }
    );
  }
}