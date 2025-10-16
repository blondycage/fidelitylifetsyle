import { NextResponse } from 'next/server';

export interface BackendResponse {
  responseCode: number;
  responseMessage: string;
  data: any;
}

export interface ProxyResponseOptions {
  fallbackResponseCode?: number;
  fallbackMessage?: string;
}

/**
 * Handles backend response and returns appropriate NextResponse
 * Prioritizes responseCode from backend JSON over HTTP status code
 */
export async function handleBackendResponse(
  backendResponse: Response,
  options: ProxyResponseOptions = {}
): Promise<NextResponse> {
  const { 
    fallbackResponseCode = 500, 
    fallbackMessage = 'Internal server error' 
  } = options;

  // Get response text first to check if it's valid JSON
  const responseText = await backendResponse.text();
  
  let data: BackendResponse;
  
  try {
    // Only try to parse JSON if there's actual content
    if (responseText.trim()) {
      data = JSON.parse(responseText);
      
      // Use responseCode from backend if it exists, otherwise use HTTP status
      const finalResponseCode = data.responseCode || backendResponse.status;
      
      return NextResponse.json(data, {
        status: finalResponseCode
      });
    } else {
      // Handle empty response
      data = {
        responseCode: backendResponse.status,
        responseMessage: backendResponse.statusText || 'Empty response from backend',
        data: null
      };
      
      return NextResponse.json(data, {
        status: backendResponse.status
      });
    }
  } catch (parseError) {
    console.error('❌ JSON Parse Error:', {
      timestamp: new Date().toISOString(),
      error: parseError,
      responseText: responseText
    });
    
    // Return error response for invalid JSON
    data = {
      responseCode: fallbackResponseCode,
      responseMessage: 'Invalid JSON response from backend',
      data: null,
      error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
      rawResponse: responseText
    };
    
    return NextResponse.json(data, {
      status: fallbackResponseCode
    });
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  responseCode: number,
  message: string,
  data: any = null
): NextResponse {
  return NextResponse.json(
    {
      responseCode,
      responseMessage: message,
      data
    },
    { status: responseCode }
  );
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse(
  responseCode: number,
  message: string,
  data: any
): NextResponse {
  return NextResponse.json(
    {
      responseCode,
      responseMessage: message,
      data
    },
    { status: responseCode }
  );
}