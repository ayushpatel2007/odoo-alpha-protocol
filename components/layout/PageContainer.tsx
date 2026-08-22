import React from 'react';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24 md:pb-12 ${className}`}>
      {children}
    </div>
  );
}
