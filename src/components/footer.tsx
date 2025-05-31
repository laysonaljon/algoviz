import React from 'react';

const Footer = () => {
  return (
    <footer
      className="bg-white dark:bg-gray-800 rounded-lg mx-2 p-4 text-gray-700 dark:text-gray-300 text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} AlgoViz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;