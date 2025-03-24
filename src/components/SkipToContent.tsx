import React from 'react';

/**
 * SkipToContent - An accessibility component that allows keyboard users to bypass
 * navigation menus and jump directly to the main content of the page.
 * 
 * This component is visually hidden by default and becomes visible when focused
 * with keyboard navigation (Tab key), providing an essential feature for 
 * users who navigate with keyboards or screen readers.
 */
const SkipToContent = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-ethos-dark focus:outline-none focus:ring-2 focus:ring-ethos-gray rounded-md transition-transform"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent; 