import type { SVGProps } from 'react';

export const BrandMaestroLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="currentColor">
      <rect width="100" height="100" rx="20" />
      <g transform="translate(20, 20) scale(0.6)" fill="#FFFFFF">
        <path d="M69.5,43.2V100H51.8V59.8H30.5V100H12.8V0H69.5C82.5,0,90.4,7.9,90.4,21.6C90.4,31.2,84.7,38.6,75,41.9L92.2,63.1L100,72.1V100H80.5L64.2,74.1L69.5,71.2V43.2ZM51.8,43.2H68.6C75.2,43.2,78.5,38.8,78.5,33.9C78.5,29.3,75,25.6,68.6,25.6H51.8V43.2Z" />
      </g>
    </g>
  </svg>
);
