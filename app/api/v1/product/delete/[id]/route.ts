import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/api-proxy-utils';

const PRODUCT_BASE_URL = 'http://45.33.68.176:9091/api/v1/product';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Authorization token required');
    }

    const token = authorization.split(' ')[1];
    const productId = params.id;

    console.log('🗑️ Deleting product:', productId);

    const backendUrl = `${PRODUCT_BASE_URL}/delete/${productId}`;

    const backendResponse = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    const responseData = await backendResponse.json();

    return NextResponse.json(responseData, { status: backendResponse.status });
  } catch (error) {
    console.error('❌ Delete Product API Error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
}
