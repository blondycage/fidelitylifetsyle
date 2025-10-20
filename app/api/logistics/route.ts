import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

const LOGISTICS_BASE_URL = 'http://45.33.68.176:8073/api/v1/logistics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, method, data } = body;

    console.log('🚀 Logistics API Request:', {
      timestamp: new Date().toISOString(),
      method: method || 'POST',
      url: url,
      payload: data
    });

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];

    // Determine the full backend URL
    let backendUrl = url;
    if (url.startsWith('http://45.33.68.176:8073')) {
      backendUrl = url;
    } else {
      // If it's a relative path, construct the full URL
      backendUrl = `${LOGISTICS_BASE_URL}${url}`;
    }

    // Make request to backend
    const backendResponse = await fetch(backendUrl, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    // Log response details for debugging
    console.log('📡 Logistics Backend Response Details:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: Object.fromEntries(backendResponse.headers.entries()),
      ok: backendResponse.ok
    });

    // Handle backend response with improved responseCode handling
    return await handleBackendResponse(backendResponse, {
      fallbackResponseCode: 500,
      fallbackMessage: 'Logistics backend request failed'
    });

  } catch (error) {
    console.error('❌ Logistics API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const page = searchParams.get('page') || '1'; // First page is 1, not 0
    const size = searchParams.get('size') || '10';

    // Get token from Authorization header first
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];

    // Check if this is a request for a specific logistics area by ID
    // Path would be /api/logistics/22 for single area
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    console.log('🔍 Path segments:', pathSegments);
    
    // Check if the last segment is a number (logistics ID)
    const lastSegment = pathSegments[pathSegments.length - 1];
    const logisticsId = lastSegment && !isNaN(Number(lastSegment)) ? Number(lastSegment) : null;
    
    let backendUrl: string;
    
    if (logisticsId) {
      // Single logistics area request
      backendUrl = `${LOGISTICS_BASE_URL}/${logisticsId}`;
      
      console.log('🚀 Logistics GET Single Area Request:', {
        timestamp: new Date().toISOString(),
        pathname,
        pathSegments,
        lastSegment,
        logisticsId,
        backendUrl,
        hasToken: !!token
      });
    } else {
      // List logistics areas request
      if (!vendorId) {
        return createErrorResponse(400, 'Vendor ID is required for listing areas');
      }

      backendUrl = `${LOGISTICS_BASE_URL}/by-vendor-id/${vendorId}?page=${page}&size=${size}`;
      
      console.log('🚀 Logistics GET List Request:', {
        timestamp: new Date().toISOString(),
        pathname,
        pathSegments,
        lastSegment,
        vendorId,
        page,
        size,
        backendUrl,
        hasToken: !!token
      });
    }

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
    console.log('📡 Logistics GET Backend Response Details:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      ok: backendResponse.ok
    });

    // Handle backend response
    return await handleBackendResponse(backendResponse, {
      fallbackResponseCode: 500,
      fallbackMessage: 'Failed to fetch logistics data'
    });

  } catch (error) {
    console.error('❌ Logistics GET API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}