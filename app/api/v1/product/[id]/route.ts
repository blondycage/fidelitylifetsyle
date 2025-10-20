import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/api-proxy-utils';

const PRODUCT_BASE_URL = 'http://45.33.68.176:9091/api/v1/product';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('\n\n🎬 === API ROUTE CALLED ===');
  console.log('🎬 Request URL:', request.url);
  console.log('🎬 Request Method:', request.method);
  console.log('🎬 Params:', params);

  try {
    const productId = params.id;
    console.log('🔍 Product ID from params:', productId);

    if (!productId || isNaN(Number(productId))) {
      console.log('❌ Invalid product ID');
      return createErrorResponse(400, 'Valid product ID is required');
    }

    // Get vendorId from query params
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    console.log('🔍 Vendor ID from query:', vendorId);

    if (!vendorId) {
      console.log('❌ Missing vendor ID');
      return createErrorResponse(400, 'Vendor ID is required');
    }

    const backendUrl = `${PRODUCT_BASE_URL}/list?productId=${productId}&vendorId=${vendorId}`;

    console.log(`\n🚀 === CALLING BACKEND ===`);
    console.log(`🚀 Product ID: ${productId}`);
    console.log(`🚀 Vendor ID: ${vendorId}`);
    console.log(`🚀 Backend URL: ${backendUrl}`);
    console.log(`🚀 Timestamp: ${new Date().toISOString()}`);

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
    });

    console.log(`\n📡 === BACKEND RESPONSE ===`);
    console.log(`📡 Status: ${backendResponse.status}`);
    console.log(`📡 Status Text: ${backendResponse.statusText}`);
    console.log(`📡 Timestamp: ${new Date().toISOString()}`);

    const responseData = await backendResponse.json();
    console.log(`\n📦 === RESPONSE DATA ===`);
    console.log(JSON.stringify(responseData, null, 2));

    console.log('\n✅ === API ROUTE COMPLETE ===\n');
    return NextResponse.json(responseData, { status: backendResponse.status });
  } catch (error) {
    console.error('\n❌ === API ROUTE ERROR ===');
    console.error('❌ Error:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'No stack trace');
    return createErrorResponse(500, 'Internal server error');
  }
}
