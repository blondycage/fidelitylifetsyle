import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

const VENDOR_URL = 'http://45.33.68.176:8077/api/v1/vendor';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();

    console.log(`[${requestId}] 🔵 VENDOR REGISTER REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: `${VENDOR_URL}/register`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        ...body,
        password: '[REDACTED]' // Hide password in logs
      }
    });

    const response = await fetch(`${VENDOR_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} VENDOR REGISTER RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      contentType,
      responseText: text.substring(0, 200),
      data
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 VENDOR REGISTER ERROR:`, {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return createErrorResponse(500, 'Internal server error');
  }
}