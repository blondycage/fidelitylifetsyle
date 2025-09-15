'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';

const Signup = () => {
  const router = useRouter();

  return (
    <AuthLayout
      title="Join Fidelity Lifestyle"
      subtitle="Choose how you'd like to get started"
    >
      <div className="space-y-6">
        {/* Customer Option */}
        <div
          onClick={() => router.push('/signup/customer')}
          className="group cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-[var(--blueHex)] rounded-xl p-6 transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[var(--blueHex)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--blueHex)] group-hover:text-blue-700">
                Join as Customer
              </h3>
              <p className="text-sm text-[var(--greyHex)] mt-1">
                Explore restaurants, hotels, events, and lifestyle experiences
              </p>
            </div>
            <div className="text-[var(--blueHex)] group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Vendor Option */}
        <div
          onClick={() => router.push('/signup/vendor')}
          className="group cursor-pointer bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-[var(--greenHex)] rounded-xl p-6 transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[var(--greenHex)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--greenHex)] group-hover:text-green-700">
                Join as Vendor
              </h3>
              <p className="text-sm text-[var(--greyHex)] mt-1">
                List your business and start offering services to customers
              </p>
            </div>
            <div className="text-[var(--greenHex)] group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-[var(--blueHex)] mb-3">
            Why choose Fidelity Lifestyle?
          </h4>
          <div className="space-y-2 text-sm text-[var(--greyHex)]">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-3"></div>
              <span>Trusted by Fidelity Bank customers</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-3"></div>
              <span>Secure payments and transactions</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-3"></div>
              <span>Premium lifestyle experiences</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[var(--greenHex)] rounded-full mr-3"></div>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <span className="text-sm text-[var(--greyHex)]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="text-[var(--blueHex)] hover:underline font-medium"
            >
              Sign in
            </button>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;