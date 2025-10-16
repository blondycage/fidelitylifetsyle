'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DynamicForm from './components/DynamicForm';
import { useVendor } from '@/contexts/VendorContext';
import toast from 'react-hot-toast';
import AddSubcategoryModal from '@/components/vendor/modals/AddSubcategoryModal';
import { ProductSuccessModal } from '@/components/vendor/modals/ProductSuccessModal';
import TicketCreationModal from '@/components/vendor/modals/TicketCreationModal';
import RoomCreationModal from '@/components/vendor/modals/RoomCreationModal';
import { getSubcategories, clearSubcategoriesCache, SubcategoryItem } from '@/services/subcategoryService';

const CreateProductPage = () => {
  const router = useRouter();
  const { vendorData, loading: vendorLoading, refreshVendorData } = useVendor();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [eventId, setEventId] = useState<number | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [hotelId, setHotelId] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
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
    venueLatitude: 0,
    venueLongitude: 0,
    maxAttendees: '',
    ageRestriction: '',
    dressCode: '',
    // Additional required fields for events
    description: '',
    address: '',
    addressLatitude: 0,
    addressLongitude: 0,
    subcategoryName: '',
    subcategoryId: null,
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
    amenities: [] as string[],
    floorNumber: '',
    parkingSpaces: '',
    checkInTime: '',
    checkOutTime: '',
    houseRules: [] as string[],
    cancellationPolicy: '',
    availableStartDate: '',
    availableEndDate: '',
    // Hotel payload fields
    propertyAmenities: [] as string[],
    // Reservation payload fields
    productType: '',
    serviceType: '',
    cuisineType: [] as string[],
    operatingHours: '',
    tableCapacity: '',
    reservationFee: '',
    reservationDuration: '',
    acceptsWalkIns: true,
    dressCode: '',
    specialFeatures: [] as string[],
    // Car rental payload fields
    carMake: '',
    carModel: '',
    carYear: '',
    licensePlate: '',
    carType: '',
    seats: '',
    hourlyRate: '',
    dailyRate: '',
    monthlyRate: '',
    securityDeposit: '',
    hasDriver: false,
    availableDays: [] as string[],
    availableHoursStart: '',
    availableHoursEnd: '',
    termsAndConditions: '',
    addons: [] as Array<{name: string, price: string, description: string}>,
    // Additional fields for other categories (will be used later)
    subCategory: '',
    location: '',
    images: [] as File[],
    tags: [] as string[],
    availability: '',
    contactInfo: ''
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch subcategories when vendor data is available
  const fetchSubcategories = async (vendorId: number) => {
    try {
      setSubcategoriesLoading(true);
      const subcategoriesList = await getSubcategories(vendorId);
      setSubcategories(subcategoriesList);
      console.log('✅ Subcategories fetched:', subcategoriesList);
    } catch (error) {
      console.error('❌ Error fetching subcategories:', error);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  // Refresh vendor data on page load to get latest profile details
  useEffect(() => {
    const refreshData = async () => {
      try {
        await refreshVendorData();
        console.log('✅ Vendor data refreshed on create product page load');
      } catch (error) {
        console.error('❌ Error refreshing vendor data:', error);
      }
    };

    refreshData();
  }, []); // Empty dependency array - only run once on mount

  // Fetch subcategories when vendor data is loaded
  useEffect(() => {
    if (vendorData?.id && vendorData?.businessType) {
      fetchSubcategories(vendorData.id);
    }
  }, [vendorData?.id, vendorData?.businessType]);

  // Set selected category based on vendor's business type
  useEffect(() => {
    if (vendorData?.businessType) {
      const businessTypeToCategory = {
        'HOTEL': 'hotel',
        'HOTELS': 'hotel',
        'HOSPITALITY': 'accommodation',
        'APARTMENT': 'accommodation',
        'INFLUENCER': 'influencer',
        'RESTAURANT': 'restaurant',
        'CLUB': 'club',
        'RESERVATIONS': 'reservations',
        'OTHERS': 'others',
        'SUPERMARKET': 'supermarket',
        'PHARMACY': 'pharmacy',
        'FASHION': 'fashion',
        'TOUR_GUIDE': 'tour_guide',
        'EXPERIENCES': 'experiences',
        'EVENTS': 'events'
      };
      
      const category = businessTypeToCategory[vendorData.businessType] || 'others';
      setSelectedCategory(category);
      handleInputChange('categoryName', category);
    }
  }, [vendorData?.businessType]);

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

  // Debug vendor data and business type
  useEffect(() => {
    if (vendorData) {
      console.log('Vendor data loaded:', vendorData);
      console.log('Business type:', vendorData.businessType);
      console.log('Business type uppercase:', vendorData.businessType?.toUpperCase());
      console.log('Is event category:', isEventCategory());
      console.log('Is hotel category:', isHotelCategory());
      console.log('Selected category:', selectedCategory);
    }
  }, [vendorData, selectedCategory]);

  // Debug ticket modal state
  useEffect(() => {
    console.log('Ticket modal state changed:', { showTicketModal, eventId, productName: formData.productName });
  }, [showTicketModal, eventId, formData.productName]);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to format business type for display
  const formatBusinessType = (businessType: string) => {
    return businessType.charAt(0).toUpperCase() + businessType.slice(1).toLowerCase().replace('_', ' ');
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

  const handleSubcategorySave = async (subcategoryName: string) => {
    setFormData({ ...formData, subCategory: subcategoryName });
    
    // Refresh subcategories list
    if (vendorData?.id && vendorData?.businessType) {
      await fetchSubcategories(vendorData.id, vendorData.businessType);
    }
  };

  // Scroll to upload area
  const scrollToUploadArea = () => {
    console.log('Scrolling to upload area');
    setShowUploadArea(true);
    setShowScrollPrompt(false);
    // Small delay to ensure the upload area is rendered
    setTimeout(() => {
      const uploadArea = document.getElementById('upload-area');
      if (uploadArea) {
        uploadArea.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Skip to manage store
  const skipToManageStore = () => {
    router.push('/vendor/manage-store');
  };

  // Check if current business type is an event category
  const isEventCategory = () => {
    if (!vendorData?.businessType) {
      console.log('No vendor business type found');
      return false;
    }
    const eventCategories = ['EVENTS', 'EXPERIENCES', 'TOUR_GUIDE', 'INFLUENCER'];
    const isEvent = eventCategories.includes(vendorData.businessType);
    console.log('Business type:', vendorData.businessType, 'Is event category:', isEvent);
    return isEvent;
  };

  // Check if current business type is a hotel category
  const isHotelCategory = () => {
    if (!vendorData?.businessType) {
      console.log('No vendor business type found');
      return false;
    }
    const hotelCategories = ['HOTEL', 'HOTELS'];
    const isHotel = hotelCategories.includes(vendorData.businessType);
    console.log('Business type:', vendorData.businessType, 'Is hotel category:', isHotel);
    return isHotel;
  };

  // Handle ticket creation success
  const handleTicketSuccess = () => {
    setShowTicketModal(false);
    setEventId(null);
    clearForm();
    setIsSuccessModalOpen(true);
  };

  // Handle room creation success
  const handleRoomSuccess = () => {
    setShowRoomModal(false);
    setHotelId(null);
    clearForm();
    setIsSuccessModalOpen(true);
  };

  const clearForm = () => {
    setFormData({
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
      venueLatitude: 0,
      venueLongitude: 0,
      maxAttendees: '',
      ageRestriction: '',
      dressCode: '',
    // Additional required fields for events
    description: '',
    address: '',
    addressLatitude: 0,
    addressLongitude: 0,
    subcategoryName: '',
    subcategoryId: null,
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
      amenities: [] as string[],
      floorNumber: '',
      parkingSpaces: '',
      checkInTime: '',
      checkOutTime: '',
      houseRules: [] as string[],
      cancellationPolicy: '',
      availableStartDate: '',
      availableEndDate: '',
      // Hotel payload fields
      propertyAmenities: [] as string[],
      // Reservation payload fields
      productType: '',
      serviceType: '',
      cuisineType: [] as string[],
      operatingHours: '',
      tableCapacity: '',
      reservationFee: '',
      reservationDuration: '',
      acceptsWalkIns: true,
      dressCode: '',
      specialFeatures: [] as string[],
      // Car rental payload fields
      carMake: '',
      carModel: '',
      carYear: '',
      licensePlate: '',
      carType: '',
      seats: '',
      hourlyRate: '',
      dailyRate: '',
      monthlyRate: '',
      securityDeposit: '',
      hasDriver: false,
      availableDays: [] as string[],
      availableHoursStart: '',
      availableHoursEnd: '',
      termsAndConditions: '',
      addons: [] as Array<{name: string, price: string, description: string}>,
      // Additional fields for other categories (will be used later)
      description: '',
      subCategory: '',
      location: '',
      images: [] as File[],
      tags: [] as string[],
      availability: '',
      contactInfo: ''
    });
    setImagePreviews([]);
    setUploadProgress('');
    setCreatedProductId(null);
    setShowUploadArea(false);
    setShowScrollPrompt(false);
    setShowTicketModal(false);
    setEventId(null);
    setShowRoomModal(false);
    setHotelId(null);
  };

  const handleUploadImages = async (productId: number) => {
    console.log('handleUploadImages called with productId:', productId);
    if (formData.images.length === 0) {
      console.log('No images to upload');
      // Check if this is an event category and show ticket creation modal
      if (isEventCategory()) {
        console.log('Showing ticket modal for event category with eventId:', productId);
        setEventId(productId);
        setShowTicketModal(true);
      } else if (isHotelCategory()) {
        console.log('Showing room modal for hotel category with hotelId:', productId);
        setHotelId(productId);
        setShowRoomModal(true);
      } else {
        console.log('Showing success modal for non-event category');
        // Clear form and show success modal for non-event categories
        clearForm();
        setIsSuccessModalOpen(true);
      }
      return;
    }

    try {
      setIsUploadingImages(true);
      setUploadProgress('Uploading images...');

      const formDataToSend = new FormData();
      
      // Add all selected files to FormData
      formData.images.forEach((file) => {
        formDataToSend.append('files', file);
      });
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/product/${productId}/upload?isPrimary=true`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.responseCode === 200) {
        setUploadProgress('Images uploaded successfully!');
        toast.success('Images uploaded successfully!');
        
        // Check if this is an event category and show ticket creation modal
        if (isEventCategory()) {
          console.log('After image upload: Showing ticket modal for event category with eventId:', productId);
          setEventId(productId);
          setShowTicketModal(true);
        } else if (isHotelCategory()) {
          console.log('After image upload: Showing room modal for hotel category with hotelId:', productId);
          setHotelId(productId);
          setShowRoomModal(true);
        } else {
          console.log('After image upload: Showing success modal for non-event category');
          // Clear form and show success modal for non-event categories
          clearForm();
          setIsSuccessModalOpen(true);
        }
      } else {
        throw new Error(data.responseMessage || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadProgress('Failed to upload images');
      toast.error(error instanceof Error ? error.message : 'Error uploading images');
      
      // For hotels, proceed to room creation even if image upload fails
      if (isHotelCategory()) {
        console.log('Image upload failed for hotel, but proceeding to room creation with hotelId:', productId);
        toast.error('Image upload failed, but you can still create room types for your hotel');
        setHotelId(productId);
        setShowRoomModal(true);
      }
      // For events, also proceed to ticket creation even if image upload fails
      else if (isEventCategory()) {
        console.log('Image upload failed for event, but proceeding to ticket creation with eventId:', productId);
        toast.error('Image upload failed, but you can still create tickets for your event');
        setEventId(productId);
        setShowTicketModal(true);
      }
      // For other categories, show success modal
      else {
        console.log('Image upload failed for other category, showing success modal');
        clearForm();
        setIsSuccessModalOpen(true);
      }
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vendorData?.id) {
      toast.error('Vendor data not available. Please try again.');
      return;
    }

    // Check which endpoint to use based on business type
    const createProductCategories = ['OTHERS', 'SUPERMARKET', 'PHARMACY', 'RESTAURANT'];
    const eventsCategories = ['EVENTS', 'EXPERIENCES', 'TOUR_GUIDE', 'INFLUENCER'];
    const accommodationCategories = ['HOSPITALITY', 'APARTMENT'];
    const hotelCategories = ['HOTEL', 'HOTELS'];
    const reservationCategories = ['CLUB', 'RESERVATIONS'];
    const carCategories = ['CARS'];
    
    if (!vendorData?.businessType) {
      toast.error('Business type not available. Please try again.');
      return;
    }
    
    if (!createProductCategories.includes(vendorData.businessType) && !eventsCategories.includes(vendorData.businessType) && !accommodationCategories.includes(vendorData.businessType) && !hotelCategories.includes(vendorData.businessType) && !reservationCategories.includes(vendorData.businessType) && !carCategories.includes(vendorData.businessType)) {
      toast.error('This business type is not yet supported for product creation.');
      return;
    }

    // Validate required fields based on business type
    if (accommodationCategories.includes(vendorData.businessType)) {
      // For accommodation, validate propertyName instead of productName
      if (!formData.propertyName) {
        toast.error('Property Name is required.');
        return;
      }
    } else if (hotelCategories.includes(vendorData.businessType)) {
      // For hotel, validate productName, description, and address
      if (!formData.productName) {
        toast.error('Hotel Name is required.');
        return;
      }
      if (!formData.description) {
        toast.error('Description is required.');
        return;
      }
      if (!formData.address) {
        toast.error('Address is required.');
        return;
      }
    } else if (!formData.productName) {
      // For other business types, validate productName
      toast.error('Product Name is required.');
      return;
    }

    // Validate events-specific required fields
    if (eventsCategories.includes(vendorData.businessType)) {
      if (!formData.description) {
        toast.error('Description is required.');
        return;
      }
      if (!formData.eventDate) {
        toast.error('Event Date is required.');
        return;
      }
      if (!formData.eventTime) {
        toast.error('Event Time is required.');
        return;
      }
      if (!formData.eventEndDate) {
        toast.error('Event End Date is required.');
        return;
      }
    }

    // Validate car-specific required fields (only productName, vendorId, and description are required)
    if (carCategories.includes(vendorData.businessType)) {
      if (!formData.description) {
        toast.error('Description is required.');
        return;
      }
      // All other car fields are optional
    }

    // Only validate price and quantity for business types that have these fields in the UI
    if (['OTHERS', 'SUPERMARKET', 'PHARMACY', 'RESTAURANT'].includes(vendorData.businessType)) {
      if (!formData.price || !formData.quantity) {
        toast.error('Price and Quantity are required.');
        return;
      }
    }

    try {
      setIsCreatingProduct(true);

      let payload: any;
      let endpoint: string;

      if (eventsCategories.includes(vendorData.businessType)) {
        // Events payload - matching the working format
        payload = {
          productName: formData.productName,
          categoryName: vendorData.businessType,
          description: formData.description,
          vendorId: vendorData.id,
          quantity: formData.quantity ? parseInt(formData.quantity) : 0,
          price: formData.price ? parseFloat(formData.price) : 0,
          productType: formData.productType || 'GENERAL_PRODUCT',
          eventDate: formData.eventDate,
          eventTime: formData.eventTime ? (formData.eventTime.includes(':') && formData.eventTime.split(':').length === 2 ? `${formData.eventTime}:00` : formData.eventTime) : '', // Ensure HH:MM:SS format
          eventEndDate: formData.eventEndDate,
          eventEndTime: formData.eventEndTime ? (formData.eventEndTime.includes(':') && formData.eventEndTime.split(':').length === 2 ? `${formData.eventEndTime}:00` : formData.eventEndTime) : '', // Ensure HH:MM:SS format
          eventType: formData.eventType || 'PAID',
          venue: formData.venue || '',
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : 0, // int32
          ageRestriction: formData.ageRestriction || '',
          dressCode: formData.dressCode || ''
        };
        
        // Add subcategory field only if it exists
        if (formData.subcategoryId) {
          payload.subcategoryId = formData.subcategoryId;
        }
        
        endpoint = '/api/v1/product/create/event';
      } else if (accommodationCategories.includes(vendorData.businessType)) {
        // Accommodation payload
        payload = {
          vendorId: vendorData.id,
          propertyType: formData.propertyType || '',
          listingType: formData.listingType || '',
          description: formData.description || '',
          address: formData.address || '',
          propertyName: formData.propertyName || '',
          dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : 0,
          maxGuests: formData.maxGuests ? parseInt(formData.maxGuests) : 0,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
          totalArea: formData.totalArea || '',
          furnishingStatus: formData.furnishingStatus || '',
          amenities: Array.isArray(formData.amenities) ? formData.amenities : [],
          floorNumber: formData.floorNumber || '',
          parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : 0,
          checkInTime: formData.checkInTime || '',
          checkOutTime: formData.checkOutTime || '',
          houseRules: Array.isArray(formData.houseRules) ? formData.houseRules : [],
          cancellationPolicy: formData.cancellationPolicy || '',
          availableStartDate: formData.availableStartDate || '',
          availableEndDate: formData.availableEndDate || ''
        };
        
        // Add subcategory field only if it exists
        if (formData.subcategoryId) {
          payload.subcategoryId = formData.subcategoryId;
        }
        
        endpoint = '/api/v1/product/create/accomodation';
      } else if (hotelCategories.includes(vendorData.businessType)) {
        // Hotel payload
        payload = {
          vendorId: vendorData.id,
          productName: formData.productName,
          subcategoryId: formData.subcategoryId || 9007199254740991,
          description: formData.description || '',
          address: formData.address || '',
          price: formData.price ? parseFloat(formData.price) : 0,
          checkInTime: formData.checkInTime || '',
          checkOutTime: formData.checkOutTime || '',
          propertyAmenities: Array.isArray(formData.propertyAmenities) ? formData.propertyAmenities : [],
          availableStartDate: formData.availableStartDate || '',
          availableEndDate: formData.availableEndDate || '',
          cancellationPolicy: formData.cancellationPolicy || ''
        };
        
        endpoint = '/api/v1/product/create/hotel';
      } else if (reservationCategories.includes(vendorData.businessType)) {
        // Reservation payload
        payload = {
          vendorId: vendorData.id,
          productName: formData.productName || '',
          categoryName: vendorData.businessType,
          description: formData.description || '',
          address: formData.address || '',
          productType: formData.productType || '',
          serviceType: formData.serviceType || '',
          cuisineType: Array.isArray(formData.cuisineType) ? formData.cuisineType : [],
          operatingHours: formData.operatingHours ? parseInt(formData.operatingHours) : 0,
          tableCapacity: formData.tableCapacity ? parseInt(formData.tableCapacity) : 0,
          reservationFee: formData.reservationFee ? parseFloat(formData.reservationFee) : 0,
          reservationDuration: formData.reservationDuration ? parseInt(formData.reservationDuration) : 0,
          acceptsWalkIns: formData.acceptsWalkIns,
          dressCode: formData.dressCode || '',
          specialFeatures: Array.isArray(formData.specialFeatures) ? formData.specialFeatures : [],
          availableStartDate: formData.availableStartDate || '',
          availableEndDate: formData.availableEndDate || ''
        };
        
        // Add subcategory field only if it exists
        if (formData.subcategoryId) {
          payload.subcategoryId = formData.subcategoryId;
        }
        
        endpoint = '/api/v1/product/create/reservation';
      } else if (carCategories.includes(vendorData.businessType)) {
        // Car rental payload - matching API specification
        payload = {
          vendorId: vendorData.id,
          productName: formData.productName,
          categoryName: vendorData.businessType,
          description: formData.description || '',
          address: formData.address || '',
          price: formData.price ? parseFloat(formData.price) : 0,
          carMake: formData.carMake || '',
          carModel: formData.carModel || '',
          carYear: formData.carYear ? parseInt(formData.carYear) : 0,
          licensePlate: formData.licensePlate || '',
          carType: formData.carType || '',
          seats: formData.seats ? parseInt(formData.seats) : 0,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
          dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : 0,
          monthlyRate: formData.monthlyRate ? parseFloat(formData.monthlyRate) : 0,
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : 0,
          hasDriver: formData.hasDriver === 'true' || formData.hasDriver === true,
          availableDays: Array.isArray(formData.availableDays) ? formData.availableDays : [],
          availableHours: {
            start: formData.availableHoursStart || '',
            end: formData.availableHoursEnd || ''
          },
          termsAndConditions: formData.termsAndConditions || '',
          addons: Array.isArray(formData.addons) ? formData.addons.map(addon => ({
            name: addon.name || '',
            price: addon.price ? parseFloat(addon.price) : 0,
            description: addon.description || ''
          })) : []
        };
        
        // Add subcategory field only if it exists
        if (formData.subcategoryId) {
          payload.subcategoryId = formData.subcategoryId;
        }
        
        endpoint = '/api/v1/product/create/car';
      } else {
        // Create product payload
        payload = {
          productName: formData.productName,
          categoryName: vendorData.businessType,
          vendorId: vendorData.id,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price)
        };
        
        // Add subcategory field only if it exists
        if (formData.subcategoryId) {
          payload.subcategoryId = formData.subcategoryId;
        }
        
        endpoint = '/api/v1/product/create';
      }

      console.log('Creating product with payload:', payload);
      console.log('Time format verification:', {
        eventTime: formData.eventTime,
        convertedEventTime: formData.eventTime ? (formData.eventTime.includes(':') && formData.eventTime.split(':').length === 2 ? `${formData.eventTime}:00` : formData.eventTime) : '',
        eventEndTime: formData.eventEndTime,
        convertedEventEndTime: formData.eventEndTime ? (formData.eventEndTime.includes(':') && formData.eventEndTime.split(':').length === 2 ? `${formData.eventEndTime}:00` : formData.eventEndTime) : ''
      });

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
        const productId = data.data?.productId;
        if (productId) {
          console.log('Product created successfully, showing scroll prompt');
          setCreatedProductId(productId);
          setShowScrollPrompt(true);
          setUploadProgress('Product created successfully!');
          toast.success('Product created successfully! Scroll up to upload images or skip to manage store.');
        } else {
          throw new Error('Product ID not returned from server');
        }
      } else {
        throw new Error(data.responseMessage || 'Failed to create product');
      }
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error instanceof Error ? error.message : 'Error creating product');
      setUploadProgress('');
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
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Left Column - Product Details */}
              <div className="flex-1">
                {/* Product Details Card */}
                <div className="bg-white rounded-[16px] sm:rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-4 sm:p-6">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="h-7">
                      <h2 className="text-[20px] sm:text-[24px] font-bold text-[#212121] font-urbanist leading-[1.17]">
                        Product Details
                      </h2>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Business Type Display */}
                      <div className="w-full max-w-[450px]">
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-[14px] sm:text-[16px] font-normal text-[#616161] font-urbanist">
                            Business Type
                          </label>
                        </div>
                        <div className="w-full h-12 px-4 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[8px] flex items-center">
                          <span className="text-[14px] sm:text-[16px] font-bold text-[#212121] font-urbanist">
                            {vendorData?.businessType ? formatBusinessType(vendorData.businessType) : 'Loading...'}
                          </span>
                        </div>
                      </div>


                      {/* Dynamic Form Fields based on business type */}
                      {vendorData?.businessType && (
                        <DynamicForm
                          businessType={vendorData.businessType}
                          formData={formData}
                          onInputChange={handleInputChange}
                          onNext={handleSubmit}
                          subcategories={subcategories}
                          subcategoriesLoading={subcategoriesLoading}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Inventory and Upload Image */}
              <div className="flex-1 space-y-4 sm:space-y-6">
                {/* Pricing & Inventory Card - Only show for create-product business types */}
                {vendorData?.businessType && ['OTHERS', 'SUPERMARKET', 'PHARMACY', 'RESTAURANT'].includes(vendorData.businessType) && (
                  <div className="bg-white rounded-[16px] sm:rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
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

                {/* Upload Image Card - Only show after product creation */}
                {showUploadArea && (
                  <div id="upload-area" className="bg-white rounded-[16px] sm:rounded-[24px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.1)] p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Header */}
                      <div className="h-7 text-center">
                        <h2 className="text-[20px] sm:text-[24px] font-bold text-[#212121] font-urbanist leading-[1.17]">
                          Upload Images
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
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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

                      {/* Upload Progress Message */}
                      {uploadProgress && (
                        <div className={`rounded-[8px] p-3 ${
                          uploadProgress.includes('successfully') 
                            ? 'bg-[#D4EDDA] border border-[#C3E6CB]' 
                            : uploadProgress.includes('Failed') 
                            ? 'bg-[#F8D7DA] border border-[#F5C6CB]'
                            : 'bg-[#D1ECF1] border border-[#BEE5EB]'
                        }`}>
                          <p className={`text-[12px] font-urbanist text-center ${
                            uploadProgress.includes('successfully') 
                              ? 'text-[#155724]' 
                              : uploadProgress.includes('Failed') 
                              ? 'text-[#721C24]'
                              : 'text-[#0C5460]'
                          }`}>
                            {uploadProgress}
                          </p>
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="w-full">
                        <button
                          type="button"
                          onClick={() => createdProductId && handleUploadImages(createdProductId)}
                          disabled={isUploadingImages || formData.images.length === 0}
                          className={`w-full h-[44px] sm:h-[48px] text-white text-[14px] sm:text-[16px] font-semibold font-urbanist rounded-[60px] transition-colors duration-200 flex items-center justify-center ${
                            isUploadingImages || formData.images.length === 0
                              ? 'bg-[#BDBDBD] cursor-not-allowed'
                              : 'bg-[#6CC049] hover:bg-[#5AA03A]'
                          }`}
                        >
                          {isUploadingImages ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Uploading Images...
                            </div>
                          ) : formData.images.length === 0 ? (
                            'Select images first'
                          ) : (
                            `Upload ${formData.images.length} Image${formData.images.length > 1 ? 's' : ''}`
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scroll Prompt - Show after product creation */}
            {showScrollPrompt && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-[16px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] p-4 sm:p-6 max-w-sm w-full mx-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#6CC049] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#212121] font-urbanist mb-2">
                    Product Created Successfully!
                  </h3>
                  <p className="text-sm text-[#616161] font-urbanist mb-4">
                    Would you like to upload images to showcase your listing?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={scrollToUploadArea}
                      className="flex-1 h-10 bg-[#6CC049] text-white text-sm font-semibold font-urbanist rounded-[8px] hover:bg-[#5AA03A] transition-colors"
                    >
                      Upload Images
                    </button>
                    <button
                      onClick={skipToManageStore}
                      className="flex-1 h-10 border border-[#E0E0E0] text-[#616161] text-sm font-semibold font-urbanist rounded-[8px] hover:bg-[#F5F5F5] transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>
                </div>
              </div>
            )}


            {/* Submit Button - Only show for supported business types and when upload area is not visible */}
            {!showUploadArea && vendorData?.businessType && (['OTHERS', 'SUPERMARKET', 'PHARMACY', 'RESTAURANT'].includes(vendorData.businessType) || ['EVENTS', 'EXPERIENCES', 'TOUR_GUIDE', 'INFLUENCER'].includes(vendorData.businessType) || ['HOTEL', 'HOSPITALITY', 'APARTMENT'].includes(vendorData.businessType) || ['CLUB', 'RESERVATIONS'].includes(vendorData.businessType) || ['CARS'].includes(vendorData.businessType)) && (
              <div className="w-full">
                <button
                  type="submit"
                  disabled={isCreatingProduct || isUploadingImages || vendorLoading || !vendorData?.id}
                  className={`w-full h-[44px] sm:h-[48px] lg:h-[52px] text-white text-[14px] sm:text-[16px] lg:text-[20px] font-semibold font-urbanist rounded-[60px] transition-colors duration-200 flex items-center justify-center ${
                    isCreatingProduct || isUploadingImages || vendorLoading || !vendorData?.id
                      ? 'bg-[#BDBDBD] cursor-not-allowed'
                      : 'bg-[#6CC049] hover:bg-[#5AA03A]'
                  }`}
                >
                  {isCreatingProduct ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Product...
                    </div>
                  ) : isUploadingImages ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading Images...
                    </div>
                  ) : vendorLoading ? (
                    'Loading...'
                  ) : !vendorData?.id ? (
                    'Vendor data unavailable'
                  ) : (
                    'Next'
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
        vendorId={vendorData?.id || 0}
      />

      {/* Product Success Modal */}
      <ProductSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* Ticket Creation Modal */}
      <TicketCreationModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        onSuccess={handleTicketSuccess}
        eventId={eventId || 0}
        eventName={formData.productName || 'Event'}
      />

      {/* Room Creation Modal */}
      <RoomCreationModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onSuccess={handleRoomSuccess}
        hotelId={hotelId || 0}
        hotelName={formData.productName || 'Hotel'}
      />
    </DashboardLayout>
  );
};

export default CreateProductPage;