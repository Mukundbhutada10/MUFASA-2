import React from 'react';

export const ZylosLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center justify-center bg-black rounded-full p-1 ${className}`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M6 20L18 20L18 17L8.5 7L18 7L18 4L6 4L6 7L15.5 17L6 17L6 20Z"
        fill="url(#zylos-gradient)"
      />
      <defs>
        <linearGradient
          id="zylos-gradient"
          x1="12"
          y1="4"
          x2="12"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#B0B0B0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
