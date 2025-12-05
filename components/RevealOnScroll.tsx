import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale';
  delay?: number; // em ms
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  className = "", 
  animation = 'fade-up',
  delay = 0 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up': return 'animate-[fade-in-up_0.8s_ease-out_forwards]';
      case 'fade-left': return 'animate-[fade-in-left_0.8s_ease-out_forwards]';
      case 'fade-right': return 'animate-[fade-in-right_0.8s_ease-out_forwards]';
      case 'scale': return 'animate-[scale-up_0.6s_ease-out_forwards]';
      default: return 'animate-[fade-in-up_0.8s_ease-out_forwards]';
    }
  };

  return (
    <div 
      ref={ref}
      className={`${className} ${isVisible ? getAnimationClass() : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};