import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

const CUSTOMER_RESET_PASSWORD_FINAL_URL = 'http://45.33.68.176:9090/api/v1/customer/reset-pass/final';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');
    const newPassword = searchParams.get('newPassword');

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { responseCode: 400, responseMessage: 'Email, OTP, and newPassword parameters are required', data: null },
        { status: 400 }
      );
    }

    console.log('🔄 Customer Reset Password Final Request:', {
      email,
      otp: otp.substring(0, 2) + '****',
      newPassword: '[REDACTED]'
    });

    const queryParams = new URLSearchParams({
      email,
      otp,
      newPassword,
    });

    const response = await fetch(`${CUSTOMER_RESET_PASSWORD_FINAL_URL}?${queryParams}`, {
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
        responseMessage: response.ok ? 'Password reset successfully' : 'Password reset failed',
        data: null
      };
    }

    console.log('🔄 Customer Reset Password Final Response:', JSON.stringify({
      status: response.status,
      data
    }, null, 2));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Customer Reset Password Final API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}