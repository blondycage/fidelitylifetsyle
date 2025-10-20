import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/api-proxy-utils';

const VENDOR_URL = 'http://45.33.68.176:8077/api/v1/vendor';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  const vendorId = params.id;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return createErrorResponse(400, 'No file provided');
    }

    console.log(`[${requestId}] 🔵 VENDOR LOGO UPLOAD REQUEST:`, {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: `${VENDOR_URL}/upload-logo/${vendorId}`,
      vendorId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Create new FormData for backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${VENDOR_URL}/upload-logo/${vendorId}`, {
      method: 'POST',
      body: backendFormData,
    });

    const duration = Date.now() - startTime;
    let data;

    // Check if response has content
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (text.trim() === '') {
      data = {
        responseCode: response.status,
        responseMessage: response.statusText || 'Empty response from server',
        data: null
      };
    } else if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        data = {
          responseCode: response.status,
          responseMessage: `Invalid JSON response: ${text.substring(0, 100)}`,
          data: null
        };
      }
    } else {
      data = {
        responseCode: response.status,
        responseMessage: text.substring(0, 200) || response.statusText,
        data: null
      };
    }

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} VENDOR LOGO UPLOAD RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      contentType,
      responseText: text.substring(0, 200),
      data
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 VENDOR LOGO UPLOAD ERROR:`, {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return createErrorResponse(500, 'Internal server error');
  }
}