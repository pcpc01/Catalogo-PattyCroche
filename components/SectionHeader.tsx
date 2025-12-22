import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'center' }) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-patty-teal mb-4 relative inline-block">
        {title}
        {/* Underline decoration */}
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-patty-coral rounded-full"></span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-patty-graphite/70 max-w-2xl mx-auto text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};