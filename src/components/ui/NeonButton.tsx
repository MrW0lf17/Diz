import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'whileHover' | 'whileTap' | 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-dark',
        {
          // Primary variant
          'bg-gradient-cyber text-white shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 focus:ring-neon-cyan':
            variant === 'primary',
          
          // Secondary variant
          'bg-gradient-holographic text-white shadow-lg shadow-holographic-teal/20 hover:shadow-holographic-teal/40 focus:ring-holographic-teal':
            variant === 'secondary',
          
          // Danger variant
          'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 focus:ring-red-500':
            variant === 'danger',
          
          // Ghost variant
          'bg-transparent border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 focus:ring-neon-cyan':
            variant === 'ghost',
          
          // Sizes
          'text-xs px-3 py-1.5 space-x-1.5': size === 'sm',
          'text-sm px-4 py-2 space-x-2': size === 'md',
          'text-base px-6 py-3 space-x-3': size === 'lg',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Neon glow effect */}
      <div
        className={clsx(
          'absolute inset-0 rounded-lg transition-opacity duration-300',
          {
            'bg-gradient-cyber opacity-0 group-hover:opacity-20': variant === 'primary',
            'bg-gradient-holographic opacity-0 group-hover:opacity-20': variant === 'secondary',
            'bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20': variant === 'danger',
            'bg-neon-cyan opacity-0 group-hover:opacity-10': variant === 'ghost',
          }
        )}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center">
        {children}
      </div>
    </motion.button>
  );
};

export default NeonButton; 