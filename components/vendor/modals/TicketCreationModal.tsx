'use client';
import React, { useState } from 'react';
import { createTicket, TicketCreateRequest } from '@/services/productService';
import toast from 'react-hot-toast';

interface TicketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  eventId: number;
  eventName: string;
}

const TicketCreationModal: React.FC<TicketCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  eventId,
  eventName
}) => {
  console.log('TicketCreationModal rendered with productId:', productId, 'eventId:', eventId, 'eventName:', eventName);
  console.log('TicketCreationModal - productId type:', typeof productId, 'eventId type:', typeof eventId);
  const [formData, setFormData] = useState({
    price: '',
    quantity: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.price || !formData.quantity || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!productId || productId === 0) {
      toast.error('Product ID is required for ticket creation');
      return;
    }

    if (!eventId || eventId === 0) {
      toast.error('Event ID is required for ticket creation');
      return;
    }

    try {
      setIsCreating(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const ticketData: TicketCreateRequest = {
        productId,
        eventId,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description
      };
      
      console.log('Creating ticket with data:', ticketData);

      const response = await createTicket(ticketData, token);
      
      if (response.responseCode === 200) {
        toast.success('Ticket created successfully!');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.responseMessage || 'Failed to create ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error instanceof Error ? error.message : 'Error creating ticket');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkip = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4" style={{ minHeight: '100vh' }}>
      <div className="bg-white rounded-[16px] w-full max-w-[500px] p-6 relative">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#6CC049] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#212121] font-urbanist mb-2">
            Create Event Ticket
          </h2>
          <p className="text-[#616161] font-urbanist">
            Add ticket details for <span className="font-semibold text-[#212121]">"{eventName}"</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-[#212121] font-urbanist mb-2">
              Ticket Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#616161] font-urbanist">₦</span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full h-12 pl-8 pr-4 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-[#212121] font-urbanist mb-2">
              Available Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full h-12 px-4 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#212121] font-urbanist mb-2">
              Ticket Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full h-24 px-4 py-3 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[8px] text-[16px] font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049] resize-none"
              placeholder="Describe what this ticket includes..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 h-12 border-2 border-[#E0E0E0] text-[#616161] rounded-[8px] font-semibold font-urbanist hover:bg-[#F5F5F5] transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`flex-1 h-12 text-white rounded-[8px] font-semibold font-urbanist transition-colors ${
                isCreating
                  ? 'bg-[#BDBDBD] cursor-not-allowed'
                  : 'bg-[#6CC049] hover:bg-[#5AA03A]'
              }`}
            >
              {isCreating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCreationModal;