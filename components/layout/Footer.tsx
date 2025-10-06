'use client';

import Image from 'next/image';
import Link from 'next/link';
// Using SVG assets from Figma for social icons to match design

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA]">
      {/* Top Content */}
      <div className="max-w-[1440px] mx-auto px-[60px] pt-[120px]">
        <div className="flex flex-col lg:flex-row justify-between gap-[60px]">
          {/* Left: Logo and copy */}
          <div className="w-full max-w-[536px] space-y-6">
            <div className="relative w-[140.77px] h-[60px]">
              <Image src="/images/logo-web-footer.svg" alt="Naija Connect" fill className="object-contain" />
            </div>
            <div className="space-y-2">
              <h4 className="font-urbanist font-semibold text-[24px] text-black">
                Transform Your Neighborhood Experience
              </h4>
              <p className="text-[#616161] text-[16px] leading-[1.4]">
                Whether you're seeking new experiences or offering them, our platform is your gateway to a more connected community.
              </p>
            </div>

            {/* Store buttons */}
            <div className="flex items-center gap-3">
              <a href="#" className="h-10 inline-flex items-center">
                <img src="/images/footer-badge-google-play.svg" alt="Get it on Google Play" className="h-10 w-auto" />
              </a>
              <a href="#" className="h-10 inline-flex items-center">
                <img src="/images/footer-badge-app-store.svg" alt="Download on the App Store" className="h-10 w-auto" />
              </a>
            </div>
          </div>

          {/* Right: Link columns */}
          <div className="flex flex-wrap gap-[60px]">
            {/* About */}
            <div className="space-y-4">
              <div className="font-urbanist font-semibold text-[20px] text-black">ABOUT NAIJA CONNECT</div>
              <div className="flex flex-col gap-3">
                {['About Us','Sell With Us','Advertise on Naija Connect','Privacy Policy','Payment Options','Terms & Conditions'].map((text) => (
                  <Link key={text} href="#" className="text-[#9E9E9E] text-[20px] font-urbanist font-semibold hover:text-black">
                    {text}
                  </Link>
                ))}
              </div>
            </div>
            {/* Customer Service */}
            <div className="space-y-4">
              <div className="font-urbanist font-semibold text-[20px] text-black">CUSTOMER SERVICE</div>
              <div className="flex flex-col gap-3">
                {['Your Account','Your Orders','Return / Replacements','Delivery Information','Contact Us','FAQs'].map((text) => (
                  <Link key={text} href="#" className="text-[#9E9E9E] text-[20px] font-urbanist font-semibold hover:text-black">
                    {text}
                  </Link>
                ))}
              </div>
            </div>
            {/* Address (Lagos) */}
            <div className="space-y-4 max-w-[320px]">
              <div className="font-urbanist font-semibold text-[20px] text-black">ADDRESS</div>
              <div className="text-[#9E9E9E] text-[20px] font-urbanist font-semibold leading-snug">
                22A Admiralty Way, Lekki Phase 1,
                Lagos, Nigeria.
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-[40px] border-t border-[#E0E0E0]" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[#9E9E9E] text-[20px] font-urbanist font-bold">© 2025 Fidelity. All rights reserved.</div>
          <div className="flex items-center gap-6">
            {[
              { src: '/images/icon-linkedin.svg', alt: 'LinkedIn' },
              { src: '/images/icon-facebook.svg', alt: 'Facebook' },
              { src: '/images/icon-whatsapp.svg', alt: 'WhatsApp' },
              { src: '/images/icon-twitter.svg', alt: 'Twitter' },
              { src: '/images/icon-instagram.svg', alt: 'Instagram' },
            ].map((icon) => (
              <a key={icon.alt} href="#" className="hover:opacity-80 transition-opacity" aria-label={icon.alt}>
                <Image src={icon.src} alt={icon.alt} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
