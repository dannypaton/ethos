import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'nav';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  ariaLabel?: string;
  isExternal?: boolean;
}

/**
 * Reusable Button component that can be rendered as a button or link
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
  ariaLabel,
  isExternal = false,
}) => {
  // Base styles for all buttons
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 uppercase tracking-wider';

  // Variant-specific styles
  const variantStyles = {
    primary: 'border border-white hover:bg-white/20 text-white',
    secondary: 'border border-ethos-gray text-white',
    text: 'text-white',
    icon: 'flex items-center justify-center rounded-full',
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-4',
    md: 'text-sm py-2 px-6',
    lg: 'text-base py-3 px-8',
    nav: 'text-[24px] py-2 px-4'
  };

  // Combine all styles
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // Render as link if href is provided
  if (href) {
    const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    
    return (
      <Link 
        href={href} 
        className={combinedStyles}
        aria-label={ariaLabel}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button 
      className={combinedStyles} 
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button; 