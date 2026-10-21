import type { SVGProps } from 'react';
import type { Color } from './shared';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

/** Status glyph matching a color: check, triangle, cross or info */
export function StatusIcon({ color, ...props }: SVGProps<SVGSVGElement> & { color: Color }) {
  if (color === 'success') {
    return (
      <svg {...base} {...props}>
        <circle cx="10" cy="10" r="7.5" />
        <path d="M6.75 10.25l2.25 2.25 4.25-4.75" />
      </svg>
    );
  }
  if (color === 'warning') {
    return (
      <svg {...base} {...props}>
        <path d="M10 3l7.5 13.5h-15z" />
        <path d="M10 8.5v3.25M10 14.25v.25" />
      </svg>
    );
  }
  if (color === 'danger') {
    return (
      <svg {...base} {...props}>
        <circle cx="10" cy="10" r="7.5" />
        <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" />
      </svg>
    );
  }
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.5M10 6.25v.25" />
    </svg>
  );
}
