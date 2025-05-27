import React, { forwardRef } from 'react';
import { CardProps } from '@/commons/types';

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, children, height = 'h-[230px]', className = '', contentClassName = '' }, ref) => {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 flex flex-col ${height} ${className}`}>
        <h2 className="text-base font-semibold mb-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          {title}
        </h2>
        {/* Apply the forwarded ref to the inner div that handles scrolling */}
        <div ref={ref} className={`flex-grow overflow-y-auto pr-2 text-sm ${contentClassName}`}>
          {children}
        </div>
      </div>
    );
  }
);

export default Card;