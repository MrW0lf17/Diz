import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface AILoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'cyber' | 'holographic';
  text?: string;
}

const AILoadingSpinner: React.FC<AILoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className,
  ...props
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center', className)} {...props}>
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className={clsx(
            'rounded-full border-2 border-t-transparent',
            {
              // Sizes
              'w-4 h-4': size === 'sm',
              'w-8 h-8': size === 'md',
              'w-12 h-12': size === 'lg',
              
              // Variants
              'border-white/20': variant === 'default',
              'border-neon-cyan/20': variant === 'cyber',
              'border-holographic-teal/20': variant === 'holographic',
            }
          )}
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -180 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className={clsx(
            'absolute inset-0 rounded-full border-2 border-t-transparent border-b-transparent',
            {
              // Variants
              'border-white/40': variant === 'default',
              'border-neon-cyan/40': variant === 'cyber',
              'border-holographic-teal/40': variant === 'holographic',
            }
          )}
        />
        
        {/* Center dot */}
        <div
          className={clsx(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
            {
              // Sizes
              'w-1 h-1': size === 'sm',
              'w-2 h-2': size === 'md',
              'w-3 h-3': size === 'lg',
              
              // Variants
              'bg-white/60': variant === 'default',
              'bg-neon-cyan/60': variant === 'cyber',
              'bg-holographic-teal/60': variant === 'holographic',
            }
          )}
        />
      </div>
      
      {text && (
        <p
          className={clsx(
            'mt-2 font-inter',
            {
              'text-xs': size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
              
              'text-white/60': variant === 'default',
              'text-neon-cyan/60': variant === 'cyber',
              'text-holographic-teal/60': variant === 'holographic',
            }
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default AILoadingSpinner; 