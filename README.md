# Fidelity Bank Lifestyle App

A modern web application for Fidelity Bank's lifestyle platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dual Authentication System**: Separate login and registration flows for customers and vendors
- **Modern UI**: Split-page layout with beautiful image slideshow
- **OTP Verification**: 6-digit email verification system
- **Responsive Design**: Mobile-first design with Fidelity Bank branding
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: Next.js 15 with Turbopack, Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (root)/            # Root layout pages
│   │   ├── signin/        # Login page
│   │   ├── signup/        # Registration page
│   │   └── otp-validation/ # OTP verification
│   ├── vendor/            # Vendor dashboard
│   ├── customer/          # Customer dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Input, OTPInput)
│   └── layout/           # Layout components (AuthLayout)
├── services/             # API service functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## Key Pages

### Authentication Flow
1. **Sign In** (`/signin`) - Login for customers and vendors
2. **Sign Up** (`/signup`) - Registration with vendor multi-step flow
3. **OTP Verification** (`/otp-validation`) - 6-digit email verification

### Dashboards
- **Vendor Dashboard** (`/vendor/dashboard`) - Profile completion and business verification
- **Customer Dashboard** (`/customer/dashboard`) - Explore lifestyle services

## Design Features

- **Fidelity Bank Colors**: Blue (#012168) and Green (#6CC049) color scheme
- **Split Layout**: Form on left, rotating slideshow on right
- **Responsive**: Mobile-optimized with responsive breakpoints
- **Modern UI**: Reactive buttons, smooth transitions, loading states
- **Accessibility**: Proper form validation and error handling

## API Integration

The app integrates with backend services for:
- User authentication (login/registration)
- OTP generation and verification
- Vendor and customer management

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Playfair Display (headings), Open Sans (body)
- **Build Tool**: Turbopack
- **Icons**: Heroicons (SVG)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of Fidelity Bank's lifestyle application.
