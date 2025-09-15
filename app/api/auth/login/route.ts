import { NextRequest, NextResponse } from 'next/server';

const LOGIN_URL = 'http://45.33.68.176:8090/api/v1/auth';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();

    console.log(`[${requestId}] 🔵 LOGIN REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: `${LOGIN_URL}/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        ...body,
        password: '[REDACTED]' // Hide password in logs
      }
    });

    const response = await fetch(`${LOGIN_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} LOGIN RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      data: {
        ...data,
        data: data.data ? { ...data.data, token: data.data.token ? '[TOKEN_RECEIVED]' : undefined } : null
      }
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 LOGIN ERROR:`, {
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