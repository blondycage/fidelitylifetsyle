'use client';
import React, { useState } from 'react';
import { CloseCircle, TickCircle } from 'iconsax-react';
import toast from 'react-hot-toast';

interface RoomCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hotelId: number;
  hotelName: string;
}

const RoomCreationModal: React.FC<RoomCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hotelId,
  hotelName
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    roomTypeName: '',
    dailyRate: '',
    capacity: '',
    totalRooms: '',
    availableRooms: '',
    amenities: [] as string[]
  });
  const [newAmenity, setNewAmenity] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomTypeName || !formData.dailyRate || !formData.capacity || !formData.totalRooms || !formData.availableRooms) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);

      const payload = {
        hotelId: hotelId,
        roomTypeName: formData.roomTypeName,
        dailyRate: parseFloat(formData.dailyRate),
        capacity: parseInt(formData.capacity),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        amenities: formData.amenities
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/product/create/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.responseCode === 200) {
        toast.success('Room created successfully!');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          roomTypeName: '',
          dailyRate: '',
          capacity: '',
          totalRooms: '',
          availableRooms: '',
          amenities: []
        });
      } else {
        throw new Error(data.responseMessage || 'Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error(error instanceof Error ? error.message : 'Error creating room');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#212121] font-urbanist">
            Create Room Type
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseCircle size={24} color="currentColor" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Hotel:</strong> {hotelName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Type Name */}
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-2">
              Room Type Name *
            </label>
            <input
              type="text"
              value={formData.roomTypeName}
              onChange={(e) => handleInputChange('roomTypeName', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-sm font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
              placeholder="e.g., Deluxe Suite, Standard Room"
              required
            />
          </div>

          {/* Daily Rate */}
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-2">
              Daily Rate (₦) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.dailyRate}
              onChange={(e) => handleInputChange('dailyRate', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-sm font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
              placeholder="Enter daily rate"
              required
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-2">
              Capacity (guests) *
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-sm font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
              placeholder="Enter room capacity"
              required
            />
          </div>

          {/* Total Rooms */}
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-2">
              Total Rooms *
            </label>
            <input
              type="number"
              value={formData.totalRooms}
              onChange={(e) => handleInputChange('totalRooms', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-sm font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
              placeholder="Enter total number of rooms"
              required
            />
          </div>

          {/* Available Rooms */}
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-2">
              Available Rooms *
            </label>
            <input
              type="number"
              value={formData.availableRooms}
              onChange={(e) => handleInputChange('availableRooms', e.target.value)}
              className="w-full h-12 px-4 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-sm font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
              placeholder="Enter available rooms"
              required
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-2">
              Room Amenities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1 h-10 px-3 bg-[#EEEEEE] border border-[#EEEEEE] rounded-[8px] text-sm font-urbanist text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6CC049] focus:ring-1 focus:ring-[#6CC049]"
                placeholder="Add amenity (e.g., WiFi, TV, Mini-bar)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 h-10 bg-[#6CC049] text-white rounded-[8px] text-sm font-medium hover:bg-[#5AA03A] transition-colors"
              >
                Add
              </button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-[8px] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`flex-1 h-12 text-white rounded-[8px] font-medium transition-colors flex items-center justify-center gap-2 ${
                isCreating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#6CC049] hover:bg-[#5AA03A]'
              }`}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <TickCircle size={16} color="white" />
                  Create Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomCreationModal;
