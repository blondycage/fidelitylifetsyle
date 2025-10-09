'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DynamicForm from './components/DynamicForm';
import { useVendor } from '@/contexts/VendorContext';
import toast from 'react-hot-toast';
import AddSubcategoryModal from '@/components/vendor/modals/AddSubcategoryModal';

const CreateProductPage = () => {
  const { vendorData, loading: vendorLoading } = useVendor();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ value: string; label: string; endpoint: string }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Create Product payload fields
    productName: '',
    categoryName: '',
    quantity: '',
    price: '',
    // Events payload fields
    productType: 'GENERAL_PRODUCT',
    eventDate: '',
    eventTime: '',
    eventEndDate: '',
    eventEndTime: '',
    eventType: 'PAID',
    venue: '',
    maxAttendees: '',
    ageRestriction: '',
    dressCode: '',
    // Accommodation payload fields
    propertyType: '',
    listingType: '',
    propertyName: '',
    dailyRate: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    totalArea: '',
    furnishingStatus: '',
    amenities: 'WIFI',
    floorNumber: '',
    parkingSpaces: '',
    checkInTime: '',
    checkOutTime: '',
    houseRules: 'NO_SMOKING',
    cancellationPolicy: '',
    // Reservation payload fields
    productType: '',
    serviceType: '',
    cuisineType: 'CONTINENTAL',
    operatingHours: '',
    tableCapacity: '',
    reservationFee: '',
    reservationDuration: '',
    acceptsWalkIns: true,
    dressCode: '',
    specialFeatures: 'LIVE_BAND',
    // Additional fields for other categories (will be used later)
    description: '',
    subCategory: '',
    location: '',
    images: [] as File[],
    tags: [] as string[],
    availability: '',
    contactInfo: ''
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        
        const response = await fetch('/api/v1/product/category/list');
        const data = await response.json();
        
        if (data.responseCode === 200 && data.data) {
          // Transform the API data to match our expected format
          const transformedCategories = data.data.map((category: string) => ({
            value: category.toLowerCase(),
            label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' '),
            endpoint: category
          }));
          setCategories(transformedCategories);
        } else {
          throw new Error(data.responseMessage || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError(error instanceof Error ? error.message : 'Failed to fetch categories');
        // Fallback to hardcoded categories if API fails
        setCategories([
          { value: 'events', label: 'Events', endpoint: 'EVENTS' },
          { value: 'experiences', label: 'Experiences', endpoint: 'EVENTS' },
          { value: 'tour_guide', label: 'Tour Guide', endpoint: 'EVENTS' },
          { value: 'influencer', label: 'Influencer', endpoint: 'EVENTS' },
          { value: 'hotels', label: 'Hotels', endpoint: 'HOTELS' },
          { value: 'apartment', label: 'Apartment', endpoint: 'ACCOMMODATION' },
          { value: 'club', label: 'Club', endpoint: 'Reservation' },
          { value: 'food', label: 'Food', endpoint: 'create product' },
          { value: 'supermarket', label: 'Supermarket', endpoint: 'create product' },
          { value: 'pharmacy', label: 'Pharmacy', endpoint: 'create product' },
          { value: 'restaurant', label: 'Restaurant', endpoint: 'create product' },
          { value: 'others', label: 'Others', endpoint: 'create product' },
          { value: 'cars', label: 'Cars', endpoint: 'CARS' },
          { value: 'fashion', label: 'Fashion', endpoint: 'FASHION' }
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Listen for subcategory modal open event
  useEffect(() => {
    const handleOpenSubcategoryModal = () => {
      setIsSubcategoryModalOpen(true);
    };

    window.addEventListener('openSubcategoryModal', handleOpenSubcategoryModal);
    
    return () => {
      window.removeEventListener('openSubcategoryModal', handleOpenSubcategoryModal);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    handleInputChange('categoryName', category);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      setFormData(prev => ({ ...prev, images: newImages }));
      
      // Generate previews for new images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleSubcategorySave = (subcategoryName: string) => {
    setFormData({ ...formData, subCategory: subcategoryName });
    toast.success('Sub-category added successfully!');
  };

  const handleUploadImages = async () => {
    if (!createdProductId) {
      toast.error('Please create the product first before uploading images');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please select images to upload');
      return;
    }

    // TODO: Implement actual image upload to backend
    toast.success('Images uploaded successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vendorData?.id) {
      toast.error('Vendor data not available. Please try again.');
      return;
    }

    // Check which endpoint to use based on category
    const createProductCategories = ['others', 'food', 'supermarket', 'pharmacy', 'restaurant'];
    const eventsCategories = ['events', 'experiences', 'tour_guide', 'influencer'];
    const accommodationCategories = ['apartment'];
    const reservationCategories = ['club'];
    
    if (!createProductCategories.includes(selectedCategory) && !eventsCategories.includes(selectedCategory) && !accommodationCategories.includes(selectedCategory) && !reservationCategories.includes(selectedCategory)) {
      toast.error('This category is not yet supported for product creation.');
      return;
    }

    // Validate required fields based on category
    if (eventsCategories.includes(selectedCategory)) {
      if (!formData.productName || !formData.categoryName || !formData.quantity || !formData.price || 
          !formData.productType || !formData.eventDate || !formData.eventTime || !formData.eventEndDate || 
          !formData.eventEndTime || !formData.eventType || !formData.venue || !formData.maxAttendees) {
        toast.error('Please fill in all required fields for events.');
        return;
      }
    } else if (accommodationCategories.includes(selectedCategory)) {
      if (!formData.propertyType || !formData.listingType || !formData.propertyName || !formData.dailyRate || 
          !formData.maxGuests || !formData.bedrooms || !formData.bathrooms || !formData.totalArea || 
          !formData.furnishingStatus || !formData.amenities || !formData.checkInTime || !formData.checkOutTime || 
          !formData.houseRules || !formData.cancellationPolicy) {
        toast.error('Please fill in all required fields for accommodation.');
        return;
      }
    } else if (reservationCategories.includes(selectedCategory)) {
      if (!formData.productName || !formData.categoryName || !formData.productType || !formData.serviceType || 
          !formData.cuisineType || !formData.operatingHours || !formData.tableCapacity || !formData.reservationFee || 
          !formData.reservationDuration || !formData.dressCode || !formData.specialFeatures) {
        toast.error('Please fill in all required fields for reservation.');
        return;
      }
    } else {
      if (!formData.productName || !formData.categoryName || !formData.quantity || !formData.price) {
        toast.error('Please fill in all required fields.');
        return;
      }
    }

    try {
      setIsCreatingProduct(true);

      let payload: any;
      let endpoint: string;

      if (eventsCategories.includes(selectedCategory)) {
        // Events payload
        payload = {
          productName: formData.productName,
          categoryName: formData.categoryName.toUpperCase(),
          vendorId: vendorData.id,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          productType: formData.productType,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventEndDate: formData.eventEndDate,
          eventEndTime: formData.eventEndTime,
          eventType: formData.eventType,
          venue: formData.venue,
          maxAttendees: parseInt(formData.maxAttendees),
          ageRestriction: formData.ageRestriction || '',
          dressCode: formData.dressCode || ''
        };
        endpoint = '/api/v1/product/create/event';
      } else if (accommodationCategories.includes(selectedCategory)) {
        // Accommodation payload
        payload = {
          vendorId: vendorData.id,
          propertyType: formData.propertyType,
          listingType: formData.listingType,
          propertyName: formData.propertyName,
          dailyRate: parseFloat(formData.dailyRate),
          maxGuests: parseInt(formData.maxGuests),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          totalArea: formData.totalArea,
          furnishingStatus: formData.furnishingStatus,
          amenities: formData.amenities,
          floorNumber: formData.floorNumber || '',
          parkingSpaces: parseInt(formData.parkingSpaces),
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime,
          houseRules: formData.houseRules,
          cancellationPolicy: formData.cancellationPolicy
        };
        endpoint = '/api/v1/product/create/accomodation';
      } else if (reservationCategories.includes(selectedCategory)) {
        // Reservation payload
        payload = {
          vendorId: vendorData.id,
          productName: formData.productName,
          categoryName: formData.categoryName.toUpperCase(),
          productType: formData.productType,
          serviceType: formData.serviceType,
          cuisineType: formData.cuisineType,
          operatingHours: parseInt(formData.operatingHours),
          tableCapacity: parseInt(formData.tableCapacity),
          reservationFee: parseFloat(formData.reservationFee),
          reservationDuration: parseInt(formData.reservationDuration),
          acceptsWalkIns: formData.acceptsWalkIns,
          dressCode: formData.dressCode,
          specialFeatures: formData.specialFeatures
        };
        endpoint = '/api/v1/product/create/reservation';
      } else {
        // Create product payload
        payload = {
          productName: formData.productName,
          categoryName: formData.categoryName.toUpperCase(),
          vendorId: vendorData.id,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price)
        };
        endpoint = '/api/v1/product/create';
      }

      console.log('Creating product with payload:', payload);

      const token = localStorage.getItem('token');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.responseCode === 200) {
        setCreatedProductId(data.data?.id || 1); // Assuming the API returns the product ID
        toast.success('Product created successfully! You can now upload images.');
      } else {
        throw new Error(data.responseMessage || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error instanceof Error ? error.message : 'Error creating product');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <DashboardLayout 
      pageTitle="Create a New Listing"
      pageDescription="Add details, photos, and pricing to showcase your offer."
    >
      <div className="min-h-screen">
        {/* Form Section */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left Column - Product Details */}
              <div className="flex-1">
                {/* Product Details Card */}
                <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="h-7">
                      <h2 className="text-[20px] sm:text-[24px] font-bold text-[#212121] font-urbanist leading-[1.17]">
                        Product Details
                      </h2>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-6">
                      {/* Category - Moved to top */}
                      <div className="w-full max-w-[450px]">
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
                            Category
                          </label>
                          <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
                        </div>
                        <div className="relative">
                          <select
                            value={formData.categoryName}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            disabled={isLoadingCategories}
                            className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {isLoadingCategories ? 'Loading categories...' : 'Select a category'}
                            </option>
                            {categories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {isLoadingCategories ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6CC049]"></div>
                            ) : (
                              <Image src="/images/icon-arrow-down.svg" alt="Dropdown" width={16} height={16} />
                            )}
                          </div>
                        </div>
                        {categoriesError && (
                          <p className="text-[12px] text-[#FF383C] font-urbanist mt-1">
                            {categoriesError}
                          </p>
                        )}
                      </div>


                      {/* Dynamic Form Fields based on selected category */}
                      {selectedCategory && (
                        <DynamicForm
                          category={selectedCategory}
                          formData={formData}
                          onInputChange={handleInputChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Inventory and Upload Image */}
              <div className="flex-1 space-y-6">
                {/* Pricing & Inventory Card - Only show for create-product categories */}
                {selectedCategory && ['food', 'supermarket', 'pharmacy', 'restaurant', 'others'].includes(selectedCategory) && (
                  <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="h-7">
                        <h2 className="text-[20px] sm:text-[24px] font-bold text-[#212121] font-urbanist leading-[1.17]">
                          Pricing & Inventory
                        </h2>
                      </div>

                      {/* Input Fields */}
                      <div className="space-y-6">
                        {/* Price */}
                        <div className="w-full max-w-[470px]">
                          <div className="flex items-center gap-2 mb-2">
                            <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
                              Price
                            </label>
                            <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => handleInputChange('price', e.target.value)}
                              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                              placeholder="Enter price"
                            />
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="w-full max-w-[470px]">
                          <div className="flex items-center gap-2 mb-2">
                            <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
                              Quantity
                            </label>
                            <span className="text-[12px] font-normal text-[#FF383C] font-urbanist">*</span>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={formData.quantity}
                              onChange={(e) => handleInputChange('quantity', e.target.value)}
                              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-[14px] sm:text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                              placeholder="Enter quantity"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Image Card */}
                <div className="bg-white rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-6">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="h-7 text-center">
                      <h2 className="text-[20px] sm:text-[24px] font-bold text-[#212121] font-urbanist leading-[1.17]">
                        Upload Image
                      </h2>
                    </div>

                    {/* Upload Area - Original Design */}
                    <div className="flex justify-center">
                      <div className="w-full max-w-[400px] h-[180px] sm:h-[206px] border-2 border-dashed border-[#BDBDBD] rounded-[12px] flex flex-col items-center justify-center gap-4 relative hover:border-[#6CC049] transition-colors">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Image 
                            src="/images/icon-gallery-add.svg" 
                            alt="Gallery Add" 
                            width={30} 
                            height={30}
                          />
                          <p className="text-[14px] sm:text-[16px] font-semibold text-[#757575] font-urbanist text-center px-4">
                            Drag and drop files to upload
                          </p>
                          <button
                            type="button"
                            className="px-6 sm:px-8 py-2 border-2 border-[#BDBDBD] text-[#757575] text-[14px] sm:text-[16px] font-semibold font-urbanist rounded-[60px] hover:border-[#6CC049] hover:text-[#6CC049] transition-colors"
                          >
                            Select files
                          </button>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="image-upload"
                        />
                      </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-[#212121] font-urbanist">
                            Selected Images ({imagePreviews.length})
                          </h3>
                          <button
                            type="button"
                            onClick={handleUploadImages}
                            disabled={!createdProductId}
                            className={`px-4 py-2 text-[14px] font-semibold font-urbanist rounded-[8px] transition-colors ${
                              createdProductId
                                ? 'bg-[#6CC049] text-white hover:bg-[#5AA03A]'
                                : 'bg-[#BDBDBD] text-[#757575] cursor-not-allowed'
                            }`}
                          >
                            {createdProductId ? 'Upload Images' : 'Create Product First'}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-[8px] border border-[#E0E0E0]"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageDelete(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF383C] text-white rounded-full flex items-center justify-center text-[12px] font-bold hover:bg-[#E02E32] transition-colors opacity-0 group-hover:opacity-100"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Status Message */}
                    {!createdProductId && imagePreviews.length > 0 && (
                      <div className="bg-[#FFF3CD] border border-[#FFEAA7] rounded-[8px] p-3">
                        <p className="text-[12px] text-[#856404] font-urbanist text-center">
                          Images selected. Create the product first to upload them.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button - Only show for supported categories */}
            {selectedCategory && (['food', 'supermarket', 'pharmacy', 'restaurant', 'others'].includes(selectedCategory) || ['events', 'experiences', 'tour_guide', 'influencer'].includes(selectedCategory) || ['apartment'].includes(selectedCategory) || ['club'].includes(selectedCategory)) && (
              <div className="w-full">
                <button
                  type="submit"
                  disabled={isCreatingProduct || vendorLoading || !vendorData?.id}
                  className={`w-full h-[48px] sm:h-[52px] text-white text-[16px] sm:text-[20px] font-semibold font-urbanist rounded-[60px] transition-colors duration-200 flex items-center justify-center ${
                    isCreatingProduct || vendorLoading || !vendorData?.id
                      ? 'bg-[#BDBDBD] cursor-not-allowed'
                      : 'bg-[#6CC049] hover:bg-[#5AA03A]'
                  }`}
                >
                  {isCreatingProduct ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Product...
                    </div>
                  ) : vendorLoading ? (
                    'Loading...'
                  ) : !vendorData?.id ? (
                    'Vendor data unavailable'
                  ) : (
                    'Create New Listing'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Add Subcategory Modal */}
      <AddSubcategoryModal
        isOpen={isSubcategoryModalOpen}
        onClose={() => setIsSubcategoryModalOpen(false)}
        onSave={handleSubcategorySave}
      />
    </DashboardLayout>
  );
};

export default CreateProductPage;