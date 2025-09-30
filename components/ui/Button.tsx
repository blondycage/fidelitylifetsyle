import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
  loading = false,
}) => {
  const baseClasses = 'w-full px-6 py-4 rounded-full font-medium text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-[var(--blueHex)] text-white hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-[var(--greenHex)] text-white hover:bg-gradient-to-r hover:from-[var(--greenHex)] hover:to-[var(--blueHex)] focus:ring-green-500 disabled:bg-gray-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};