'use client';

import { useMemo, useState } from 'react';

type FaqItem = { question: string; answer: string };

type TabKey = 'customer' | 'vendor';

const CUSTOMER_FAQS: FaqItem[] = [
  {
    question: 'What is Naija Connect?',
    answer:
      'Naija Connect is your one-stop lifestyle and entertainment app for booking events, dining, nightlife, shopping, and making secure payments — all in one place.',
  },
  {
    question: 'How do I create an account?',
    answer:
      'Download the app, tap Sign Up, and register with your email/phone number. You will receive an OTP to verify your account.',
  },
  {
    question: 'How do I book an event or service?',
    answer:
      'Go to Explore → choose an event/service → confirm details (date, time, category) → pay securely in-app → receive instant email & SMS confirmation.',
  },
  {
    question: 'What payment options are available?',
    answer:
      'Pay with your debit/credit card, in‑app wallet, or other supported methods.',
  },
  {
    question: 'Will I receive a booking or payment confirmation?',
    answer:
      'Yes. You’ll receive both email and SMS confirmations instantly after every booking or payment.',
  },
  {
    question: 'How do I request a refund?',
    answer:
      "Refunds depend on the vendor’s policy. Request via My Orders → Select Transaction → Request Refund, or contact support at our listed email/hotline.",
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. We use bank-grade encryption and OTP verification to protect your data and transactions.',
  },
  {
    question: 'What if I don’t receive my OTP or confirmation email?',
    answer:
      'Check your spam/junk folder. If not found, retry the process or contact support.',
  },
];

const VENDOR_FAQS: FaqItem[] = [
  {
    question: 'How can my business join Naija Connect?',
    answer:
      'Register through the onboarding form on our website/app. Once approved, your business will appear on the platform.',
  },
  {
    question: 'What types of vendors can sign up?',
    answer:
      'Hospitality (hotels, restaurants, lounges), Events (concerts, shows, parties), Shopping, and Services (fashion, beauty, fitness), and more.',
  },
  {
    question: 'How will I get paid for bookings and sales?',
    answer:
      'Customer payments are settled into your registered business account (less fees) within the stated settlement window.',
  },
  {
    question: 'Can I manage my listings and pricing?',
    answer:
      'Yes. Use the Vendor Dashboard to upload/update listings, set prices & availability, and track bookings & payments.',
  },
  {
    question: 'How do I confirm or reject a booking?',
    answer:
      'You’ll receive a notification and email for every booking. Accept/decline via the Vendor Dashboard.',
  },
  {
    question: 'What support is available to vendors?',
    answer:
      '24/7 support via email and chat. Premium vendors also have dedicated account managers.',
  },
  {
    question: 'Are there any fees for vendors?',
    answer:
      'A small commission applies per successful transaction. Full details are provided during onboarding.',
  },
  {
    question: 'How do I promote my business on the app?',
    answer:
      'Subscribe to promotional packages for featured listings, banners, and campaigns to boost visibility.',
  },
];

function FaqRow({ item, isActive, onClick }: { item: FaqItem; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left rounded-2xl px-6 py-5 transition-colors border',
        isActive ? 'bg-[#E2F2DB] border-[#E2F2DB]' : 'bg-white border-transparent',
      ].join(' ')}
    >
      <div
        className={[
          'font-urbanist text-[18px] md:text-[20px] font-bold',
          isActive ? 'text-[#366024]' : 'text-[#9E9E9E]',
        ].join(' ')}
      >
        {item.question}
      </div>
    </button>
  );
}

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('customer');
  const [activeIndex, setActiveIndex] = useState(0);

  const data: FaqItem[] = useMemo(() => (activeTab === 'customer' ? CUSTOMER_FAQS : VENDOR_FAQS), [activeTab]);
  const activeItem = data[activeIndex];

  return (
    <section id="faq" className="bg-[#F5F8FF] py-[120px]">
      <div className="max-w-[1440px] mx-auto px-[60px]">
        {/* Tabs */}
        <div className="mb-8 inline-flex rounded-full bg-white p-1 border border-[#E0E0E0]">
          <button
            onClick={() => {
              setActiveTab('customer');
              setActiveIndex(0);
            }}
            className={[
              'px-6 py-2 rounded-full font-urbanist font-semibold',
              activeTab === 'customer' ? 'bg-[#6CC049] text-white' : 'text-[#012168]'
            ].join(' ')}
          >
            Customers
          </button>
          <button
            onClick={() => {
              setActiveTab('vendor');
              setActiveIndex(0);
            }}
            className={[
              'px-6 py-2 rounded-full font-urbanist font-semibold',
              activeTab === 'vendor' ? 'bg-[#6CC049] text-white' : 'text-[#012168]'
            ].join(' ')}
          >
            Vendors
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Question list */}
          <div className="bg-white rounded-[24px] shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)] p-6">
            <h3 className="font-urbanist font-bold text-[40px] leading-[1] text-black mb-6">FAQs</h3>
            <div className="space-y-4">
              {data.map((item, i) => (
                <FaqRow key={i} item={item} isActive={i === activeIndex} onClick={() => setActiveIndex(i)} />
              ))}
            </div>
          </div>

          {/* Right: Answer card */}
          <div className="rounded-[24px] p-6 bg-[#366024] text-white min-h-[391px] flex">
            <div className="my-auto">
              <div className="font-urbanist font-bold text-[32px] md:text-[40px] leading-[1.15] mb-4">Ans.</div>
              <div className="font-urbanist font-semibold text-[20px] md:text-[24px] opacity-90">
                {activeItem?.answer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
