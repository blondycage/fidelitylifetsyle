import { NextRequest, NextResponse } from 'next/server';

const OTP_URL = 'http://45.33.68.176:8050/api/v1/otp';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();

    console.log(`[${requestId}] 🔵 OTP GENERATE REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: `${OTP_URL}/generate`,
      headers: {
        'Content-Type': 'application/json',
      },
      body
    });

    const response = await fetch(`${OTP_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} OTP GENERATE RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      data
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 OTP GENERATE ERROR:`, {
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