import { NextRequest, NextResponse } from 'next/server';

const CUSTOMER_RESET_PASSWORD_URL = 'http://45.33.68.176:9090/api/v1/customer/reset-pass';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { responseCode: 400, responseMessage: 'Email parameter is required', data: null },
        { status: 400 }
      );
    }

    console.log('🔄 Customer Reset Password Request - Email:', email);

    const response = await fetch(`${CUSTOMER_RESET_PASSWORD_URL}?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔄 Backend Response Status:', response.status);
    console.log('🔄 Backend Response Headers:', response.headers.get('content-type'));

    // Check if response has content
    const responseText = await response.text();
    console.log('🔄 Raw Response Text:', responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.log('🔄 JSON Parse Error, treating as success with empty response');
      data = {
        responseCode: response.ok ? 200 : response.status,
        responseMessage: response.ok ? 'otp generated successfully' : 'Password reset failed',
        data: null
      };
    }

    console.log('🔄 Customer Reset Password Response:', JSON.stringify({
      status: response.status,
      data
    }, null, 2));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Customer Reset Password API Error:', error);
    return NextResponse.json(
      { responseCode: 500, responseMessage: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}