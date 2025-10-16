import { NextRequest, NextResponse } from 'next/server';

const PRODUCT_LIST_URL = 'http://45.33.68.176:9091/api/v1/product/list';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { responseCode: 400, responseMessage: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendUrl = `${PRODUCT_LIST_URL}?vendorId=${vendorId}`;
    
    console.log('Fetching products from:', backendUrl);
    console.log('Authorization header:', request.headers.get('Authorization') ? 'Present' : 'Missing');
    
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    console.log('Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      console.error('Backend error:', backendResponse.status, backendResponse.statusText);
      return NextResponse.json(
        { responseCode: backendResponse.status, responseMessage: 'Backend error' },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json();
    
    console.log('Backend response data:', responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in product list API:', error);
    return NextResponse.json(
      { responseCode: 500, responseMessage: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}