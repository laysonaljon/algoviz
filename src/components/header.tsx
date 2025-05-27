"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/commons/icons';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={onMenuToggle}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="logo-sidebar"
              aria-expanded="false"
            >
              <span className="sr-only">Open sidebar</span>
              <Icons.MdMenu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex ms-2 md:me-24">
              <Image src={logo} alt="AlgoViz Logo" width={32} height={32} className="h-8 me-3 sm:h-7" priority />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                AlgoViz
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <button
                onClick={() => {
                  const html = document.documentElement;
                  const isDark = html.classList.contains('dark');
                  html.classList.toggle('dark', !isDark);
                  localStorage.setItem('theme', !isDark ? 'dark' : 'light');
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                aria-label="Toggle Dark Mode"
              >
                <Icons.MdOutlineWbSunny className="w-5 h-5 hidden dark:block" />
                <Icons.IoMdMoon className="w-5 h-5 dark:hidden" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
