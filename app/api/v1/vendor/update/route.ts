import { NextRequest, NextResponse } from 'next/server';

const VENDOR_UPDATE_URL = 'http://45.33.68.176:8077/api/v1/vendor/update';

export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { responseCode: 401, responseMessage: 'Authorization token required', data: null },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];

    // Get request body
    const body = await request.json();

    console.log(`[${requestId}] 🔄 VENDOR UPDATE REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'PUT',
      url: VENDOR_UPDATE_URL,
      hasToken: !!token,
      payload: {
        ...body,
        // Don't log sensitive data in production
      }
    });

    const response = await fetch(VENDOR_UPDATE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const duration = Date.now() - startTime;
    let data;

    // Check if response has content
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (text.trim() === '') {
      // Empty response
      data = {
        responseCode: response.status,
        responseMessage: response.statusText || 'Empty response from server',
        data: null
      };
    } else if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        data = {
          responseCode: response.status,
          responseMessage: `Invalid JSON response: ${text.substring(0, 100)}`,
          data: null
        };
      }
    } else {
      // Non-JSON response
      data = {
        responseCode: response.status,
        responseMessage: text.substring(0, 200) || response.statusText,
        data: null
      };
    }

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} VENDOR UPDATE RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      contentType,
      hasData: !!data.data
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 VENDOR UPDATE ERROR:`, {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { responseCode: 500, responseMessage: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}