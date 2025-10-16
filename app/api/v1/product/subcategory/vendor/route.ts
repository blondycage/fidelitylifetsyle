import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { responseCode: 400, responseMessage: 'Vendor ID is required.', data: null },
        { status: 400 }
      );
    }

    console.log('🚀 Subcategory Fetch API Request:', {
      timestamp: new Date().toISOString(),
      method: 'GET',
      url: `http://45.33.68.176:9091/api/v1/product/subcategory/vendor?vendorId=${vendorId}`,
      vendorId: vendorId
    });

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];

    // Make request to backend
    const backendResponse = await fetch(`http://45.33.68.176:9091/api/v1/product/subcategory/vendor?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
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
    console.error('❌ Subcategory Fetch API Error:', error);
    return NextResponse.json(
      {
        responseCode: 500,
        responseMessage: 'Internal server error',
        data: null
      },
      { status: 500 }
    );
  }
}