// Category service for fetching business categories from backend
export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoryListResponse {
  responseCode: number;
  responseMessage: string;
  data: string[];
}

// Cache for categories to avoid repeated API calls
let categoriesCache: Category[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to format category names for display
const formatCategoryName = (categoryName: string): string => {
  return categoryName
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};


// Get categories with fallback to hardcoded list
export const getCategories = async (): Promise<Category[]> => {
  try {
    // Check if we have valid cached data
    if (categoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 Using cached categories');
      return categoriesCache;
    }

    console.log('🌐 Fetching categories from backend...');
    
    const response = await fetch('/api/v1/product/category/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 API Response status:', response.status);
    const data: CategoryListResponse = await response.json();
    console.log('📄 API Response data:', data);
    
    if (data.responseCode === 200 && data.data && data.data.length > 0) {
      // Convert string array to Category objects
      const categoryObjects = data.data.map((categoryName) => ({
        id: categoryName,
        name: categoryName,
        description: formatCategoryName(categoryName)
      }));
      
      // Update cache
      categoriesCache = categoryObjects;
      cacheTimestamp = Date.now();
      console.log('✅ Categories cached successfully:', categoryObjects);
      return categoryObjects;
    }
    
    // Fallback to hardcoded categories if API fails
    console.warn('⚠️ Using fallback categories');
    return getFallbackCategories();
  } catch (error) {
    console.error('❌ Error getting categories:', error);
    return getFallbackCategories();
  }
};

// Fallback categories in case API is unavailable
const getFallbackCategories = (): Category[] => [
  { id: 'APARTMENT', name: 'APARTMENT', description: 'Apartment' },
  { id: 'CARS', name: 'CARS', description: 'Cars' },
  { id: 'CLUB', name: 'CLUB', description: 'Club' },
  { id: 'EVENTS', name: 'EVENTS', description: 'Events' },
  { id: 'EXPERIENCES', name: 'EXPERIENCES', description: 'Experiences' },
  { id: 'FASHION', name: 'FASHION', description: 'Fashion' },
  { id: 'HOSPITALITY', name: 'HOSPITALITY', description: 'Hospitality' },
  { id: 'HOTELS', name: 'HOTELS', description: 'Hotels' },
  { id: 'INFLUENCER', name: 'INFLUENCER', description: 'Influencer' },
  { id: 'OTHERS', name: 'OTHERS', description: 'Others' },
  { id: 'PHARMACY', name: 'PHARMACY', description: 'Pharmacy' },
  { id: 'RESERVATIONS', name: 'RESERVATIONS', description: 'Reservations' },
  { id: 'RESTAURANT', name: 'RESTAURANT', description: 'Restaurant' },
  { id: 'SUPERMARKET', name: 'SUPERMARKET', description: 'Supermarket' },
  { id: 'TOUR_GUIDE', name: 'TOUR_GUIDE', description: 'Tour Guide' },
  { id: 'TRAVEL', name: 'TRAVEL', description: 'Travel' },
];

// Clear cache (useful for testing or when categories might have changed)
export const clearCategoriesCache = () => {
  categoriesCache = null;
  cacheTimestamp = null;
  console.log('🗑️ Categories cache cleared');
};