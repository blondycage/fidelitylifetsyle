import { NextRequest, NextResponse } from 'next/server';

const VENDOR_URL = 'http://45.33.68.176:8077/api/v1/vendor';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { responseCode: 400, responseMessage: 'Email parameter is required', data: null },
        { status: 400 }
      );
    }

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { responseCode: 401, responseMessage: 'Authorization token required', data: null },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    const encodedEmail = encodeURIComponent(email);
    const apiUrl = `${VENDOR_URL}/by-email/${encodedEmail}`;

    console.log(`[${requestId}] 🔵 VENDOR PROFILE REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'GET',
      url: apiUrl,
      email: email,
      hasToken: !!token
    });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} VENDOR PROFILE RESPONSE:`, {
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
    console.error(`[${requestId}] 💥 VENDOR PROFILE ERROR:`, {
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