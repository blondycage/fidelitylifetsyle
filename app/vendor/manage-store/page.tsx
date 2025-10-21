'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Edit, Trash, ShoppingCart, CloseCircle, TickCircle, Warning2 } from 'iconsax-react';
import { UpdatePricesModal } from '@/components/vendor/modals/UpdatePricesModal';
import { useVendor } from '@/contexts/VendorContext';
import { 
  fetchVendorProducts, 
  getPrimaryImageUrl, 
  getImageUrl,
  getProductStatus, 
  getDisplayName, 
  getProductSku,
  getProductType,
  ApiProduct 
} from '@/services/productService';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'Available' | 'Unavailable';
  image: string;
  type: 'product' | 'event' | 'accommodation' | 'hotel' | 'reservation' | 'car' | 'food';
  categoryName?: string;
  subcategoryName: string;
  description?: string;
  images?: string[];
  // Food-specific fields
  foodCategory?: string;
  dietaryInfo?: string[];
  spiceLevel?: string;
  ingredients?: string[];
  allergens?: string[];
  preparationTime?: number;
  servingSize?: string;
  availableForDelivery?: boolean;
  availableForPickup?: boolean;
  deliveryFee?: number;
  minimumOrderForDelivery?: number;
  operatingHours?: string;
  acceptsWalkIns?: boolean;
}

const ManageStore = () => {
  const router = useRouter();
  const { vendorData, loading: vendorLoading } = useVendor();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showUpdatePricesModal, setShowUpdatePricesModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Unavailable'>('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get expected product types for display
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

  // Fetch products from API
  const fetchProducts = async () => {
    if (!vendorData?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetchVendorProducts(vendorData.id, token, vendorData.businessType);
      
      if (response.responseCode === 200) {
        // Get expected product types for this business type
        const expectedTypes = getExpectedProductTypes(vendorData.businessType);
        console.log(`\n🎯 VENDOR BUSINESS TYPE: ${vendorData.businessType}`);
        console.log(`📋 EXPECTED PRODUCT TYPES:`, expectedTypes);
        console.log(`📊 TOTAL PRODUCTS FROM API:`, response.data?.length || 0);
        
        // Check if data exists and is an array
        const productsData = response.data || [];
        const transformedProducts: Product[] = productsData
          .map((apiProduct: ApiProduct) => {
          try {
            return {
              id: apiProduct.productId.toString(),
              name: (() => {
                try {
                  return getDisplayName(apiProduct);
                } catch (error) {
                  console.error('Error getting display name:', error);
                  return apiProduct.productName || 'Unknown Product';
                }
              })(),
              sku: (() => {
                try {
                  return getProductSku(apiProduct);
                } catch (error) {
                  console.error('Error getting product SKU:', error);
                  return `SKU-${apiProduct.productId}`;
                }
              })(),
              price: apiProduct.price || 0,
              stock: apiProduct.quantity || 0,
              status: getProductStatus(apiProduct.quantity || 0),
              image: (() => {
                try {
                  return Array.isArray(apiProduct.images) ? getPrimaryImageUrl(apiProduct.images) : '/images/icon-gallery-add.svg';
                } catch (error) {
                  console.error('Error getting primary image:', error);
                  return '/images/icon-gallery-add.svg';
                }
              })(),
              type: (() => {
                try {
                  return getProductType(apiProduct);
                } catch (error) {
                  console.error('Error getting product type:', error);
                  return 'product' as const;
                }
              })(),
              categoryName: apiProduct.categoryName,
              subcategoryName: apiProduct.subcategoryName || '',
              description: apiProduct.description || '',
              images: (() => {
                try {
                  return Array.isArray(apiProduct.images) ? apiProduct.images.map(img => getImageUrl(img.imageUrl)) : [];
                } catch (error) {
                  console.error('Error processing images:', error);
                  return [];
                }
              })()
            };
          } catch (error) {
            console.error('Error processing product:', apiProduct, error);
            return {
              id: apiProduct.productId.toString(),
              name: apiProduct.productName || 'Unknown Product',
              sku: `SKU-${apiProduct.productId}`,
              price: apiProduct.price || 0,
              stock: apiProduct.quantity || 0,
              status: 'Available' as const,
              image: '/images/icon-gallery-add.svg',
              type: 'product' as const,
              categoryName: apiProduct.categoryName,
              subcategoryName: apiProduct.subcategoryName || '',
              description: apiProduct.description || '',
              images: []
            };
          }
        })
        
        console.log(`\n📈 FILTERING RESULTS:`);
        console.log(`✅ FILTERED PRODUCTS COUNT:`, transformedProducts.length);
        console.log(`📋 FINAL PRODUCTS:`, transformedProducts.map(p => `${p.name} (${p.type})`));
        setProducts(transformedProducts);
        
        // Store products in sessionStorage for access by detail page
        sessionStorage.setItem('vendorProducts', JSON.stringify(transformedProducts));
      } else {
        throw new Error(response.responseMessage || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
     // setError(err instanceof Error ? err.message : 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when vendor data is available
  useEffect(() => {
    if (vendorData?.id && !vendorLoading) {
      fetchProducts();
    }
  }, [vendorData?.id, vendorLoading]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts((filteredProducts || []).map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleEnableProducts = () => {
    setProducts(prev =>
      (prev || []).map(p =>
        selectedProducts.includes(p.id) ? { ...p, status: 'Available' } : p
      )
    );
    toast.success(`${selectedProducts.length} product(s) enabled`);
    setSelectedProducts([]);
  };

  const handleDisableProducts = () => {
    setProducts(prev =>
      (prev || []).map(p =>
        selectedProducts.includes(p.id) ? { ...p, status: 'Unavailable' } : p
      )
    );
    toast.success(`${selectedProducts.length} product(s) disabled`);
    setSelectedProducts([]);
  };

  const handleUpdatePrices = (updateType: 'percentage' | 'fixed' | 'new', value: number) => {
    setProducts(prev =>
      (prev || []).map(p => {
        if (!selectedProducts.includes(p.id)) return p;

        let newPrice = p.price;
        if (updateType === 'percentage') {
          newPrice = p.price + (p.price * value / 100);
        } else if (updateType === 'fixed') {
          newPrice = p.price + value;
        } else if (updateType === 'new') {
          newPrice = value;
        }

        return { ...p, price: Math.round(newPrice) };
      })
    );
    toast.success(`Prices updated for ${selectedProducts.length} product(s)`);
    setSelectedProducts([]);
    setShowUpdatePricesModal(false);
  };

  const handleExport = () => {
    const productsList = products || [];
    const selectedData = productsList.filter(p => selectedProducts.includes(p.id));
    const csv = [
      ['Product Name', 'SKU', 'Price', 'Stock', 'Status'],
      ...selectedData.map(p => [p.name, p.sku, p.price, p.stock, p.status])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    toast.success('Products exported successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/v1/product/delete/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.responseCode === 200) {
        setProducts(prev => prev.filter(p => p.id !== productToDelete));
        setSelectedProducts(prev => prev.filter(id => id !== productToDelete));
        toast.success(data.responseMessage || 'Product deleted successfully');
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        toast.error(data.responseMessage || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = (products || []).filter(p => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const stats = {
    total: products?.length || 0,
    inactive: products?.filter(p => p.status === 'Unavailable').length || 0,
    active: products?.filter(p => p.status === 'Available').length || 0,
    outOfStock: products?.filter(p => p.stock === 0).length || 0,
    lowStock: products?.filter(p => p.stock > 0 && p.stock < 50).length || 0,
  };

  // Loading state
  if (loading || vendorLoading) {
    return (
      <DashboardLayout 
        pageTitle="Manage Store"
        pageDescription="Create, edit, delete products and manage inventory"
      >
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#6CC049] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading products...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout 
        pageTitle="Manage Store"
        pageDescription="Create, edit, delete products and manage inventory"
      >
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <CloseCircle size={48} color="currentColor" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-[#6CC049] text-white rounded-lg hover:bg-[#5AA03A] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      pageTitle="Manage Store"
      pageDescription="Create, edit, delete products and manage inventory"
    >
      <div className="p-6 lg:p-8">
        {/* Business Type Indicator */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#6CC049] to-[#4CAF50] rounded-lg p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {vendorData?.businessType === 'APARTMENT' ? 'Apartment' :
                   vendorData?.businessType === 'HOSPITALITY' ? 'Hospitality' :
                   vendorData?.businessType === 'TOUR_GUIDE' ? 'Tour Guide' :
                   vendorData?.businessType === 'EXPERIENCES' ? 'Experiences' :
                   vendorData?.businessType === 'RESERVATIONS' ? 'Reservations' :
                   vendorData?.businessType?.charAt(0).toUpperCase() + vendorData?.businessType?.slice(1).toLowerCase() || 'Business'} Products
                </h3>
                <p className="text-sm opacity-90">
                  Showing {getExpectedProductTypes(vendorData?.businessType || '').join(', ')} products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Statistics */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[var(--blueHex)] mb-4">Product Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={20} color="var(--blueHex)" variant="Bold" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <CloseCircle size={20} color="#6B7280" variant="Bold" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Inactive Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TickCircle size={20} color="var(--greenHex)" variant="Bold" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <CloseCircle size={20} color="#374151" variant="Bold" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Warning2 size={20} color="#F97316" variant="Bold" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg p-4 mb-4">
          {/* Selected products info */}
          <div className="text-sm text-gray-600 mb-3 sm:mb-0">
            {selectedProducts.length > 0 && `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`}
          </div>
          
          {/* Action buttons - responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-end">
            {/* Bulk action buttons - only show when products are selected */}
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleEnableProducts}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enable
                </button>
                <button
                  onClick={handleDisableProducts}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Disable
                </button>
                <button
                  onClick={() => setShowUpdatePricesModal(true)}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Prices
                </button>
                <button
                  onClick={handleExport}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
              </div>
            )}
            
              {/* Create Product button - always visible */}
              <button
                onClick={() => router.push('/vendor/manage-store/create-product')}
                className="px-6 py-3 bg-[var(--greenHex)] text-white rounded-full text-sm font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="text-xl">+</span>
                Create Product
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="px-6 py-3 bg-gradient-to-r from-[#6CC049]/5 to-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#6CC049] rounded-full"></div>
              <p className="text-sm text-gray-700 font-medium">
                Click on any product row to view and edit details
              </p>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Image</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Product Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SKU</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 hover:border-[#6CC049]/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => router.push(`/vendor/manage-store/update-product/${product.id}?vendorId=${vendorData?.id || ''}`)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/icon-gallery-add.svg';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 group-hover:text-[#6CC049] transition-colors">
                    <div className="flex items-center justify-between">
                      <span>{product.name}</span>
                      <svg 
                        className="w-4 h-4 text-gray-400 group-hover:text-[#6CC049] transition-colors opacity-0 group-hover:opacity-100" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.type === 'event' ? 'bg-purple-100 text-purple-600' :
                      product.type === 'accommodation' ? 'bg-blue-100 text-blue-600' :
                      product.type === 'reservation' ? 'bg-orange-100 text-orange-600' :
                      product.type === 'car' ? 'bg-green-100 text-green-600' :
                      product.type === 'food' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">₦{(product.price || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Available'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        product.status === 'Available' ? 'bg-green-600' : 'bg-gray-600'
                      }`}></span>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/vendor/manage-store/update-product/${product.id}?vendorId=${vendorData?.id || ''}`)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit product"
                      >
                        <Edit size={20} color="currentColor" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash size={20} color="currentColor" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-[16px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {error 
                  ? 'There was an error loading your products. Please try again.'
                  : 'You haven\'t created any products yet. Start by adding your first product to showcase your offerings.'
                }
              </p>
              <div className="flex gap-3">
                {error ? (
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-3 bg-[#6CC049] text-white rounded-lg font-medium hover:bg-[#5AAE3A] transition-colors"
                  >
                    Try Again
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/vendor/manage-store/create-product')}
                    className="px-6 py-3 bg-[#6CC049] text-white rounded-lg font-medium hover:bg-[#5AAE3A] transition-colors"
                  >
                    Create Your First Product
                  </button>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Update Prices Modal */}
        <UpdatePricesModal
          isOpen={showUpdatePricesModal}
          onClose={() => setShowUpdatePricesModal(false)}
          onApply={handleUpdatePrices}
          selectedCount={selectedProducts.length}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[12px] w-full max-w-[400px] p-6">
              <h3 className="text-xl font-bold text-[#212121] mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-[8px] font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 h-12 bg-red-500 text-white rounded-[8px] font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      
    </DashboardLayout>
  );
};

export default ManageStore;
