import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        {
          responseCode: 401,
          responseMessage: 'Authorization header missing'
        },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    console.log('🚀 BVN Verification Proxy Request:', body);

    // Forward the request to the backend
    const backendResponse = await fetch('http://45.33.68.176:8078/api/v1/bank/verify-bvn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'accept': '*/*'
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    console.log('✅ BVN Verification Backend Response:', data);

    return NextResponse.json(data, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('❌ BVN Verification Proxy Error:', error);
    return NextResponse.json(
      {
        responseCode: 500,
        responseMessage: 'Internal server error'
      },
      { status: 500 }
    );
  }
}