// Subcategory Service for managing subcategories

export interface SubcategoryItem {
  subcategoryId: number;
  subcategoryName: string;
}

export interface SubcategoryResponse {
  responseCode: number;
  responseMessage: string;
  data: SubcategoryItem[];
}

// Cache for subcategories
let subcategoriesCache: SubcategoryItem[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Create a new subcategory
 */
export const createSubcategory = async (vendorId: number, subcategoryName: string): Promise<SubcategoryResponse> => {
  try {
    console.log('🌐 Creating subcategory:', { vendorId, subcategoryName });
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/v1/product/subcategory/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendorId: vendorId,
        subcategoryName: subcategoryName
      }),
    });

    console.log('📡 Create Subcategory API Response status:', response.status);
    const data: SubcategoryResponse = await response.json();
    console.log('📄 Create Subcategory API Response data:', data);

    // Clear cache when new subcategory is created
    if (data.responseCode === 200) {
      subcategoriesCache = null;
      cacheTimestamp = null;
    }

    return data;
  } catch (error) {
    console.error('❌ Error creating subcategory:', error);
    return {
      responseCode: 500,
      responseMessage: 'Failed to create subcategory',
      data: null
    };
  }
};

/**
 * Fetch subcategories for a vendor by vendor ID
 */
export const getSubcategories = async (vendorId: number): Promise<SubcategoryItem[]> => {
  try {
    // Check cache first
    if (subcategoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 Using cached subcategories');
      return subcategoriesCache;
    }

    console.log('🌐 Fetching subcategories from backend...', { vendorId });
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/v1/product/subcategory/vendor?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
    });

    console.log('📡 Fetch Subcategories API Response status:', response.status);
    const data: SubcategoryResponse = await response.json();
    console.log('📄 Fetch Subcategories API Response data:', data);

    if (data.responseCode === 200 && data.data && data.data.length > 0) {
      // Cache the subcategories
      subcategoriesCache = data.data;
      cacheTimestamp = Date.now();
      console.log('✅ Subcategories cached successfully:', data.data);
      return data.data;
    }

    console.warn('⚠️ No subcategories found or error occurred');
    return [];
  } catch (error) {
    console.error('❌ Error fetching subcategories:', error);
    return [];
  }
};

/**
 * Clear subcategories cache
 */
export const clearSubcategoriesCache = () => {
  subcategoriesCache = null;
  cacheTimestamp = null;
  console.log('🗑️ Subcategories cache cleared');
};