import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Category List API Request:', {
      timestamp: new Date().toISOString(),
      method: 'GET',
      url: 'http://45.33.68.176:9091/api/v1/product/category/list'
    });

    // Make request to backend
    const backendResponse = await fetch('http://45.33.68.176:9091/api/v1/product/category/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();
    
    console.log('✅ Category List Backend Response:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      data: data
    });

    return NextResponse.json(data, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('❌ Category List API Error:', error);
    return NextResponse.json(
      {
        responseCode: 500,
        responseMessage: 'Internal server error',
        data: []
      },
      { status: 500 }
    );
  }
}