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

    // Log response details for debugging
    console.log('📡 Backend Response Details:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: Object.fromEntries(backendResponse.headers.entries()),
      ok: backendResponse.ok
    });

    // Get response text first to check if it's valid JSON
    const responseText = await backendResponse.text();
    console.log('📄 Raw Response Text:', {
      timestamp: new Date().toISOString(),
      text: responseText,
      length: responseText.length,
      isEmpty: responseText.length === 0
    });

    let data;
    try {
      // Only try to parse JSON if there's actual content
      if (responseText.trim()) {
        data = JSON.parse(responseText);
        console.log('✅ Parsed JSON Response:', {
          timestamp: new Date().toISOString(),
          data: data
        });
      } else {
        // Handle empty response
        data = {
          responseCode: backendResponse.status,
          responseMessage: backendResponse.statusText || 'Empty response from backend',
          data: null
        };
        console.log('⚠️ Empty Response - Using fallback data:', {
          timestamp: new Date().toISOString(),
          fallbackData: data
        });
      }
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', {
        timestamp: new Date().toISOString(),
        error: parseError,
        responseText: responseText
      });
      
      // Return error response for invalid JSON
      data = {
        responseCode: 500,
        responseMessage: 'Invalid JSON response from backend',
        data: null,
        error: parseError.message,
        rawResponse: responseText
      };
    }

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