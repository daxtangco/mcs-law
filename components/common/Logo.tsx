import React from 'react';
import Link from 'next/link';

type LogoProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ width = 160, height = 70, className = '' }) => {
  return (
    <div className={className} style={{ width, height }}>
      <img
        src="/logo.svg"
        alt="MCS LAW OFFICE"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default Logo;
