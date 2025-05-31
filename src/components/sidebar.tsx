"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/commons/icons';
import { sidebarItems } from '@/commons/constants';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(prevState => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileOpen) {
        onMobileClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, onMobileClose]);


  const CollapseIcon = isCollapsed ? Icons.IoMdArrowDroprightCircle : Icons.IoMdArrowDropleftCircle;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
          onClick={onMobileClose}
        ></div>
      )}

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen pt-14 transition-[width,transform] duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:static sm:h-screen
          bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          flex flex-col
        `}
        aria-label="Sidebar"
      >
        <div className="flex-grow px-3 py-4 overflow-y-auto relative">


          <ul className="space-y-2 font-medium">
            {sidebarItems.map((item) => {
              const IconComponent = Icons[item.icon];
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 640) {
                        onMobileClose();
                      }
                    }}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center p-2 rounded-lg transition-colors group
                      ${isActive
                        ? 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    {IconComponent && (
                      <IconComponent className="flex-shrink-0 w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    )}
                    <span className={`ms-3 whitespace-nowrap
                                      ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
                                      transition-all duration-300 ease-in-out`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 hidden sm:block">
          <button
            onClick={toggleCollapse}
            className="flex items-center w-full p-2 rounded-lg
              bg-gray-200 dark:bg-gray-700
              text-gray-700 dark:text-gray-200
              hover:bg-gray-300 dark:hover:bg-gray-600
              transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
              justify-center
            "
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon className="w-6 h-6 flex-shrink-0" />
            <span className={`ms-3 whitespace-nowrap
                              ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
                              transition-all duration-300 ease-in-out`}>
              Collapse Sidebar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;