import { NextRequest, NextResponse } from 'next/server';
import { handleBackendResponse, createErrorResponse } from '@/lib/api-proxy-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const isPrimary = searchParams.get('isPrimary') || 'true';
    
    console.log('🚀 Product Upload API Request:', {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: `http://45.33.68.176:9091/api/v1/product/${productId}/upload?isPrimary=${isPrimary}`,
      productId: productId,
      isPrimary: isPrimary
    });

    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];

    // Get the form data from the request
    const formData = await request.formData();
    
    // Make request to backend
    const backendResponse = await fetch(`http://45.33.68.176:9091/api/v1/product/${productId}/upload?isPrimary=${isPrimary}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
      body: formData,
    });

    const data = await backendResponse.json();
    
    console.log('✅ Product Upload Backend Response:', {
      timestamp: new Date().toISOString(),
      status: backendResponse.status,
      data: data
    });

    return NextResponse.json(data, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('❌ Product Upload API Error:', error);
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