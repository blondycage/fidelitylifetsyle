import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--fontPlayfair",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--fontOpen",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fidelity Lifestyle Banking",
  description: "Your gateway to premium lifestyle experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${openSans.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1B3B7A',
              border: '1px solid #1B3B7A',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#7CB342',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
