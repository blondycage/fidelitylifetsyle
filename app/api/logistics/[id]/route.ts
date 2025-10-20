import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

const LOGISTICS_BASE_URL = 'http://45.33.68.176:8073/api/v1/logistics';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const logisticsId = params.id;

    if (!logisticsId || isNaN(Number(logisticsId))) {
      return createErrorResponse(400, 'Valid logistics ID is required');
    }

    console.log('🚀 Logistics Single Area GET Request:', {
      timestamp: new Date().toISOString(),
      logisticsId,
      pathname: request.url
    });

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];

    // Construct the backend URL
    const backendUrl = `${LOGISTICS_BASE_URL}/${logisticsId}`;
    
    console.log('🔗 Backend URL:', backendUrl);

    // Make request to backend
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    // Log response details for debugging
    console.log('📡 Logistics Single Area Backend Response Details:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      ok: backendResponse.ok
    });

    // Handle backend response
    return await handleBackendResponse(backendResponse, {
      fallbackResponseCode: 500,
      fallbackMessage: 'Failed to fetch logistics area'
    });

  } catch (error) {
    console.error('❌ Logistics Single Area API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}