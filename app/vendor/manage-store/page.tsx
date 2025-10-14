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
  type: 'product' | 'event' | 'accommodation' | 'reservation';
  categoryName?: string;
  subcategoryName: string;
  description?: string;
  images?: string[];
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

      const response = await fetchVendorProducts(vendorData.id, token);
      
      if (response.responseCode === 200) {
        const transformedProducts: Product[] = response.data.map((apiProduct: ApiProduct) => {
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
                  return Array.isArray(apiProduct.images) ? getPrimaryImageUrl(apiProduct.images) : '/placeholder-product.png';
                } catch (error) {
                  console.error('Error getting primary image:', error);
                  return '/placeholder-product.png';
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
              image: '/placeholder-product.png',
              type: 'product' as const,
              categoryName: apiProduct.categoryName,
              subcategoryName: apiProduct.subcategoryName || '',
              description: apiProduct.description || '',
              images: []
            };
          }
        });
        
        setProducts(transformedProducts);
        
        // Store products in sessionStorage for access by detail page
        sessionStorage.setItem('vendorProducts', JSON.stringify(transformedProducts));
      } else {
        throw new Error(response.responseMessage || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
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
      setSelectedProducts(filteredProducts.map(p => p.id));
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
      prev.map(p =>
        selectedProducts.includes(p.id) ? { ...p, status: 'Available' } : p
      )
    );
    toast.success(`${selectedProducts.length} product(s) enabled`);
    setSelectedProducts([]);
  };

  const handleDisableProducts = () => {
    setProducts(prev =>
      prev.map(p =>
        selectedProducts.includes(p.id) ? { ...p, status: 'Unavailable' } : p
      )
    );
    toast.success(`${selectedProducts.length} product(s) disabled`);
    setSelectedProducts([]);
  };

  const handleUpdatePrices = (updateType: 'percentage' | 'fixed' | 'new', value: number) => {
    setProducts(prev =>
      prev.map(p => {
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
    const selectedData = products.filter(p => selectedProducts.includes(p.id));
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

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setSelectedProducts(prev => prev.filter(id => id !== productToDelete));
      toast.success('Product deleted');
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(p => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const stats = {
    total: products.length,
    inactive: products.filter(p => p.status === 'Unavailable').length,
    active: products.filter(p => p.status === 'Available').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 50).length,
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
        {/* Header - Removed since it's now in DashboardLayout */}

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
        <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedProducts.length > 0 && `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEnableProducts}
              disabled={selectedProducts.length === 0}
              className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enable
            </button>
            <button
              onClick={handleDisableProducts}
              disabled={selectedProducts.length === 0}
              className="px-6 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disable
            </button>
            <button
              onClick={() => setShowUpdatePricesModal(true)}
              disabled={selectedProducts.length === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Prices
            </button>
            <button
              onClick={handleExport}
              disabled={selectedProducts.length === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export
            </button>
            <button
              onClick={() => router.push('/vendor/manage-store/create-product')}
              className="px-6 py-3 bg-[var(--greenHex)] text-white rounded-full text-sm font-medium hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Create Product
            </button>
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
                  onClick={() => router.push(`/vendor/manage-store/${product.id}`)}
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
                          target.src = '/placeholder-product.png';
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
                        onClick={() => router.push(`/vendor/manage-store/${product.id}`)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
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
      </div>
    </DashboardLayout>
  );
};

export default ManageStore;
