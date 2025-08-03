import React from 'react';

interface SectionHeadingProps {
  level?: number;
  children: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ level = 2, children }) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  
  return <Tag className="social-preview__section-heading">{children}</Tag>;
};

export default SectionHeading;
export { SectionHeading }; 
