'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  fetchProductById,
  updateReservationProduct,
  updateHotelProduct,
  updateFoodProduct,
  updateCarProduct,
  updateEventProduct,
  updateAccommodationProduct,
  ReservationUpdateRequest,
  HotelUpdateRequest,
  FoodUpdateRequest,
  CarUpdateRequest,
  EventUpdateRequest,
  AccommodationUpdateRequest,
  ReservationData,
  ApiProduct,
  getImageUrl,
  getPrimaryImageUrl
} from '@/services/productService';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'iconsax-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ArrayInput from '../components/ArrayInput';
import { SimpleAddressInput } from '../../create-product/components/SimpleAddressInput';

const UpdateProductPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = params.id as string;
  const vendorId = searchParams.get('vendorId');

  console.log('🚀 UpdateProductPage rendered with productId:', productId, 'vendorId:', vendorId);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<ReservationUpdateRequest | HotelUpdateRequest | FoodUpdateRequest | CarUpdateRequest | EventUpdateRequest | AccommodationUpdateRequest>({
    productId: 0,
    subcategoryId: 0,
    productName: '',
    categoryName: '',
    description: '',
    address: '',
    productType: '',
    serviceType: '',
    cuisineType: [],
    operatingHours: '',
    tableCapacity: 0,
    reservationFee: 0,
    reservationDuration: 0,
    acceptsWalkIns: false,
    dressCode: '',
    availableStartDate: '',
    availableEndDate: '',
    specialFeatures: []
  });

  useEffect(() => {
    console.log('🎯 === USEEFFECT TRIGGERED ===');
    console.log('🎯 productId:', productId);
    console.log('🎯 vendorId:', vendorId);

    const fetchProduct = async () => {
      console.log('🚀 === INSIDE fetchProduct FUNCTION ===');
      try {
        if (!vendorId) {
          console.log('❌ No vendorId found');
          toast.error('Vendor ID is required.');
          router.push('/vendor/manage-store');
          return;
        }

        console.log('⏳ Setting loading to true...');
        setLoading(true);

        console.log('📞 About to call fetchProductById with vendorId:', vendorId);
        const productData = await fetchProductById(Number(productId), Number(vendorId));
        console.log('✅ Product data fetched:', productData);

        setProduct(productData);

        // Initialize form data based on product type
        initializeFormData(productData);
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        toast.error('Failed to fetch product details');
        setLoading(false);
      } finally {
        console.log('🏁 Setting loading to false...');
        setLoading(false);
      }
    };

    console.log('🔍 Checking if should fetch - productId:', productId, 'vendorId:', vendorId);
    if (productId && vendorId) {
      console.log('✅ ProductId and vendorId exist, calling fetchProduct...');
      fetchProduct();
    } else {
      console.log('❌ Missing required params');
      setLoading(false);
    }
  }, [productId, vendorId, router]);

  const initializeFormData = (productData: ApiProduct) => {
    console.log('🔧 Initializing form data with product:', productData);

    // Add type-specific data
    if (productData.reservation && Object.keys(productData.reservation).length > 0) {
      const reservation = productData.reservation as ReservationData;
      setFormData({
        productId: productData.productId,
        subcategoryId: productData.subcategoryId || 0,
        productName: productData.productName,
        categoryName: productData.categoryName || '',
        description: productData.description || '',
        address: productData.address || '',
        productType: '',
        serviceType: reservation.serviceType || '',
        cuisineType: reservation.cuisineType || [],
        operatingHours: reservation.operatingHours || '',
        tableCapacity: reservation.tableCapacity || 0,
        reservationFee: reservation.reservationFee || 0,
        reservationDuration: reservation.reservationDuration || 0,
        acceptsWalkIns: reservation.acceptsWalkIns || false,
        dressCode: reservation.dressCode || '',
        availableStartDate: '',
        availableEndDate: '',
        specialFeatures: reservation.specialFeatures || []
      });
    } else if (productData.hotel && Object.keys(productData.hotel).length > 0) {
      const hotel = productData.hotel;
      const room = productData.rooms && productData.rooms.length > 0 ? productData.rooms[0] : null;
      setFormData({
        productId: productData.productId,
        subcategoryId: productData.subcategoryId || 0,
        productName: productData.productName,
        categoryName: productData.categoryName || '',
        description: productData.description || '',
        address: productData.address || '',
        price: productData.price || 0,
        checkInTime: hotel.checkInTime || '',
        checkOutTime: hotel.checkOutTime || '',
        propertyAmenities: hotel.propertyAmenities || '',
        cancellationPolicy: hotel.cancellationPolicy || '',
        availableStartDate: '',
        availableEndDate: '',
        roomTypeName: room?.roomTypeName || '',
        dailyRate: room?.dailyRate || 0,
        capacity: room?.capacity || 0,
        totalRooms: room?.totalRooms || 0,
        availableRooms: room?.availableRooms || 0,
        amenities: room?.amenities || ''
      });
    } else if (productData.food && Object.keys(productData.food).length > 0) {
      const food = productData.food;
      setFormData({
        productId: productData.productId,
        productName: productData.productName,
        categoryName: productData.categoryName || '',
        subcategoryId: productData.subcategoryId || 0,
        description: productData.description || '',
        address: productData.address || '',
        price: productData.price || 0,
        stockQuantity: food.stockQuantity || 0,
        foodCategory: food.foodCategory || '',
        dietaryInfo: food.dietaryInfo || [],
        spiceLevel: food.spiceLevel || '',
        ingredients: food.ingredients || [],
        allergens: food.allergens || [],
        preparationTime: food.preparationTime || 0,
        servingSize: food.servingSize || '',
        availableForDelivery: food.availableForDelivery ?? true,
        availableForPickup: food.availableForPickup ?? true,
        deliveryFee: food.deliveryFee || 0,
        minimumOrderForDelivery: food.minimumOrderForDelivery || 0,
        operatingHours: food.operatingHours || '',
        acceptsWalkIns: food.acceptsWalkIns ?? true
      });
    } else if (productData.carRental && Object.keys(productData.carRental).length > 0) {
      const car = productData.carRental;
      setFormData({
        productId: productData.productId,
        productName: productData.productName,
        categoryName: productData.categoryName || '',
        subcategoryId: productData.subcategoryId || 0,
        description: productData.description || '',
        address: productData.address || '',
        price: productData.price || 0,
        carMake: car.carMake || '',
        carModel: car.carModel || '',
        carYear: car.carYear || new Date().getFullYear(),
        licensePlate: car.licensePlate || '',
        carType: car.carType || '',
        seats: car.seats || 0,
        hourlyRate: car.hourlyRate || 0,
        dailyRate: car.dailyRate || 0,
        monthlyRate: car.monthlyRate || 0,
        securityDeposit: car.securityDeposit || 0,
        hasDriver: car.hasDriver ?? false,
        availableDays: car.availableDays || [],
        availableHours: car.availableHours || { start: '', end: '' },
        termsAndConditions: car.termsAndConditions || '',
        addons: car.addons || []
      });
    } else if (productData.event && Object.keys(productData.event).length > 0) {
      const event = productData.event;
      const ticket = productData.tickets && productData.tickets.length > 0 ? productData.tickets[0] : null;
      setFormData({
        productId: productData.productId,
        productName: productData.productName,
        categoryName: productData.categoryName || '',
        subcategoryId: productData.subcategoryId || 0,
        price: productData.price || 0,
        address: productData.address || '',
        quantity: productData.quantity || 0,
        description: productData.description || '',
        eventDate: event.eventDate || '',
        eventEndDate: event.eventEndDate || '',
        eventTime: event.eventTime || '',
        eventEndTime: event.eventEndTime || '',
        venue: event.venue || '',
        maxAttendees: event.maxAttendees || 0,
        dressCode: event.dressCode || '',
        ageRestriction: event.ageRestriction || '',
        ticketId: ticket?.ticketId,
        ticketPrice: ticket?.price,
        ticketQuantity: ticket?.quantity,
        ticketDescription: ticket?.description
      });
    } else if (productData.accommodation && Object.keys(productData.accommodation).length > 0) {
      const accommodation = productData.accommodation;
      setFormData({
        productId: productData.productId,
        propertyType: accommodation.propertyType || '',
        listingType: accommodation.listingType || '',
        subcategoryId: productData.subcategoryId || 0,
        description: productData.description || '',
        address: productData.address || '',
        propertyName: accommodation.propertyName || productData.productName,
        dailyRate: accommodation.dailyRate || 0,
        maxGuests: accommodation.maxGuests || 0,
        bedrooms: accommodation.bedrooms || 0,
        bathrooms: accommodation.bathrooms || 0,
        totalArea: accommodation.totalArea || '',
        furnishingStatus: accommodation.furnishingStatus || '',
        amenities: accommodation.amenities || [],
        floorNumber: accommodation.floorNumber || '',
        parkingSpaces: accommodation.parkingSpaces || 0,
        checkInTime: accommodation.checkInTime || '',
        checkOutTime: accommodation.checkOutTime || '',
        houseRules: accommodation.houseRules || [],
        availableStartDate: '',
        availableEndDate: '',
        cancellationPolicy: accommodation.cancellationPolicy || ''
      });
    } else {
      console.log('General product - no specific form data');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required');
      router.push('/login');
      return;
    }

    // Determine product type and validate
    const isReservation = product?.reservation && Object.keys(product.reservation).length > 0;
    const isHotel = product?.hotel && Object.keys(product.hotel).length > 0;
    const isFood = product?.food && Object.keys(product.food).length > 0;
    const isCar = product?.carRental && Object.keys(product.carRental).length > 0;
    const isEvent = product?.event && Object.keys(product.event).length > 0;
    const isAccommodation = product?.accommodation && Object.keys(product.accommodation).length > 0;

    if (!isReservation && !isHotel && !isFood && !isCar && !isEvent && !isAccommodation) {
      toast.error('Update functionality is not available for this product type');
      return;
    }

    try {
      setUpdating(true);

      console.log('📤 Submitting update with data:', formData);

      let response;
      let productType = '';

      if (isReservation) {
        response = await updateReservationProduct(formData as ReservationUpdateRequest, token);
        productType = 'Reservation';
      } else if (isHotel) {
        response = await updateHotelProduct(formData as HotelUpdateRequest, token);
        productType = 'Hotel';
      } else if (isFood) {
        response = await updateFoodProduct(formData as FoodUpdateRequest, token);
        productType = 'Food';
      } else if (isCar) {
        response = await updateCarProduct(formData as CarUpdateRequest, token);
        productType = 'Car';
      } else if (isEvent) {
        response = await updateEventProduct(formData as EventUpdateRequest, token);
        productType = 'Event';
      } else if (isAccommodation) {
        response = await updateAccommodationProduct(formData as AccommodationUpdateRequest, token);
        productType = 'Accommodation';
      }

      if (response && response.responseCode === 200) {
        toast.success(`${productType} product updated successfully!`);
        router.push('/vendor/manage-store');
      } else {
        toast.error(response?.responseMessage || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Update Product" pageDescription="Loading product details...">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#6CC049] border-t-transparent rounded-full animate-spin"></div>
            <span>Loading product details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout pageTitle="Update Product" pageDescription="Product not found">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/vendor/manage-store')}
              className="px-4 py-2 bg-[#6CC049] text-white rounded-lg hover:bg-[#5AA83A] transition-colors"
            >
              Back to Manage Store
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Ensure formData is properly initialized before rendering
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <DashboardLayout pageTitle="Update Product" pageDescription="Initializing form...">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#6CC049] border-t-transparent rounded-full animate-spin"></div>
            <span>Initializing form...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Update Product" pageDescription="Update your product information">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Update Product</h1>
          <p className="text-gray-600">Update your product information</p>
        </div>

        {/* Product Images */}
        {product.images && product.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/icon-gallery-add.svg';
                    }}
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 right-2 bg-[#6CC049] text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.productName || ''}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  required
                />
              </div>

              <SimpleAddressInput
                value={formData.address || ''}
                onChange={(value) => handleInputChange('address', value)}
                placeholder="Enter address"
                label="Address"
                required={true}
              />

            </div>

            {/* Type-specific fields will be rendered based on productType */}
            {product.reservation && Object.keys(product.reservation).length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Reservation Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={'serviceType' in formData ? formData.serviceType : ''}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Capacity
                  </label>
                  <input
                    type="number"
                    value={'tableCapacity' in formData ? formData.tableCapacity : ''}
                    onChange={(e) => handleInputChange('tableCapacity', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={'reservationFee' in formData ? formData.reservationFee : ''}
                    onChange={(e) => handleInputChange('reservationFee', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={'operatingHours' in formData ? formData.operatingHours : ''}
                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="Enter operating hours (e.g., 9 AM - 5 PM)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={'reservationDuration' in formData ? formData.reservationDuration : ''}
                    onChange={(e) => handleInputChange('reservationDuration', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={'dressCode' in formData ? formData.dressCode : ''}
                    onChange={(e) => handleInputChange('dressCode', e.target.value)}
                    placeholder="e.g., Smart casual, Formal, Casual"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.availableStartDate || ''}
                      onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available End Date
                    </label>
                    <input
                      type="date"
                      value={formData.availableEndDate || ''}
                      onChange={(e) => handleInputChange('availableEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <ArrayInput
                  label="Special Features"
                  value={'specialFeatures' in formData && Array.isArray(formData.specialFeatures) ? formData.specialFeatures : []}
                  onChange={(value) => handleInputChange('specialFeatures', value)}
                  placeholder="e.g., Live music, Outdoor seating, Private dining"
                  helpText="Press Enter or click + to add each feature"
                />

                <ArrayInput
                  label="Cuisine Type"
                  value={'cuisineType' in formData && Array.isArray(formData.cuisineType) ? formData.cuisineType : []}
                  onChange={(value) => handleInputChange('cuisineType', value)}
                  placeholder="e.g., Italian, Chinese, Nigerian, Continental"
                  helpText="Press Enter or click + to add each cuisine type"
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="acceptsWalkIns"
                    checked={'acceptsWalkIns' in formData ? formData.acceptsWalkIns : false}
                    onChange={(e) => handleInputChange('acceptsWalkIns', e.target.checked)}
                    className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
                  />
                  <label htmlFor="acceptsWalkIns" className="ml-2 text-sm text-gray-700">
                    Accepts Walk-ins
                  </label>
                </div>
              </div>
            ) : product.hotel && Object.keys(product.hotel).length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Hotel Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={'price' in formData ? formData.price : ''}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Time
                    </label>
                    <input
                      type="time"
                      value={'checkInTime' in formData ? formData.checkInTime : ''}
                      onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Time
                    </label>
                    <input
                      type="time"
                      value={'checkOutTime' in formData ? formData.checkOutTime : ''}
                      onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Amenities
                  </label>
                  <textarea
                    value={'propertyAmenities' in formData ? formData.propertyAmenities : ''}
                    onChange={(e) => handleInputChange('propertyAmenities', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="e.g., Pool, Gym, Restaurant, Bar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    value={'cancellationPolicy' in formData ? formData.cancellationPolicy : ''}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.availableStartDate || ''}
                      onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available End Date
                    </label>
                    <input
                      type="date"
                      value={formData.availableEndDate || ''}
                      onChange={(e) => handleInputChange('availableEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 pt-4">Room Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type Name
                  </label>
                  <input
                    type="text"
                    value={'roomTypeName' in formData ? formData.roomTypeName : ''}
                    onChange={(e) => handleInputChange('roomTypeName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="e.g., Deluxe Suite, Standard Room"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'dailyRate' in formData ? formData.dailyRate : ''}
                      onChange={(e) => handleInputChange('dailyRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={'capacity' in formData ? formData.capacity : ''}
                      onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="Max guests per room"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Rooms
                    </label>
                    <input
                      type="number"
                      value={'totalRooms' in formData ? formData.totalRooms : ''}
                      onChange={(e) => handleInputChange('totalRooms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Rooms
                    </label>
                    <input
                      type="number"
                      value={'availableRooms' in formData ? formData.availableRooms : ''}
                      onChange={(e) => handleInputChange('availableRooms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Amenities
                  </label>
                  <textarea
                    value={'amenities' in formData ? formData.amenities : ''}
                    onChange={(e) => handleInputChange('amenities', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="e.g., WiFi, TV, Air Conditioning, Mini Bar"
                  />
                </div>
              </div>
            ) : product.food && Object.keys(product.food).length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Food Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'price' in formData ? formData.price : ''}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={'stockQuantity' in formData ? formData.stockQuantity : ''}
                      onChange={(e) => handleInputChange('stockQuantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Category
                  </label>
                  <input
                    type="text"
                    value={'foodCategory' in formData ? formData.foodCategory : ''}
                    onChange={(e) => handleInputChange('foodCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="e.g., Appetizer, Main Course, Dessert"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spice Level
                    </label>
                    <select
                      value={'spiceLevel' in formData ? formData.spiceLevel : ''}
                      onChange={(e) => handleInputChange('spiceLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    >
                      <option value="">Select spice level</option>
                      <option value="None">None</option>
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Hot">Hot</option>
                      <option value="Very Hot">Very Hot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serving Size
                    </label>
                    <input
                      type="text"
                      value={'servingSize' in formData ? formData.servingSize : ''}
                      onChange={(e) => handleInputChange('servingSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., 1 person, 2-3 persons"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={'preparationTime' in formData ? formData.preparationTime : ''}
                    onChange={(e) => handleInputChange('preparationTime', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <ArrayInput
                  label="Dietary Information"
                  value={'dietaryInfo' in formData && Array.isArray(formData.dietaryInfo) ? formData.dietaryInfo : []}
                  onChange={(value) => handleInputChange('dietaryInfo', value)}
                  placeholder="e.g., Vegetarian, Vegan, Gluten-Free"
                  helpText="Press Enter or click + to add each dietary tag"
                />

                <ArrayInput
                  label="Ingredients"
                  value={'ingredients' in formData && Array.isArray(formData.ingredients) ? formData.ingredients : []}
                  onChange={(value) => handleInputChange('ingredients', value)}
                  placeholder="e.g., Tomatoes, Onions, Garlic"
                  helpText="Press Enter or click + to add each ingredient"
                />

                <ArrayInput
                  label="Allergens"
                  value={'allergens' in formData && Array.isArray(formData.allergens) ? formData.allergens : []}
                  onChange={(value) => handleInputChange('allergens', value)}
                  placeholder="e.g., Peanuts, Dairy, Shellfish"
                  helpText="Press Enter or click + to add each allergen"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Delivery Options</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="availableForDelivery"
                      checked={'availableForDelivery' in formData ? formData.availableForDelivery : false}
                      onChange={(e) => handleInputChange('availableForDelivery', e.target.checked)}
                      className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
                    />
                    <label htmlFor="availableForDelivery" className="text-sm text-gray-700">
                      Available for Delivery
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="availableForPickup"
                      checked={'availableForPickup' in formData ? formData.availableForPickup : false}
                      onChange={(e) => handleInputChange('availableForPickup', e.target.checked)}
                      className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
                    />
                    <label htmlFor="availableForPickup" className="text-sm text-gray-700">
                      Available for Pickup
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="foodAcceptsWalkIns"
                      checked={'acceptsWalkIns' in formData ? formData.acceptsWalkIns : false}
                      onChange={(e) => handleInputChange('acceptsWalkIns', e.target.checked)}
                      className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
                    />
                    <label htmlFor="foodAcceptsWalkIns" className="text-sm text-gray-700">
                      Accepts Walk-ins
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Fee
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'deliveryFee' in formData ? formData.deliveryFee : ''}
                      onChange={(e) => handleInputChange('deliveryFee', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order for Delivery
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'minimumOrderForDelivery' in formData ? formData.minimumOrderForDelivery : ''}
                      onChange={(e) => handleInputChange('minimumOrderForDelivery', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={'operatingHours' in formData ? formData.operatingHours : ''}
                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="Enter operating hours (e.g., 9 AM - 5 PM)"
                  />
                </div>
              </div>
            ) : product.carRental && Object.keys(product.carRental).length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Car Rental Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Make *
                    </label>
                    <input
                      type="text"
                      value={'carMake' in formData ? formData.carMake : ''}
                      onChange={(e) => handleInputChange('carMake', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., Toyota, Honda, Mercedes"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Model *
                    </label>
                    <input
                      type="text"
                      value={'carModel' in formData ? formData.carModel : ''}
                      onChange={(e) => handleInputChange('carModel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., Camry, Accord, E-Class"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={'carYear' in formData ? formData.carYear : ''}
                      onChange={(e) => handleInputChange('carYear', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Plate *
                    </label>
                    <input
                      type="text"
                      value={'licensePlate' in formData ? formData.licensePlate : ''}
                      onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Type
                    </label>
                    <input
                      type="text"
                      value={'carType' in formData ? formData.carType : ''}
                      onChange={(e) => handleInputChange('carType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., Sedan, SUV, Truck"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    value={'seats' in formData ? formData.seats : ''}
                    onChange={(e) => handleInputChange('seats', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 pt-4">Pricing</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'hourlyRate' in formData ? formData.hourlyRate : ''}
                      onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'dailyRate' in formData ? formData.dailyRate : ''}
                      onChange={(e) => handleInputChange('dailyRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'monthlyRate' in formData ? formData.monthlyRate : ''}
                      onChange={(e) => handleInputChange('monthlyRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={'securityDeposit' in formData ? formData.securityDeposit : ''}
                    onChange={(e) => handleInputChange('securityDeposit', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasDriver"
                    checked={'hasDriver' in formData ? formData.hasDriver : false}
                    onChange={(e) => handleInputChange('hasDriver', e.target.checked)}
                    className="w-4 h-4 text-[#6CC049] bg-gray-100 border-gray-300 rounded focus:ring-[#6CC049] focus:ring-2"
                  />
                  <label htmlFor="hasDriver" className="text-sm text-gray-700">
                    Includes Driver
                  </label>
                </div>

                <ArrayInput
                  label="Available Days"
                  value={'availableDays' in formData && Array.isArray(formData.availableDays) ? formData.availableDays : []}
                  onChange={(value) => handleInputChange('availableDays', value)}
                  placeholder="e.g., Monday, Tuesday, Weekend"
                  helpText="Press Enter or click + to add each day"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Hours - Start
                    </label>
                    <input
                      type="time"
                      value={'availableHours' in formData ? formData.availableHours.start : ''}
                      onChange={(e) => handleInputChange('availableHours', { ...('availableHours' in formData ? formData.availableHours : { start: '', end: '' }), start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Hours - End
                    </label>
                    <input
                      type="time"
                      value={'availableHours' in formData ? formData.availableHours.end : ''}
                      onChange={(e) => handleInputChange('availableHours', { ...('availableHours' in formData ? formData.availableHours : { start: '', end: '' }), end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms and Conditions
                  </label>
                  <textarea
                    value={'termsAndConditions' in formData ? formData.termsAndConditions : ''}
                    onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>
              </div>
            ) : product.event && Object.keys(product.event).length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'price' in formData ? formData.price : ''}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={'quantity' in formData ? formData.quantity : ''}
                      onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={'eventDate' in formData ? formData.eventDate : ''}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      value={'eventTime' in formData ? formData.eventTime : ''}
                      onChange={(e) => handleInputChange('eventTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event End Date *
                    </label>
                    <input
                      type="date"
                      value={'eventEndDate' in formData ? formData.eventEndDate : ''}
                      onChange={(e) => handleInputChange('eventEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event End Time *
                    </label>
                    <input
                      type="time"
                      value={'eventEndTime' in formData ? formData.eventEndTime : ''}
                      onChange={(e) => handleInputChange('eventEndTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={'venue' in formData ? formData.venue : ''}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="Event venue location"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      value={'maxAttendees' in formData ? formData.maxAttendees : ''}
                      onChange={(e) => handleInputChange('maxAttendees', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Restriction
                    </label>
                    <input
                      type="text"
                      value={'ageRestriction' in formData ? formData.ageRestriction : ''}
                      onChange={(e) => handleInputChange('ageRestriction', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., 18+, All ages"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={'dressCode' in formData ? formData.dressCode : ''}
                    onChange={(e) => handleInputChange('dressCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    placeholder="e.g., Formal, Casual, Business Casual"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 pt-4">Ticket Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'ticketPrice' in formData ? formData.ticketPrice || '' : ''}
                      onChange={(e) => handleInputChange('ticketPrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Quantity
                    </label>
                    <input
                      type="number"
                      value={'ticketQuantity' in formData ? formData.ticketQuantity || '' : ''}
                      onChange={(e) => handleInputChange('ticketQuantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Description
                  </label>
                  <textarea
                    value={'ticketDescription' in formData ? formData.ticketDescription || '' : ''}
                    onChange={(e) => handleInputChange('ticketDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>
              </div>
            ) : product.accommodation && Object.keys(product.accommodation).length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Accommodation Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <input
                      type="text"
                      value={'propertyType' in formData ? formData.propertyType : ''}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., Apartment, House, Condo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Listing Type *
                    </label>
                    <input
                      type="text"
                      value={'listingType' in formData ? formData.listingType : ''}
                      onChange={(e) => handleInputChange('listingType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., Entire place, Private room"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    value={'propertyName' in formData ? formData.propertyName : ''}
                    onChange={(e) => handleInputChange('propertyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={'dailyRate' in formData ? formData.dailyRate : ''}
                      onChange={(e) => handleInputChange('dailyRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Guests
                    </label>
                    <input
                      type="number"
                      value={'maxGuests' in formData ? formData.maxGuests : ''}
                      onChange={(e) => handleInputChange('maxGuests', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={'bedrooms' in formData ? formData.bedrooms : ''}
                      onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={'bathrooms' in formData ? formData.bathrooms : ''}
                      onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Area
                    </label>
                    <input
                      type="text"
                      value={'totalArea' in formData ? formData.totalArea : ''}
                      onChange={(e) => handleInputChange('totalArea', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                      placeholder="e.g., 1200 sqft"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnishing Status
                    </label>
                    <select
                      value={'furnishingStatus' in formData ? formData.furnishingStatus : ''}
                      onChange={(e) => handleInputChange('furnishingStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    >
                      <option value="">Select status</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Number
                    </label>
                    <input
                      type="text"
                      value={'floorNumber' in formData ? formData.floorNumber : ''}
                      onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parking Spaces
                    </label>
                    <input
                      type="number"
                      value={'parkingSpaces' in formData ? formData.parkingSpaces : ''}
                      onChange={(e) => handleInputChange('parkingSpaces', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Time
                    </label>
                    <input
                      type="time"
                      value={'checkInTime' in formData ? formData.checkInTime : ''}
                      onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Time
                    </label>
                    <input
                      type="time"
                      value={'checkOutTime' in formData ? formData.checkOutTime : ''}
                      onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <ArrayInput
                  label="Amenities"
                  value={'amenities' in formData && Array.isArray(formData.amenities) ? formData.amenities : []}
                  onChange={(value) => handleInputChange('amenities', value)}
                  placeholder="e.g., WiFi, Pool, Gym, Parking"
                  helpText="Press Enter or click + to add each amenity"
                />

                <ArrayInput
                  label="House Rules"
                  value={'houseRules' in formData && Array.isArray(formData.houseRules) ? formData.houseRules : []}
                  onChange={(value) => handleInputChange('houseRules', value)}
                  placeholder="e.g., No smoking, No pets, Quiet hours after 10pm"
                  helpText="Press Enter or click + to add each rule"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Start Date
                    </label>
                    <input
                      type="date"
                      value={'availableStartDate' in formData ? formData.availableStartDate : ''}
                      onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available End Date
                    </label>
                    <input
                      type="date"
                      value={'availableEndDate' in formData ? formData.availableEndDate : ''}
                      onChange={(e) => handleInputChange('availableEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    value={'cancellationPolicy' in formData ? formData.cancellationPolicy : ''}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC049]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Update Not Available
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          This product type does not yet support updates.
                          For other product types, please contact support or use the create new product option.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating || (
                  (!product?.reservation || Object.keys(product.reservation).length === 0) &&
                  (!product?.hotel || Object.keys(product.hotel).length === 0) &&
                  (!product?.food || Object.keys(product.food).length === 0) &&
                  (!product?.carRental || Object.keys(product.carRental).length === 0) &&
                  (!product?.event || Object.keys(product.event).length === 0) &&
                  (!product?.accommodation || Object.keys(product.accommodation).length === 0)
                )}
                className="px-6 py-2 bg-[#6CC049] text-white rounded-md hover:bg-[#5AA83A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {updating ? 'Updating...' : (
                  (product?.reservation && Object.keys(product.reservation).length > 0) ||
                  (product?.hotel && Object.keys(product.hotel).length > 0) ||
                  (product?.food && Object.keys(product.food).length > 0) ||
                  (product?.carRental && Object.keys(product.carRental).length > 0) ||
                  (product?.event && Object.keys(product.event).length > 0) ||
                  (product?.accommodation && Object.keys(product.accommodation).length > 0)
                ) ? 'Update Product' : 'Update Not Available'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpdateProductPage;
