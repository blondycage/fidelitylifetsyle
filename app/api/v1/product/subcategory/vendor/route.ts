import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { responseCode: 400, responseMessage: 'Vendor ID is required.', data: null },
        { status: 400 }
      );
    }

    console.log('🚀 Subcategory Fetch API Request:', {
      timestamp: new Date().toISOString(),
      method: 'GET',
      url: `http://45.33.68.176:9091/api/v1/product/subcategory/vendor?vendorId=${vendorId}`,
      vendorId: vendorId
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
    const backendResponse = await fetch(`http://45.33.68.176:9091/api/v1/product/subcategory/vendor?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
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
      if (responseText.trim()) {
        data = JSON.parse(responseText);
        console.log('✅ Parsed JSON Response:', { timestamp: new Date().toISOString(), data: data });
      } else {
        data = { responseCode: backendResponse.status, responseMessage: backendResponse.statusText || 'Empty response from backend', data: null };
        console.log('⚠️ Empty Response - Using fallback data:', { timestamp: new Date().toISOString(), fallbackData: data });
      }
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', { timestamp: new Date().toISOString(), error: parseError, responseText: responseText });
      data = { responseCode: 500, responseMessage: 'Invalid JSON response from backend', data: null, error: parseError.message, rawResponse: responseText };
    }

    console.log('✅ Subcategory Fetch Backend Response:', { timestamp: new Date().toISOString(), status: backendResponse.status, data: data });
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('❌ Subcategory Fetch API Error:', error);
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