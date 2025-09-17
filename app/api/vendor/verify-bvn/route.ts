import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('BVN API route called');
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { idNumber, accountNumber } = body;

    if (!idNumber || !accountNumber) {
      return NextResponse.json(
        {
          responseCode: 400,
          responseMessage: 'BVN and account number are required',
          data: {}
        },
        { status: 400 }
      );
    }

    // Extract token from request headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Make request to proxy server - exact format that works in Postman
    const proxyUrl = `http://45.33.68.176:8077/api/v1/vendor/bvn-nin-account?idNumber=${idNumber}&accountNumber=${accountNumber}&identity=BVN`;

    console.log('===== PROXY REQUEST DETAILS =====');
    console.log('Using exact Postman format:', proxyUrl);
    console.log('Request parameters:', {
      idNumber,
      accountNumber,
      identity: 'BVN'
    });

    // Minimal headers - start with almost empty headers like Postman default
    const proxyHeaders: HeadersInit = {};

    // Add token to proxy request if available
    if (token) {
      proxyHeaders['Authorization'] = `Bearer ${token}`;
      console.log('Token added to request headers');
    } else {
      console.log('No token found in request');
    }

    console.log('Proxy request headers:', proxyHeaders);

    const proxyResponse = await fetch(proxyUrl, {
      method: 'POST',
      headers: proxyHeaders,
    });

    console.log('===== PROXY RESPONSE DETAILS =====');
    console.log('Proxy response status:', proxyResponse.status);
    console.log('Proxy response statusText:', proxyResponse.statusText);
    console.log('Proxy response headers:', Object.fromEntries(proxyResponse.headers.entries()));

    const data = await proxyResponse.json();
    console.log('===== BACKEND RESPONSE DATA =====');
    console.log('Full response from backend:', JSON.stringify(data, null, 2));

    if (!proxyResponse.ok) {
      console.log('===== ERROR RESPONSE =====');
      console.log('Error status:', proxyResponse.status);
      console.log('Error response data:', JSON.stringify(data, null, 2));

      return NextResponse.json(
        {
          responseCode: data.responseCode || 400,
          responseMessage: data.responseMessage || 'Verification failed',
          data: data.data || {}
        },
        { status: proxyResponse.status }
      );
    }

    console.log('===== SUCCESS RESPONSE =====');
    console.log('Success response data:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      responseCode: data.responseCode,
      responseMessage: data.responseMessage,
      data: data.data
    });

  } catch (error) {
    console.log('===== CATCH BLOCK ERROR =====');
    console.error('BVN verification error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

    return NextResponse.json(
      {
        responseCode: 500,
        responseMessage: 'Internal server error',
        data: {}
      },
      { status: 500 }
    );
  }
}