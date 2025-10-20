'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UpdateProductIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to manage store if no product ID is provided
    router.push('/vendor/manage-store');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">Please select a product to update.</p>
      </div>
    </div>
  );
};

export default UpdateProductIndex;
