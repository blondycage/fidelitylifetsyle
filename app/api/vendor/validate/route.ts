import { NextRequest, NextResponse } from 'next/server';

const VENDOR_VALIDATE_URL = 'http://45.33.68.176:8077/api/v1/vendor/validate-reg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('✅ Vendor Validate OTP Request:', JSON.stringify(body, null, 2));

    const response = await fetch(VENDOR_VALIDATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('✅ Backend Response Status:', response.status);
    console.log('✅ Backend Response Headers:', response.headers.get('content-type'));

    // Check if response has content
    const responseText = await response.text();
    console.log('✅ Raw Response Text:', responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.log('✅ JSON Parse Error, treating as success with empty response');
      data = {
        responseCode: response.ok ? 200 : response.status,
        responseMessage: response.ok ? 'Vendor validation successful' : 'Vendor validation failed',
        data: null
      };
    }

    console.log('✅ Vendor Validate OTP Response:', JSON.stringify({
      status: response.status,
      data
    }, null, 2));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Vendor Validate OTP API Error:', error);
    return NextResponse.json(
      { responseCode: 500, responseMessage: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}