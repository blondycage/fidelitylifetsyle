// Product service for API calls
export interface ProductImage {
  imageUrl: string;
  isPrimary: boolean;
}

export interface EventData {
  eventId: number;
  eventDate: string;
  eventTime: string;
  eventEndDate: string;
  eventEndTime: string;
  eventType: string;
  venue: string;
  maxAttendees: number;
}

export interface AccommodationData {
  accommodationId: number;
  propertyName: string;
  dailyRate: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  totalArea: string;
  furnishingStatus: string;
  amenities: string[];
  floorNumber: string;
  parkingSpaces: number;
  houseRules: string[];
  cancellationPolicy: string;
}

export interface ReservationData {
  reservationId: number;
  serviceType: string;
  cuisineType: string[];
  operatingHours: number;
  tableCapacity: number;
  reservationFee: number;
  reservationDuration: number;
  acceptsWalkIns: boolean;
  dressCode: string;
  specialFeatures: string[];
}

export interface ApiProduct {
  productId: number;
  vendorId: number;
  productName: string;
  price: number | null;
  quantity: number | null;
  categoryName?: string;
  subcategoryName: string | null;
  images: ProductImage[];
  event: EventData | {};
  tickets: any[];
  accommodation: AccommodationData | {};
  reservation: ReservationData | {};
}

export interface ProductListResponse {
  responseCode: number;
  responseMessage: string;
  data: ApiProduct[];
}

export interface TicketCreateRequest {
  eventId: number;
  price: number;
  quantity: number;
  description: string;
}

export interface TicketCreateResponse {
  responseCode: number;
  responseMessage: string;
  data?: {
    ticketId: number;
  };
}

// Base URL for the API
const BASE_URL = 'http://45.33.68.176:9091';

// Function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-product.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Function to get primary image URL
export const getPrimaryImageUrl = (images: ProductImage[]): string => {
  if (!images || images.length === 0) return '/placeholder-product.png';
  
  const primaryImage = images.find(img => img.isPrimary);
  const firstImage = images[0];
  const imageToUse = primaryImage || firstImage;
  
  return getImageUrl(imageToUse.imageUrl);
};

// Function to determine product type based on category and data
export const getProductType = (product: ApiProduct): 'product' | 'event' | 'accommodation' | 'reservation' => {
  if (product.categoryName === 'EVENTS' && Object.keys(product.event).length > 0) {
    return 'event';
  }
  if (product.categoryName && ['HOTEL', 'HOSPITALITY', 'APARTMENT'].includes(product.categoryName) && Object.keys(product.accommodation).length > 0) {
    return 'accommodation';
  }
  if (product.categoryName === 'RESERVATIONS' && Object.keys(product.reservation).length > 0) {
    return 'reservation';
  }
  return 'product';
};

// Function to get product status based on quantity
export const getProductStatus = (quantity: number | null | undefined): 'Available' | 'Unavailable' => {
  return (quantity || 0) > 0 ? 'Available' : 'Unavailable';
};

// Function to format product name based on type
export const getDisplayName = (product: ApiProduct): string => {
  const type = getProductType(product);
  
  if (type === 'accommodation' && Object.keys(product.accommodation).length > 0) {
    const accommodation = product.accommodation as AccommodationData;
    return accommodation.propertyName || product.productName || 'Unnamed Property';
  }
  
  return product.productName || 'Unnamed Product';
};

// Function to get SKU based on product type and ID
export const getProductSku = (product: ApiProduct): string => {
  const type = getProductType(product);
  const prefix = type === 'event' ? 'EVT' : 
                 type === 'accommodation' ? 'ACC' : 
                 type === 'reservation' ? 'RES' : 'PRD';
  return `${prefix}${product.productId.toString().padStart(3, '0')}`;
};

// Function to fetch products for a vendor
export const fetchVendorProducts = async (vendorId: number, token: string, businessType?: string): Promise<ProductListResponse> => {
  try {
    const response = await fetch(`/api/v1/product/list?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductListResponse = await response.json();
    
    // Filter products by business type if provided
    if (businessType && data.data) {
      // Map business types to category names for filtering
      const businessTypeToCategoryMap: Record<string, string[]> = {
        'EVENTS': ['EVENTS'],
        'EXPERIENCES': ['EXPERIENCES'],
        'TOUR_GUIDE': ['TOUR_GUIDE'],
        'INFLUENCER': ['INFLUENCER'],
        'HOTEL': ['HOTEL'],
        'HOSPITALITY': ['HOSPITALITY'],
        'APARTMENT': ['APARTMENT'],
        'RESTAURANT': ['RESTAURANT'],
        'CLUB': ['CLUB'],
        'RESERVATIONS': ['RESERVATIONS'],
        'SUPERMARKET': ['SUPERMARKET'],
        'PHARMACY': ['PHARMACY'],
        'FASHION': ['FASHION'],
        'OTHERS': ['OTHERS']
      };

      const allowedCategories = businessTypeToCategoryMap[businessType] || [];
      
      const filteredProducts = data.data.filter(product => {
        return allowedCategories.includes(product.categoryName || '');
      });

      console.log(`Filtered products for business type ${businessType}:`, {
        totalProducts: data.data.length,
        filteredProducts: filteredProducts.length,
        businessType,
        allowedCategories
      });

      return {
        ...data,
        data: filteredProducts
      };
    }

    return data;
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    throw error;
  }
};

// Function to create a ticket for an event
export const createTicket = async (ticketData: TicketCreateRequest, token: string): Promise<TicketCreateResponse> => {
  try {
    const response = await fetch('/api/v1/product/create/ticket', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TicketCreateResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};