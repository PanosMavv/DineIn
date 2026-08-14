import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/app/globals.css';
import { SettingsButton } from '@/components/Misc/SettingsButton';
import { ThemeProvider } from '@/components/Misc/ThemeProvider';
import { Footer } from '@/components/Misc/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dine In - Restaurant Menus',
  description: 'Discover and explore restaurant menus',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-950 flex flex-col min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <main className="flex-1">
              {children}
            </main>

            <Footer />

            <SettingsButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}