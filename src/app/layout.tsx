import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
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
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-surface-2 text-ink flex flex-col min-h-screen`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
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