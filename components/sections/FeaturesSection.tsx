'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'iconsax-react';

const cards = [
  {
    title: 'Smart Discovery',
    description:
      'AI-powered recommendations based on your preferences and location when you log in',
    icon: '/images/icon-diamond.svg',
  },
  {
    title: 'Real-time Updates',
    description:
      'Stay in the know with live updates on availability, special offers, and last minute events. You’ll always have the latest information with us',
    icon: '/images/icon-clock-1.svg',
  },
  {
    title: 'Verified Reviews',
    description:
      'Get trustworthy insights from real neighbors who has experienced the services, businesses, and events around you',
    icon: '/images/icon-star.svg',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#FAFAFA] py-[160px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-[60px] gap-[24px]">
          <h2 className="font-urbanist font-bold text-black text-[40px] md:text-[52px] lg:text-[60px] leading-[1]">
            Why Choose Our Platform
          </h2>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-[60px] border-2 border-[#EEEEEE] px-8 py-3 text-black hover:bg-white/60 transition-colors"
          >
            <span className="font-urbanist font-semibold text-[16px] md:text-[18px]">
              Get started
            </span>
            <ArrowRight size={24} />
          </Link>
        </div>

        {/* Subheader */}
        <div className="px-[60px] mt-6">
          <p className="max-w-[760px] text-[#616161] font-urbanist text-[22px] md:text-[32px] lg:text-[40px] leading-[1.2]">
            We make discovering and connecting with local lifestyle vendors effortless and enjoyable.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-[52px] grid grid-cols-1 md:grid-cols-3 gap-4 px-[60px]">
          {cards.map((card) => (
            <div
              key={card.title}
              className="h-[240px] w-full max-w-[424px] bg-white/90 border border-white shadow-[0_0_8px_4px_rgba(255,255,255,0.25)] rounded-[32px] p-8 flex flex-col items-center gap-6"
            >
              {/* Icon */}
              <div className="w-[60px] h-[60px] rounded-[12px] bg-[rgba(77,194,71,0.10)] flex items-center justify-center">
                <Image src={card.icon} alt={card.title} width={36} height={36} />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center text-center gap-2">
                <h3 className="font-urbanist font-bold text-[20px] leading-[1.2] text-black">
                  {card.title}
                </h3>
                <p className="font-urbanist text-[16px] leading-[1.25] tracking-[0.0125em] text-[#616161]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
