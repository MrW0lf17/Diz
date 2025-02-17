import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AILoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyber' | 'holographic' | 'bronze';
  className?: string;
  text?: string;
}

const sizes = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const variants = {
  cyber: {
    outer: '#00FFE5', // neon-cyan
    middle: '#4DFFEA', // holographic-teal
    inner: '#FF00C3', // ai-magenta
    pulse: 'from-neon-cyan via-holographic-teal to-ai-magenta',
  },
  holographic: {
    outer: '#4DFFEA', // holographic-teal
    middle: '#00FFE5', // neon-cyan
    inner: '#FF00C3', // ai-magenta
    pulse: 'from-holographic-teal via-neon-cyan to-ai-magenta',
  },
  bronze: {
    outer: '#BD8B4A', // metallic-bronze
    middle: '#D4A66C', // accent-light
    inner: '#96703B', // accent-dark
    pulse: 'from-metallic-bronze via-accent-light to-accent-dark',
  },
};

const AILoadingSpinner: React.FC<AILoadingSpinnerProps> = ({
  size = 'md',
  variant = 'cyber',
  className,
  text,
}) => {
  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <div className={clsx('relative', sizes[size])}>
        {/* Outer ring */}
        <motion.div
          variants={containerVariants}
          animate="animate"
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(45deg, transparent 40%, ${variants[variant].outer})`,
            transform: 'rotate(0deg)',
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          variants={containerVariants}
          animate="animate"
          className="absolute inset-2 rounded-full"
          style={{
            background: `linear-gradient(45deg, transparent 40%, ${variants[variant].middle})`,
            transform: 'rotate(90deg)',
            animationDelay: '-0.3s',
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          variants={containerVariants}
          animate="animate"
          className="absolute inset-4 rounded-full"
          style={{
            background: `linear-gradient(45deg, transparent 40%, ${variants[variant].inner})`,
            transform: 'rotate(180deg)',
            animationDelay: '-0.6s',
          }}
        />
        
        {/* Center pulse */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className={clsx(
            'absolute inset-6 rounded-full bg-gradient-to-r',
            `${variants[variant].pulse}`,
            'opacity-20 backdrop-blur-sm'
          )}
        />
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm font-orbitron text-futuristic-silver"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default AILoadingSpinner; 