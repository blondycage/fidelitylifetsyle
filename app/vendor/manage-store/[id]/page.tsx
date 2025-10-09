'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowLeft, Edit, Trash, Export } from 'iconsax-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  sku: string;
  quantity: number;
  lowStockAlert: number;
  status: boolean;
  images: string[];
}

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    sku: '',
    quantity: '',
    lowStockAlert: '',
    status: true
  });

  // Load product data
  useEffect(() => {
    const loadProduct = () => {
      try {
        const saved = localStorage.getItem('storeProducts');
        if (saved) {
          const products = JSON.parse(saved);
          const foundProduct = products.find((p: any) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            setFormData({
              name: foundProduct.name || '',
              category: foundProduct.category || 'Hotels',
              description: foundProduct.description || '',
              price: foundProduct.price?.toString() || '',
              sku: foundProduct.sku || '',
              quantity: foundProduct.stock?.toString() || '',
              lowStockAlert: foundProduct.lowStockAlert?.toString() || '',
              status: foundProduct.status === 'Available'
            });
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!product) return;

    setIsSaving(true);
    try {
      const saved = localStorage.getItem('storeProducts');
      if (saved) {
        const products = JSON.parse(saved);
        const updatedProducts = products.map((p: any) => 
          p.id === productId 
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: parseFloat(formData.price),
                sku: formData.sku,
                stock: parseInt(formData.quantity),
                lowStockAlert: parseInt(formData.lowStockAlert),
                status: formData.status ? 'Available' : 'Unavailable'
              }
            : p
        );
        localStorage.setItem('storeProducts', JSON.stringify(updatedProducts));
        toast.success('Product updated successfully');
        router.push('/vendor/manage-store');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!product) return;

    try {
      const saved = localStorage.getItem('storeProducts');
      if (saved) {
        const products = JSON.parse(saved);
        const updatedProducts = products.filter((p: any) => p.id !== productId);
        localStorage.setItem('storeProducts', JSON.stringify(updatedProducts));
        toast.success('Product deleted successfully');
        router.push('/vendor/manage-store');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Edit Product" pageDescription="Loading product details...">
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#6CC049] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout pageTitle="Edit Product" pageDescription="Product not found">
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Product not found</p>
            <button
              onClick={() => router.push('/vendor/manage-store')}
              className="px-6 py-2 bg-[#6CC049] text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Back to Store
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Edit Product" pageDescription="Adjust details, images, and pricing for this product">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.push('/vendor/manage-store')}
              className="p-2 text-black hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors bg-white"
            >
              <ArrowLeft size={24} color="black" />
            </button>
          </div>
          <h1 className="text-4xl font-bold text-black">Edit Product</h1>
          <p className="text-gray-600 mt-2">Adjust details, images, and pricing for this product</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Details */}
          <div className="space-y-2">
            {/* Product Details Card */}
            <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
              <h2 className="text-2xl font-bold text-[#212121] mb-8">Product Details</h2>
              
              <div className="space-y-6">
                {/* Product Name */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full h-12 px-4 bg-[#EEEEEE] border border-black rounded-[8px] text-[16px] font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="John Doe"
                  />
                </div>

                {/* Category */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full h-12 px-4 bg-[#EEEEEE] border border-black rounded-[8px] text-[16px] font-urbanist text-black focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
                    >
                      <option value="Hotels">Hotels</option>
                      <option value="Restaurants">Restaurants</option>
                      <option value="Events">Events</option>
                      <option value="Shopping">Shopping</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2.22 5.47L8 11.25L13.78 5.47" stroke="#616161" strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#EEEEEE] border border-black rounded-[8px] text-[16px] font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
                    placeholder="Lorem ipsum"
                  />
                </div>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[16px] font-normal text-[#616161]">Status:</label>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleInputChange('status', !formData.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.status ? 'bg-[#6CC049]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.status ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Inventory */}
          <div className="space-y-6">
            {/* Pricing & Inventory Card */}
            <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
              <h2 className="text-2xl font-bold text-[#212121] mb-8">Pricing & Inventory</h2>
              
              <div className="space-y-6">
                {/* Price */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full h-12 px-4 bg-[#EEEEEE] border border-black rounded-[8px] text-[16px] font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="N250.00"
                  />
                </div>

                {/* SKU */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full h-12 px-4 bg-[#EEEEEE] border border-black rounded-[8px] text-[16px] font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="10234"
                  />
                </div>

                {/* Quantity */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full h-12 px-4 bg-[#EEEEEE] border border-black rounded-[8px] text-[16px] font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="20"
                  />
                </div>

                {/* Low Stock Alert */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Low Stock Alert <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockAlert}
                    onChange={(e) => handleInputChange('lowStockAlert', e.target.value)}
                    className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[16px] font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    placeholder="Enter low stock threshold"
                  />
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#212121]">Images</h2>
                <button className="text-[16px] font-normal text-[#212121] hover:text-[#6CC049] transition-colors">
                  Upload new image
                </button>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 bg-[#D9D9D9] rounded-[8px] flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Image {index}</span>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-[8px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <Edit size={16} color="#616161" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <Trash size={16} color="#FF383C" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-[#616161] hover:text-[#6CC049] transition-colors">
                <Export size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 h-[52px] border-2 border-red-500 text-red-500 rounded-[60px] text-[20px] font-semibold font-urbanist hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            Delete Product
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-[52px] bg-[#6CC049] text-white rounded-[60px] text-[20px] font-semibold font-urbanist hover:bg-[#5AA83A] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

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
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-[8px] font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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

export default EditProductPage;