import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'dark' | 'light' | 'cyber';
  glowColor?: 'cyan' | 'magenta' | 'bronze';
}

const variants = {
  default: 'bg-deep-space/40 border-futuristic-silver/20',
  dark: 'bg-base-dark/60 border-futuristic-silver/10',
  light: 'bg-futuristic-silver/10 border-futuristic-silver/30',
  cyber: 'bg-gradient-dark-bronze border-neon-cyan/30',
};

const glowColors = {
  cyan: 'group-hover:shadow-neon-cyan',
  magenta: 'group-hover:shadow-neon-magenta',
  bronze: 'group-hover:shadow-neon-bronze',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = true,
  onClick,
  variant = 'default',
  glowColor = 'cyan',
}) => {
  const cardContent = (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border backdrop-blur-md',
        variants[variant],
        'shadow-lg shadow-black/5',
        hover && 'transition-all duration-300 ease-out',
        className
      )}
    >
      {/* Holographic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-holographic-teal/5 via-transparent to-ai-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl">
        <div className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-ai-magenta to-neon-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-cyan" style={{ backgroundSize: '200% 100%' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 font-inter">{children}</div>
    </div>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
        className={clsx(
          'group cursor-pointer',
          onClick && 'cursor-pointer',
          glowColors[glowColor]
        )}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default GlassCard; 