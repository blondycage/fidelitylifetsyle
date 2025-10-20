import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

const PRODUCT_BASE_URL = 'http://45.33.68.176:9091/api/v1/product';

export async function PUT(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];
    const body = await request.json();

    console.log('🔄 Updating reservation product:', body);

    const backendUrl = `${PRODUCT_BASE_URL}/update/reservation`;

    const backendResponse = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return await handleBackendResponse(backendResponse, {
      fallbackResponseCode: 500,
      fallbackMessage: 'Failed to update reservation product'
    });
  } catch (error) {
    console.error('❌ Update Reservation Product API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}
