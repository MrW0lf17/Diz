import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'cyber' | 'holographic';
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'relative rounded-lg backdrop-blur-md transition-all duration-300',
        {
          // Default variant
          'bg-white/5 border border-white/10 shadow-lg': variant === 'default',
          
          // Cyber variant
          'bg-base-dark/40 border border-neon-cyan/20 shadow-lg': variant === 'cyber',
          'hover:shadow-neon-cyan/10': variant === 'cyber' && hover,
          
          // Holographic variant
          'bg-holographic-dark/30 border border-holographic-teal/20 shadow-lg': variant === 'holographic',
          'hover:shadow-holographic-teal/10': variant === 'holographic' && hover,
          
          // Hover effects
          'hover:bg-white/10 hover:border-white/20': variant === 'default' && hover,
          'hover:bg-base-dark/60 hover:border-neon-cyan/40': variant === 'cyber' && hover,
          'hover:bg-holographic-dark/40 hover:border-holographic-teal/40': variant === 'holographic' && hover,
        },
        className
      )}
      {...props}
    >
      {/* Gradient overlay */}
      <div
        className={clsx(
          'absolute inset-0 rounded-lg opacity-20 pointer-events-none transition-opacity duration-300',
          {
            'bg-gradient-to-br from-white/5 to-white/0': variant === 'default',
            'bg-gradient-cyber': variant === 'cyber',
            'bg-gradient-holographic': variant === 'holographic',
            'group-hover:opacity-30': hover,
          }
        )}
      />
      
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default GlassCard; 