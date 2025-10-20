import { ApiResponse } from '@/types/api';

// Logistics data interfaces
export interface LogisticsArea {
  logisticsId: number;
  deliveryArea: string;
  deliveryFee: number;
  vendorId: number;
}

export interface CreateLogisticsPayload {
  deliveryArea: string;
  deliveryFee: number;
  vendorId: number;
  vendorEmail: string;
}

export interface UpdateLogisticsPayload {
  deliveryArea: string;
  deliveryFee: number;
  vendorId: number;
  vendorEmail: string;
}

export interface PageableRequestDTO {
  size: number;
  page: number;
}

export interface LogisticsListResponse {
  responseCode: number;
  responseMessage: string;
  data: {
    hasNextRecord: boolean;
    totalCount: number;
    size: number;
    page: number;
    logisticsResponseList: LogisticsArea[];
  };
}

// API request helper function using proxy server
const apiRequest = async <T>(endpoint: string, method: string, payload?: any, logName: string): Promise<ApiResponse<T>> => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    console.log(`[${requestId}] 🚀 FRONTEND ${logName} REQUEST:`, {
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      payload: payload ? payload : 'No payload'
    });

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Use logistics proxy server approach
    let response;
    if (method === 'GET') {
      // For GET requests, use the endpoint directly (it should be a full path)
      const fullUrl = endpoint.startsWith('/api/') ? endpoint : `/api/logistics${endpoint}`;
      console.log(`[${requestId}] GET Request URL:`, fullUrl);
      
      response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        },
      });
    } else {
      // For POST/PUT/DELETE requests, use the proxy body format
      response = await fetch('/api/logistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        },
        body: JSON.stringify({
          url: endpoint,
          method: method,
          data: payload
        }),
      });
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`[${requestId}] ${response.ok ? '✅' : '❌'} FRONTEND ${logName} RESPONSE:`, {
      timestamp: new Date().toISOString(),
      status: response.status,
      duration: `${duration}ms`,
      data: response.ok ? data : { error: data }
    });

    if (!response.ok) {
      throw new Error(data.responseMessage || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] ❌ FRONTEND ${logName} ERROR:`, {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};

// Create logistics area
export const createLogisticsArea = async (payload: CreateLogisticsPayload): Promise<ApiResponse<LogisticsArea>> => {
  return apiRequest<LogisticsArea>(
    '/create',
    'POST',
    payload,
    'CREATE LOGISTICS AREA'
  );
};

// Update logistics area
export const updateLogisticsArea = async (logisticsId: number, payload: UpdateLogisticsPayload): Promise<ApiResponse<LogisticsArea>> => {
  return apiRequest<LogisticsArea>(
    `/update/${logisticsId}`,
    'PUT',
    payload,
    'UPDATE LOGISTICS AREA'
  );
};

// Get logistics areas for vendor with pagination
export const getLogisticsAreas = async (
  vendorId: number, 
  page: number = 0, 
  size: number = 100
): Promise<LogisticsListResponse> => {
  // Validate and sanitize inputs
  const validPage = isNaN(Number(page)) ? 0 : Number(page);
  const validSize = isNaN(Number(size)) ? 10 : Number(size);
  const validVendorId = isNaN(Number(vendorId)) ? 0 : Number(vendorId);

  // Convert 0-based frontend page to 1-based backend page
  const backendPage = Math.max(1, validPage + 1); // Ensure minimum page is 1
  const backendSize = Math.min(Math.max(1, validSize), 100); // Ensure size is between 1-100

  console.log('🔍 Logistics pagination debug:', {
    inputPage: page,
    validPage: validPage,
    backendPage: backendPage,
    inputSize: size,
    validSize: validSize,
    backendSize: backendSize,
    inputVendorId: vendorId,
    validVendorId: validVendorId
  });

  const queryParams = new URLSearchParams({
    vendorId: validVendorId.toString(),
    size: backendSize.toString(),
    page: backendPage.toString()
  });

  console.log('🔍 Final query string:', queryParams.toString());

  return apiRequest<LogisticsListResponse>(
    `?${queryParams.toString()}`,
    'GET',
    undefined,
    'GET LOGISTICS AREAS'
  );
};

// Get single logistics area by ID
export const getLogisticsAreaById = async (logisticsId: number): Promise<ApiResponse<LogisticsArea>> => {
  return apiRequest<LogisticsArea>(
    `/api/logistics/${logisticsId}`,
    'GET',
    undefined,
    'GET LOGISTICS AREA BY ID'
  );
};

// Delete logistics area
export const deleteLogisticsArea = async (logisticsId: number): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(
    `/delete/${logisticsId}`,
    'DELETE',
    undefined,
    'DELETE LOGISTICS AREA'
  );
};