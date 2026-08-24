import { createNavigation } from 'next-intl/navigation';
import { localeCodes, defaultLocale } from '@/lib/locales';

export const routing = {
  locales: localeCodes,
  defaultLocale,
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);