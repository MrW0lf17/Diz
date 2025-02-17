import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  glow?: boolean;
}

const variants = {
  primary: 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 hover:shadow-neon-cyan',
  secondary: 'bg-ai-magenta/20 border-ai-magenta text-ai-magenta hover:bg-ai-magenta/30 hover:shadow-neon-magenta',
  accent: 'bg-metallic-bronze/20 border-metallic-bronze text-metallic-bronze hover:bg-metallic-bronze/30 hover:shadow-neon-bronze',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  glow = true,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'relative font-orbitron rounded-lg border transition-all duration-200',
        'backdrop-blur-sm',
        variants[variant],
        sizes[size],
        glow && 'hover:animate-pulse-cyan',
        disabled && 'opacity-50 cursor-not-allowed hover:shadow-none',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-cyber opacity-0 transition-opacity group-hover:opacity-10" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Animated border glow */}
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-20" />
    </motion.button>
  );
};

export default NeonButton; 