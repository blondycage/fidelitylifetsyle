import { NextRequest, NextResponse } from 'next/server';

const CUSTOMER_URL = 'http://45.33.68.176:9090/api/v1/customer';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();

    console.log(`[${requestId}] 🔵 CUSTOMER REGISTER REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: `${CUSTOMER_URL}/register`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        ...body,
        password: '[REDACTED]' // Hide password in logs
      }
    });

    const response = await fetch(`${CUSTOMER_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} CUSTOMER REGISTER RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      data
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 CUSTOMER REGISTER ERROR:`, {
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