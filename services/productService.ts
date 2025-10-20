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
  floorNumber: string;
  parkingSpaces: number;
  cancellationPolicy: string;
  // Note: amenities and houseRules are arrays in the API response
  amenities?: string[];
  houseRules?: string[];
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

export interface CarRentalData {
  carRentalId: number;
  productName: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  address: string;
  price: number;
  carMake: string;
  carModel: string;
  carYear: number;
  licensePlate: string;
  carType: string;
  seats: number;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  hasDriver: boolean;
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
  addons: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  termsAndConditions: string;
}

export interface FoodData {
  foodId: number;
  productName: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  address: string;
  price: number;
  stockQuantity: number;
  foodCategory: string;
  dietaryInfo: string[];
  spiceLevel: string;
  ingredients: string[];
  allergens: string[];
  preparationTime: number;
  servingSize: string;
  availableForDelivery: boolean;
  availableForPickup: boolean;
  deliveryFee: number;
  minimumOrderForDelivery: number;
  operatingHours: number;
  acceptsWalkIns: boolean;
}

export interface ApiProduct {
  productId: number;
  vendorId: number;
  productName: string;
  price: number | null;
  quantity: number | null;
  categoryName?: string;
  subcategoryName: string | null;
  subcategoryId?: number;
  address?: string;
  description?: string;
  images: ProductImage[];
  event: EventData | {};
  tickets: any[];
  accommodation: AccommodationData | {};
  reservation: ReservationData | {};
  carRental: CarRentalData | {};
  food: FoodData | {}; // Food product data
  hotel: any; // Hotel data (alternative accommodation)
  rooms: any[]; // Room data
}

export interface ProductListResponse {
  responseCode: number;
  responseMessage: string;
  data: ApiProduct[];
}

export interface TicketCreateRequest {
  productId: number;
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

// Update request interfaces
export interface ReservationUpdateRequest {
  productId: number;
  subcategoryId: number;
  productName: string;
  categoryName: string;
  description: string;
  address: string;
  productType: string;
  serviceType: string;
  cuisineType: string[];
  operatingHours: number;
  tableCapacity: number;
  reservationFee: number;
  reservationDuration: number;
  acceptsWalkIns: boolean;
  dressCode: string;
  availableStartDate: string;
  availableEndDate: string;
  specialFeatures: string[];
}

export interface HotelUpdateRequest {
  productId: number;
  subcategoryId: number;
  productName: string;
  categoryName: string;
  description: string;
  address: string;
  price: number;
  checkInTime: string;
  checkOutTime: string;
  propertyAmenities: string;
  cancellationPolicy: string;
  availableStartDate: string;
  availableEndDate: string;
  roomTypeName: string;
  dailyRate: number;
  capacity: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string;
}

export interface EventUpdateRequest {
  productId: number;
  productName: string;
  categoryName: string;
  subcategoryId: number;
  price: number;
  address: string;
  quantity: number;
  description: string;
  eventDate: string;
  eventEndDate: string;
  eventTime: string;
  eventEndTime: string;
  venue: string;
  maxAttendees: number;
  dressCode: string;
  ageRestriction: string;
  ticketId?: number;
  ticketPrice?: number;
  ticketQuantity?: number;
  ticketDescription?: string;
}

export interface CarUpdateRequest {
  productId: number;
  productName: string;
  categoryName: string;
  subcategoryId: number;
  description: string;
  address: string;
  price: number;
  carMake: string;
  carModel: string;
  carYear: number;
  licensePlate: string;
  carType: string;
  seats: number;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  hasDriver: boolean;
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
  termsAndConditions: string;
  addons: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

export interface AccommodationUpdateRequest {
  productId: number;
  propertyType: string;
  listingType: string;
  subcategoryId: number;
  description: string;
  address: string;
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
  checkInTime: string;
  checkOutTime: string;
  houseRules: string[];
  availableStartDate: string;
  availableEndDate: string;
  cancellationPolicy: string;
}

export interface FoodUpdateRequest {
  productId: number;
  productName: string;
  categoryName: string;
  subcategoryId: number;
  description: string;
  address: string;
  price: number;
  stockQuantity: number;
  foodCategory: string;
  dietaryInfo: string[];
  spiceLevel: string;
  ingredients: string[];
  allergens: string[];
  preparationTime: number;
  servingSize: string;
  availableForDelivery: boolean;
  availableForPickup: boolean;
  deliveryFee: number;
  minimumOrderForDelivery: number;
  operatingHours: number;
  acceptsWalkIns: boolean;
}

export interface EventUpdateRequest {
  productId: number;
  subcategoryId: number;
  productName: string;
  description: string;
  address: string;
  price: number;
  eventDate: string;
  eventTime: string;
  eventEndDate: string;
  eventEndTime: string;
  eventType: string;
  venue: string;
  maxAttendees: number;
  ageRestriction: string;
  dressCode: string;
}

// Base URL for the API
const BASE_URL = 'http://45.33.68.176:9091';

// Function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/images/icon-gallery-add.svg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Function to get primary image URL
export const getPrimaryImageUrl = (images: ProductImage[]): string => {
  if (!images || images.length === 0) return '/images/icon-gallery-add.svg';
  
  const primaryImage = images.find(img => img.isPrimary);
  const firstImage = images[0];
  const imageToUse = primaryImage || firstImage;
  
  return getImageUrl(imageToUse.imageUrl);
};

// Function to determine product type based on which nested object has the most meaningful data
export const getProductType = (product: ApiProduct): 'product' | 'event' | 'accommodation' | 'hotel' | 'reservation' | 'car' | 'food' => {
  console.log(`\n🔍 Analyzing Product: ${product.productName} (ID: ${product.productId})`);
  console.log(`📋 CategoryName: ${product.categoryName || 'Not provided'}`);
  
  // Helper function to count meaningful fields in an object
  const countMeaningfulFields = (obj: any): number => {
    if (!obj || Object.keys(obj).length === 0) return 0;

    return Object.entries(obj).filter(([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ).length;
  };

  // Count meaningful fields in each object
  const eventFields = countMeaningfulFields(product.event);
  const accommodationFields = countMeaningfulFields(product.accommodation);
  const hotelFields = countMeaningfulFields(product.hotel);
  const reservationFields = countMeaningfulFields(product.reservation);
  const carFields = countMeaningfulFields(product.carRental);
  const foodFields = countMeaningfulFields(product.food);

  console.log(`📊 Field counts:`, {
    event: eventFields,
    accommodation: accommodationFields,
    hotel: hotelFields,
    reservation: reservationFields,
    car: carFields,
    food: foodFields
  });

  // Find the object with the most meaningful fields
  const maxFields = Math.max(eventFields, accommodationFields, hotelFields, reservationFields, carFields, foodFields);
  
  if (maxFields === 0) {
    // No meaningful data in any object, use categoryName fallback
    console.log(`🔄 No meaningful data found, using categoryName fallback`);
    switch (product.categoryName?.toUpperCase()) {
      case 'CARS':
        console.log(`✅ DETECTED: CAR (via categoryName)`);
        return 'car';
      case 'EVENTS':
        console.log(`✅ DETECTED: EVENT (via categoryName)`);
        return 'event';
      case 'HOTEL':
      case 'HOTELS':
        console.log(`✅ DETECTED: HOTEL (via categoryName)`);
        return 'hotel';
      case 'HOSPITALITY':
      case 'APARTMENT':
      case 'DUPLEX':
        console.log(`✅ DETECTED: ACCOMMODATION (via categoryName)`);
        return 'accommodation';
      case 'RESERVATIONS':
        console.log(`✅ DETECTED: RESERVATION (via categoryName)`);
        return 'reservation';
      case 'RESTAURANT':
        console.log(`✅ DETECTED: FOOD (via categoryName)`);
        return 'food';
      default:
        console.log(`✅ DETECTED: PRODUCT (via categoryName fallback)`);
        return 'product';
    }
  }

  // Return the type with the most meaningful fields
  if (eventFields === maxFields) {
    console.log(`✅ DETECTED: EVENT (${eventFields} meaningful fields)`);
    return 'event';
  }
  if (accommodationFields === maxFields) {
    console.log(`✅ DETECTED: ACCOMMODATION (${accommodationFields} meaningful fields)`);
    return 'accommodation';
  }
  if (hotelFields === maxFields) {
    console.log(`✅ DETECTED: HOTEL (${hotelFields} meaningful fields)`);
    return 'hotel';
  }
  if (reservationFields === maxFields) {
    console.log(`✅ DETECTED: RESERVATION (${reservationFields} meaningful fields)`);
    return 'reservation';
  }
  if (carFields === maxFields) {
    console.log(`✅ DETECTED: CAR (${carFields} meaningful fields)`);
    return 'car';
  }
  if (foodFields === maxFields) {
    console.log(`✅ DETECTED: FOOD (${foodFields} meaningful fields)`);
    return 'food';
  }

  console.log(`✅ DETECTED: PRODUCT (default fallback)`);
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
  
  if (type === 'hotel' && Object.keys(product.hotel).length > 0) {
    const hotel = product.hotel as any;
    return hotel.productName || product.productName || 'Unnamed Hotel';
  }
  
  if (type === 'food' && Object.keys(product.food).length > 0) {
    const food = product.food as FoodData;
    return food.productName || product.productName || 'Unnamed Food Item';
  }
  
  return product.productName || 'Unnamed Product';
};

// Function to get SKU based on product type and ID
export const getProductSku = (product: ApiProduct): string => {
  const type = getProductType(product);
  const prefix = type === 'event' ? 'EVT' : 
                 type === 'accommodation' ? 'ACC' : 
                 type === 'hotel' ? 'HTL' :
                 type === 'reservation' ? 'RES' : 
                 type === 'car' ? 'CAR' : 
                 type === 'food' ? 'FOD' : 'PRD';
  return `${prefix}${product.productId.toString().padStart(3, '0')}`;
};

// Function to map business type to expected product types
const getExpectedProductTypes = (businessType: string): string[] => {
  switch (businessType?.toUpperCase()) {
    case 'EVENTS':
    case 'EXPERIENCES':
    case 'TOUR_GUIDE':
    case 'INFLUENCER':
      return ['event'];
    case 'HOTEL':
    case 'HOTELS':
      return ['hotel'];
    case 'HOSPITALITY':
    case 'APARTMENT':
      return ['accommodation'];
    case 'CLUB':
    case 'RESERVATIONS':
      return ['reservation'];
    case 'CARS':
      return ['car'];
    case 'FASHION':
      return ['product']; // Fashion products are general products
    case 'RESTAURANT':
      return ['food'];
    case 'SUPERMARKET':
    case 'PHARMACY':
    case 'OTHERS':
      return ['product'];
    default:
      return ['product'];
  }
};

// Function to filter products based on business type
const filterProductsByBusinessType = (products: ApiProduct[], businessType: string): ApiProduct[] => {
  if (!businessType) {
    console.log('No business type provided, returning all products');
    return products;
  }

  const expectedTypes = getExpectedProductTypes(businessType);
  console.log(`Filtering products for business type: ${businessType}, expected types:`, expectedTypes);

  const filteredProducts = products.filter(product => {
    const productType = getProductType(product);
    const matches = expectedTypes.includes(productType);
    
    console.log(`Product "${product.productName}" (ID: ${product.productId}) - Detected type: ${productType}, Expected: ${expectedTypes.join(', ')}, Matches: ${matches}`);
    
    return matches;
  });

  console.log(`Filtered ${products.length} products down to ${filteredProducts.length} for business type: ${businessType}`);
  return filteredProducts;
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
    
    console.log(`Fetched products for vendor ${vendorId}:`, {
      totalProducts: data.data.length,
      businessType
    });

    // Filter products based on business type
    if (businessType) {
      data.data = filterProductsByBusinessType(data.data, businessType);
      console.log(`After filtering for business type "${businessType}":`, {
        filteredProducts: data.data.length
      });
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

// Function to fetch a single product by ID
export const fetchProductById = async (productId: number, vendorId: number): Promise<ApiProduct> => {
  console.log('🚀 === CLIENT: FETCH PRODUCT REQUEST ===');
  console.log('🚀 Product ID:', productId);
  console.log('🚀 Vendor ID:', vendorId);
  console.log('🚀 API URL:', `/api/v1/product/${productId}?vendorId=${vendorId}`);
  console.log('🚀 Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');

  try {
    console.log('🔄 About to call fetch...');

    const response = await fetch(`/api/v1/product/${productId}?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    console.log('📡 === CLIENT: API RESPONSE ===');
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    console.log('📡 Response URL:', response.url);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log('❌ Response not OK, trying to parse error...');
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error response data:', errorData);

      if (response.status === 404) {
        throw new Error(errorData.responseMessage || 'Product not found');
      }

      throw new Error(errorData.responseMessage || `HTTP error! status: ${response.status}`);
    }

    console.log('✅ Response OK, parsing JSON...');
    const data = await response.json();
    console.log('📦 === CLIENT: RESPONSE DATA ===');
    console.log(JSON.stringify(data, null, 2));

    // The API returns the product in data array, so we take the first item
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log('✅ Product found in data array');
      console.log('✅ Product details:', JSON.stringify(data.data[0], null, 2));
      return data.data[0];
    }

    console.log('❌ Product not found in expected format');
    throw new Error('Product not found');
  } catch (error) {
    console.error('❌ === FETCH ERROR ===');
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    console.error('❌ Full error:', error);
    throw error;
  }
};

// Function to update a reservation product
export const updateReservationProduct = async (productData: ReservationUpdateRequest, token: string): Promise<any> => {
  try {
    const response = await fetch('/api/v1/product/update/reservation', {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating reservation product:', error);
    throw error;
  }
};

// Function to update a hotel product
export const updateHotelProduct = async (productData: HotelUpdateRequest, token: string): Promise<any> => {
  try {
    const response = await fetch('/api/v1/product/update/hotel', {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating hotel product:', error);
    throw error;
  }
};

// Function to update a food product
export const updateFoodProduct = async (productData: FoodUpdateRequest, token: string): Promise<any> => {
  try {
    const response = await fetch('/api/v1/product/update/food', {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating food product:', error);
    throw error;
  }
};

// Function to update a car product
export const updateCarProduct = async (productData: CarUpdateRequest, token: string): Promise<any> => {
  try {
    const response = await fetch('/api/v1/product/update/car', {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating car product:', error);
    throw error;
  }
};

// Function to update an event product
export const updateEventProduct = async (productData: EventUpdateRequest, token: string): Promise<any> => {
  try {
    const response = await fetch('/api/v1/product/update/event', {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating event product:', error);
    throw error;
  }
};

// Function to update an accommodation product
export const updateAccommodationProduct = async (productData: AccommodationUpdateRequest, token: string): Promise<any> => {
  try {
    const response = await fetch('/api/v1/product/update/accomodation', {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating accommodation product:', error);
    throw error;
  }
};

// Note: Food and Event update functions will be added when endpoints are provided