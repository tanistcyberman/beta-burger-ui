import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { ThemeWrapper } from '../components/layout/ThemeWrapper';

export const metadata: Metadata = {
  title: 'BETA BURGER | Fast-Food Management System & Verification POS',
  description: 'Internal management dashboard and Point of Sale system for BETA BURGER fast-food restaurant with real-time bank transfer fraud verification.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans">
        <AppProvider>
          <ThemeWrapper>{children}</ThemeWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
