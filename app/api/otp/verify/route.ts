import { NextRequest, NextResponse } from 'next/server';

const OTP_URL = 'http://45.33.68.176:8077/api/v1/vendor/validate-reg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${OTP_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('OTP Verify API Error:', error);
    return NextResponse.json(
      { responseCode: 500, responseMessage: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}