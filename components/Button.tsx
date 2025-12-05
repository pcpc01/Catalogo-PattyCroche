import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  // Added transform hover:scale-105 active:scale-95 for elegant interaction
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
  
  const variants = {
    // Added hover:brightness-105 and hover:shadow-xl
    primary: "bg-patty-mustard text-patty-graphite hover:bg-[#D9A665] shadow-md hover:shadow-xl hover:brightness-105",
    secondary: "bg-patty-teal text-white hover:bg-[#3D6870] shadow-md hover:shadow-xl hover:brightness-105",
    outline: "border-2 border-patty-teal text-patty-teal hover:bg-patty-teal hover:text-white hover:shadow-md"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};