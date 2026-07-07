import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = {
  locales: ['en', 'el', 'de', 'fr', 'zh'],
  defaultLocale: 'en',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);