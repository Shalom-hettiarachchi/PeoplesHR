import type { ReactNode } from "react";

/** Small line icons on a 24px grid. Decorative: always paired with visible text. */
function Icon({ children, className = "size-6" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

type P = { className?: string };

export const IconBook = (p: P) => (
  <Icon {...p}>
    <path d="M12 6.5C10.5 5.3 8.4 4.8 5 5v13c3.4-.2 5.5.3 7 1.5 1.5-1.2 3.6-1.7 7-1.5V5c-3.4-.2-5.5.3-7 1.5Z" />
    <path d="M12 6.5v13" />
  </Icon>
);

export const IconCalculator = (p: P) => (
  <Icon {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2.5" />
    <rect x="8" y="6" width="8" height="3.5" rx="1" />
    <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth="2.4" />
  </Icon>
);

export const IconTarget = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </Icon>
);

export const IconCheck = (p: P) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const IconBulb = (p: P) => (
  <Icon {...p}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
  </Icon>
);

export const IconEye = (p: P) => (
  <Icon {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const IconSignpost = (p: P) => (
  <Icon {...p}>
    <path d="M12 3v18M12 5.5h6l2 2.5-2 2.5h-6M12 12.5H6L4 15l2 2.5h6" />
  </Icon>
);

export const IconUsers = (p: P) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M16.5 14c2.2.1 3.6 1.6 4 4" />
  </Icon>
);

export const IconArrowRight = (p: P) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
