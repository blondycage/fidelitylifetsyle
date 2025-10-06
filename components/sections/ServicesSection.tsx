'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function ServicesSection() {
  const orbitHostRef = useRef<HTMLDivElement>(null);
  const [orbitActive, setOrbitActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setOrbitActive(true);
        }
      },
      { threshold: 0.3 }
    );
    if (orbitHostRef.current) observer.observe(orbitHostRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section id="services" className="bg-[#F5F8FF] py-[160px]">
      <div className="max-w-[1440px] mx-auto px-[60px] flex flex-col lg:flex-row items-center justify-between gap-[24px]">
        {/* Left content */}
        <div className="w-full lg:w-[760px] flex flex-col gap-6">
          <h2 className="font-urbanist font-bold text-black text-[40px] md:text-[52px] lg:text-[60px] leading-[1]">
            Create a Fidelity Account
          </h2>
          <p className="text-[#616161] font-urbanist text-[32px] md:text-[46px] lg:text-[56px] tracking-[0.0125em] max-w-[680px] whitespace-normal subt">
            Join millions of satisfied customers and experience seamless banking with premium benefits, zero fees, and 24/7 support.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full max-w-[635px]">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-[60px] bg-[#6CC049] text-white px-8 py-3 h-[52px] w-full sm:w-[308px] font-urbanist font-semibold text-[18px]"
            >
              Create account
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-[60px] border-2 border-[#012168] text-[#012168] px-8 py-3 h-[52px] w-full sm:w-[308px] font-urbanist font-semibold text-[18px]"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right visuals: avatars and gradient orbs */}
        <div ref={orbitHostRef} className="relative w-[460px] h-[440px] shrink-0 mx-auto lg:mx-0">
          {/* Gradient orbs (behind) */}
          <div className="absolute inset-0 z-0">
            {/* Center big orb */}
            <div className="absolute left-[120px] top-[96px] w-[220px] h-[220px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            {/* Small orbs */}
            <div className="absolute left-[260px] top-[26px] w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[16px] top-0 w-[28px] h-[28px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[8px] top-[186px] w-[14px] h-[14px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[240px] top-[225px] w-[7px] h-[7px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[150px] top-[3px] w-[7px] h-[7px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[90px] top-[250px] w-[10px] h-[10px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[185px] top-[245px] w-[3px] h-[3px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-[250px] top-[160px] w-[7px] h-[7px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
            <div className="absolute left-0 top-[110px] w-[3px] h-[3px] rounded-full bg-gradient-to-r from-[rgba(203,255,182,1)] to-[rgba(161,190,255,1)]"></div>
          </div>

          {/* Avatars (above) - staggered pop-in from center to orbit (no loop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] z-10 pointer-events-none">
            {/* Avatar 1 - angle 35°, radius 120 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                 style={{ transform: 'rotate(35deg)' }}>
              <div className={["origin-left", orbitActive ? 'animate-[radialPop_650ms_cubic-bezier(0.2,0.8,0.2,1)_0ms_both]' : 'opacity-0'].join(' ')}
                   style={{ ['--radius' as any]: '120px' }}>
                <div className="w-16 h-16 rounded-full bg-[#F3F3F3] overflow-hidden" style={{ transform: 'rotate(-35deg)' }}>
                  <Image src="/images/avatar-1.png" alt="avatar 1" width={64} height={64} className="object-cover" />
                </div>
              </div>
            </div>

            {/* Avatar 2 - angle 110°, radius 160 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                 style={{ transform: 'rotate(110deg)' }}>
              <div className={["origin-left", orbitActive ? 'animate-[radialPop_650ms_cubic-bezier(0.2,0.8,0.2,1)_120ms_both]' : 'opacity-0'].join(' ')}
                   style={{ ['--radius' as any]: '160px' }}>
                <div className="w-16 h-16 rounded-full bg-[#F3F3F3] overflow-hidden" style={{ transform: 'rotate(-110deg)' }}>
                  <Image src="/images/avatar-2.png" alt="avatar 2" width={64} height={64} className="object-cover" />
                </div>
              </div>
            </div>

            {/* Avatar 3 - angle 200°, radius 180 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                 style={{ transform: 'rotate(200deg)' }}>
              <div className={["origin-left", orbitActive ? 'animate-[radialPop_650ms_cubic-bezier(0.2,0.8,0.2,1)_240ms_both]' : 'opacity-0'].join(' ')}
                   style={{ ['--radius' as any]: '180px' }}>
                <div className="w-16 h-16 rounded-full bg-[#F3F3F3] overflow-hidden" style={{ transform: 'rotate(-200deg)' }}>
                  <Image src="/images/avatar-3.png" alt="avatar 3" width={64} height={64} className="object-cover" />
                </div>
              </div>
            </div>

            {/* Avatar 4 - angle 300°, radius 135 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                 style={{ transform: 'rotate(300deg)' }}>
              <div className={["origin-left", orbitActive ? 'animate-[radialPop_650ms_cubic-bezier(0.2,0.8,0.2,1)_360ms_both]' : 'opacity-0'].join(' ')}
                   style={{ ['--radius' as any]: '135px' }}>
                <div className="w-16 h-16 rounded-full bg-[#F3F3F3] overflow-hidden" style={{ transform: 'rotate(-300deg)' }}>
                  <Image src="/images/avatar-4.png" alt="avatar 4" width={64} height={64} className="object-cover" />
                </div>
              </div>
            </div>

            {/* Avatar 5 - angle 340°, radius 165 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                 style={{ transform: 'rotate(340deg)' }}>
              <div className={["origin-left", orbitActive ? 'animate-[radialPop_650ms_cubic-bezier(0.2,0.8,0.2,1)_480ms_both]' : 'opacity-0'].join(' ')}
                   style={{ ['--radius' as any]: '165px' }}>
                <div className="w-16 h-16 rounded-full bg-[#F3F3F3] overflow-hidden" style={{ transform: 'rotate(-340deg)' }}>
                  <Image src="/images/avatar-5.png" alt="avatar 5" width={64} height={64} className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
