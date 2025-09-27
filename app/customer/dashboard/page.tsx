'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CustomerDashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      if (!token || userType !== 'CUSTOMER') {
        router.push('/signin');
        return;
      }

      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    router.push('/signin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[var(--blueHex)] font-urbanist">
                  Fidelity
                </h1>
              </div>
              <div className="ml-10">
                <nav className="flex space-x-8">
                  <a href="#" className="text-[var(--blueHex)] font-medium">Home</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)]">Explore</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)]">Bookings</a>
                  <a href="#" className="text-[var(--greyHex)] hover:text-[var(--blueHex)]">Profile</a>
                </nav>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[var(--greyHex)] hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-[var(--blueHex)] mb-2 font-urbanist">
              Welcome to Fidelity Lifestyle!
            </h2>
            <p className="text-[var(--greyHex)] mb-4 font-urbanist">
              Discover amazing experiences, restaurants, hotels, and events.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--blueHex)] mb-2">Restaurants</h3>
              <p className="text-sm text-[var(--greyHex)]">Find the best dining experiences</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--blueHex)] mb-2">Hotels</h3>
              <p className="text-sm text-[var(--greyHex)]">Book luxury accommodations</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--blueHex)] mb-2">Events</h3>
              <p className="text-sm text-[var(--greyHex)]">Discover exciting events</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[var(--greenHex)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--blueHex)] mb-2">Experiences</h3>
              <p className="text-sm text-[var(--greyHex)]">Unique lifestyle experiences</p>
            </div>
          </div>

          {/* Featured Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
                alt="Featured Restaurant"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-urbanist">
                  Featured Restaurant
                </h3>
                <p className="text-[var(--greyHex)] text-sm mb-4 font-urbanist">
                  Discover our restaurant of the month with exclusive offers for Fidelity customers.
                </p>
                <button className="bg-[var(--blueHex)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] transition-all duration-200">
                  View Details
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80"
                alt="Upcoming Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--blueHex)] mb-2 font-urbanist">
                  Upcoming Events
                </h3>
                <p className="text-[var(--greyHex)] text-sm mb-4 font-urbanist">
                  Don't miss out on the hottest events happening this month.
                </p>
                <button className="bg-[var(--greenHex)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] transition-all duration-200">
                  Explore Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;