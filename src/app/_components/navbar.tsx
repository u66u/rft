'use client';

import { cn } from '~/lib/utils';
import {
  CircleUserIcon,
  HomeIcon,
  LayersIcon,
  LogInIcon,
  LogOutIcon,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { FC } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

const pages = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Stages', path: '/stage', icon: LayersIcon },
];

type NavItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

export const Navbar: FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const isActive = (path: string) =>
    path === '/' ? path === pathname : pathname.startsWith(path);

  const navItems: NavItem[] = [
    ...pages,
    ...(session ? [{ name: 'Profile', path: '/profile', icon: CircleUserIcon }] : []),
    {
      name: session ? 'Log out' : 'Log in',
      path: session ? '#' : '/auth',
      icon: session ? LogOutIcon : LogInIcon,
      onClick: session ? () => signOut() : () => router.push('/auth'),
    },
  ];

  return (
    <nav
      className={cn(
        '-translate-x-1/2 fixed bottom-6 left-1/2 isolate z-50 flex items-center gap-6 rounded-xl border bg-opacity-50 px-6 text-sm shadow-lg backdrop-blur-sm backdrop-filter',
        'border-neutral-950/10 bg-white/80',
        'dark:border-neutral-100/10 dark:bg-neutral-950/80'
      )}
    >
      {navItems.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick?.(); } : undefined}
          className={cn(
            'relative py-3',
            isActive(link.path)
              ? 'font-medium text-orange-500'
              : 'text-neutral-500 dark:text-neutral-400'
          )}
        >
          <span className="block sm:hidden">
            <link.icon className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">{link.name}</span>
          {isActive(link.path) && (
            <span className="absolute top-full left-0 h-px w-full bg-current" />
          )}
        </Link>
      ))}
    </nav>
  );
};
