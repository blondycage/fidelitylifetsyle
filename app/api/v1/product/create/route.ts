import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🚀 Product Create API Request:', {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: 'http://45.33.68.176:9091/api/v1/product/create',
      payload: body
    });

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];

    // Make request to backend
    const backendResponse = await fetch('http://45.33.68.176:9091/api/v1/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
      body: JSON.stringify(body),
    });

    // Log response details for debugging
    console.log('📡 Backend Response Details:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: Object.fromEntries(backendResponse.headers.entries()),
      ok: backendResponse.ok
    });

    // Handle backend response with improved responseCode handling
    return await handleBackendResponse(backendResponse, {
      fallbackResponseCode: 500,
      fallbackMessage: 'Backend request failed'
    });

  } catch (error) {
    console.error('❌ Product Create API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}