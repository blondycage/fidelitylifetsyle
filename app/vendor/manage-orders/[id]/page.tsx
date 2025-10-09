'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowDown } from 'iconsax-react';
import toast from 'react-hot-toast';

interface OrderDetails {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Delivered';
  paymentMode: string;
  deliveryAddress: string;
  deliveryMethod: string;
  scheduledDate: string;
  specialInstructions: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  serviceFee: number;
  discount: number;
  total: number;
}

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [description, setDescription] = useState('');

  // Load order details
  useEffect(() => {
    const loadOrderDetails = () => {
      // Mock data - in real app, fetch from API
      const mockOrderDetails: OrderDetails = {
        id: orderId,
        orderId: '#123456',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+234 123456789',
        status: 'Pending',
        paymentMode: 'Mastercard',
        deliveryAddress: '12 Adeola Street, Lagos',
        deliveryMethod: 'Home Delivery',
        scheduledDate: '16th sept 2025, 2:00pm',
        specialInstructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        items: [
          { name: 'Deluxe suite (2 nights)', price: 200000, quantity: 1 },
          { name: 'Deluxe suite (2 nights)', price: 200000, quantity: 1 },
          { name: 'Deluxe suite (2 nights)', price: 200000, quantity: 1 },
          { name: 'Deluxe suite (2 nights)', price: 200000, quantity: 1 }
        ],
        subtotal: 800000,
        serviceFee: 38000,
        discount: 15,
        total: 712300
      };
      
      setOrderDetails(mockOrderDetails);
      setStatus(mockOrderDetails.status);
      setIsLoading(false);
    };

    loadOrderDetails();
  }, [orderId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock save - in real app, call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccept = () => {
    setStatus('Accepted');
    toast.success('Order accepted');
  };

  const handleReject = () => {
    setStatus('Rejected');
    toast.success('Order rejected');
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Order Details" pageDescription="Loading order details...">
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#6CC049] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!orderDetails) {
    return (
      <DashboardLayout pageTitle="Order Details" pageDescription="Order not found">
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Order not found</p>
            <button
              onClick={() => router.push('/vendor/manage-orders')}
              className="px-6 py-2 bg-[#6CC049] text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Order Details" pageDescription="View and manage order details">
      <div className="bg-[#FBFFF9] min-h-screen">
        <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/vendor/manage-orders')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <img src="/images/arrow-left-icon.svg" alt="Back" className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-black">Order Details</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Order Details Card */}
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
            {/* Customer Details Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#212121] mb-6">Customer Details</h2>
              
              <div className="bg-[#E2F2DB] rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-lg font-semibold">J</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#212121] mb-2">{orderDetails.customerName}</h3>
                    <div className="flex items-center gap-3 text-[#424242]">
                      <span>{orderDetails.customerEmail}</span>
                      <span>•</span>
                      <span>{orderDetails.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#757575] text-sm">Status</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
                      <span className="w-2 h-2 rounded-full bg-orange-600 mr-2"></span>
                      {status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#757575] text-sm">Order ID</span>
                    <span className="text-[#757575] text-sm">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#757575] text-sm">Customer Name</span>
                    <span className="text-[#757575] text-sm">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#757575] text-sm">Customer Email</span>
                    <span className="text-[#757575] text-sm">{orderDetails.customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#757575] text-sm">Payment Mode</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#757575] text-sm">{orderDetails.paymentMode}</span>
                      <img src="/images/mastercard-icon.svg" alt="Mastercard" className="w-5 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#212121] mb-6">Delivery Information</h2>
              
              <div className="bg-[#E2F2DB] rounded-2xl p-4 mb-6">
                <h3 className="text-xl font-semibold text-[#212121] mb-2">{orderDetails.deliveryAddress}</h3>
                <div className="space-y-2 text-[#424242]">
                  <p>Method: {orderDetails.deliveryMethod}</p>
                  <p>Scheduled: {orderDetails.scheduledDate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#212121]">Special Instructions</h4>
                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <img src="/images/info-circle-icon.svg" alt="Info" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800 text-sm">{orderDetails.specialInstructions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#212121] mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-[#757575] text-sm">{item.name}</span>
                    <span className="text-[#757575] text-sm">₦{item.price.toLocaleString()}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center">
                  <span className="text-[#757575] text-sm">Service fee</span>
                  <span className="text-[#757575] text-sm">₦{orderDetails.serviceFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-[#E0E0E0] pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#757575] text-sm">Total</span>
                    <span className="text-[#757575] text-sm">₦{orderDetails.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#757575] text-sm">Discount</span>
                    <span className="text-[#757575] text-sm">{orderDetails.discount}%</span>
                  </div>
                </div>
                
                <div className="border-t border-[#E0E0E0] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#212121]">Total</span>
                    <span className="text-xl font-semibold text-[#212121]">₦{orderDetails.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#212121]">Order Status</h2>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-2 bg-[#6CC049] text-white rounded-full text-sm font-semibold hover:bg-[#5AA83A] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <img src="/images/save-button-icon.svg" alt="Save" className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-12 px-4 bg-[#EEEEEE] border border-black rounded-lg text-base font-urbanist text-black focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] appearance-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <img src="/images/arrow-down-icon.svg" alt="Arrow Down" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Upload image <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="deluxekingroom.png"
                      className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-lg text-base font-urbanist text-black focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <img src="/images/export-icon.svg" alt="Export" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#616161] mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="/"
                    className="w-full px-4 py-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-lg text-base font-urbanist text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleReject}
                className="flex-1 h-13 bg-red-100 text-red-500 border-2 border-red-200 rounded-full text-lg font-semibold hover:bg-red-200 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 h-13 bg-[#6CC049] text-white rounded-full text-lg font-semibold hover:bg-[#5AA83A] transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;