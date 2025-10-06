'use client';

import Link from 'next/link';
import { ArrowRight } from 'iconsax-react';

type StepCard = {
  stepNumber: number;
  title: string;
  description: string;
};

const STEP_CARDS: StepCard[] = [
  {
    stepNumber: 1,
    title: 'Setup Your Store',
    description:
      'Create your digital storefront with our easy-to-use tools and start selling in minutes.',
  },
  {
    stepNumber: 2,
    title: 'Grow Your Business',
    description:
      'Access powerful analytics and marketing tools to scale your business effectively.',
  },
  {
    stepNumber: 3,
    title: 'Reach More Customers',
    description:
      'Connect with millions of customers and expand your market reach globally.',
  },
];

export default function VendorSection() {
  return (
    <section id="vendor" className="bg-[#FAFAFA] py-[160px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-[60px] gap-[24px]">
          <h2 className="font-urbanist font-bold text-black text-[40px] md:text-[52px] lg:text-[60px] leading-[1]">
            Become a vendor
          </h2>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-[60px] border-2 border-[#EEEEEE] px-8 py-3 h-[52px] text-black hover:bg-white/60 transition-colors"
          >
            <span className="font-urbanist font-semibold text-[18px]">Get started</span>
            <ArrowRight size={24} />
          </Link>
        </div>

        {/* Subheader */}
        <div className="px-[60px] mt-6">
          <p className="max-w-[760px] text-[#616161] font-urbanist text-[22px] md:text-[32px] lg:text-[40px] leading-[1.2]">
            Enhance business growth and increase brand awareness.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-[52px] px-[60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEP_CARDS.map((card) => (
            <div
              key={card.stepNumber}
              className="h-[208px] w-full max-w-[424px] bg-white rounded-[24px] p-6 shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)] border border-white/90 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6CC049] text-white flex items-center justify-center font-urbanist font-bold text-[18px]">
                  {card.stepNumber}
                </div>
                <h3 className="text-[26px] md:text-[28px] lg:text-[30px] font-bold text-[#6CC049]">
                  {card.title}
                </h3>
              </div>

              <p className="text-[#616161] text-[16px] md:text-[18px] leading-[1.4] text-center">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}