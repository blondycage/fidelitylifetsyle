// Subcategory Service for managing subcategories

export interface SubcategoryItem {
  subcategoryId: number;
  vendorId: number;
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
 * Fetch subcategories for a vendor by category name
 */
export const getSubcategories = async (categoryName: string, vendorId: number): Promise<SubcategoryItem[]> => {
  try {
    // Check cache first
    if (subcategoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 Using cached subcategories');
      // Filter cached subcategories by vendorId
      return subcategoriesCache.filter(sub => sub.vendorId === vendorId);
    }

    console.log('🌐 Fetching subcategories from backend...', { categoryName, vendorId });
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/v1/product/subcategory/list?categoryName=${categoryName}`, {
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
      // Filter subcategories by vendorId
      const vendorSubcategories = data.data.filter(sub => sub.vendorId === vendorId);
      
      // Cache all subcategories (not just vendor-specific ones)
      subcategoriesCache = data.data;
      cacheTimestamp = Date.now();
      console.log('✅ Subcategories cached successfully:', data.data);
      console.log('🎯 Vendor-specific subcategories:', vendorSubcategories);
      return vendorSubcategories;
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