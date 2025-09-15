
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/signin');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] via-[#E6F7FF] to-[#E8FFF1] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--blueHex)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
