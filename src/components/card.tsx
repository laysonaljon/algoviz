import React, { forwardRef } from 'react';

export interface CardProps {
  title: string;
  children: React.ReactNode;
  height?: string;
  className?: string;
  contentClassName?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, children, height = 'h-[230px]', className = '', contentClassName = '' }, ref) => {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 flex flex-col ${height} ${className}`}>
        <h2 className="text-base font-semibold mb-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          {title}
        </h2>
        <div ref={ref} className={`flex-grow overflow-y-auto pr-2 text-sm ${contentClassName}`}>
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;