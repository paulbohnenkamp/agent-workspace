import React from 'react';

export type WorkspaceIconName =
  | 'acquisition'
  | 'title'
  | 'lease'
  | 'owners'
  | 'portfolio'
  | 'workspace'
  | 'review'
  | 'completed';

export function WorkspaceIcon({ name }: { name: WorkspaceIconName }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  let drawing: React.ReactNode;
  switch (name) {
    case 'acquisition':
      drawing = (
        <>
          <path {...common} d="M4 5.5 9 3l6 2 5-2v15.5l-5 2-6-2-5 2V5.5Z" />
          <path {...common} d="M9 3v15.5M15 5v15.5M4 12l5-2 6 2 5-2" />
        </>
      );
      break;
    case 'title':
      drawing = (
        <>
          <path {...common} d="M6 3.5h8l4 4v13H6z" />
          <path {...common} d="M14 3.5v4h4M8.5 11h6M8.5 14.5h4" />
          <circle {...common} cx="16.5" cy="17" r="2.5" />
          <path {...common} d="m18.3 18.8 2 2" />
        </>
      );
      break;
    case 'lease':
      drawing = (
        <>
          <path {...common} d="M6 3.5h8l4 4v13H6z" />
          <path {...common} d="M14 3.5v4h4M8.5 11h7M8.5 14.5h7M8.5 18h4" />
        </>
      );
      break;
    case 'owners':
      drawing = (
        <>
          <circle {...common} cx="9" cy="8" r="3" />
          <path {...common} d="M3.8 20c.4-3.2 2.2-5 5.2-5s4.8 1.8 5.2 5" />
          <circle {...common} cx="17" cy="9" r="2.2" />
          <path {...common} d="M15.2 15.2c.8-.6 1.7-.9 2.8-.9 1.9 0 3.2 1.1 3.5 3.2" />
        </>
      );
      break;
    case 'portfolio':
      drawing = (
        <>
          <path {...common} d="M4 19.5V5.5M4 19.5h16" />
          <path {...common} d="m6.5 15 3-3 2.5 2 5-6 2.5 2.5" />
          <circle {...common} cx="6.5" cy="15" r=".7" />
          <circle {...common} cx="12" cy="14" r=".7" />
          <circle {...common} cx="17" cy="8" r=".7" />
        </>
      );
      break;
    case 'workspace':
      drawing = <path {...common} d="M4 5.5 12 3l8 2.5v13L12 21l-8-2.5v-13ZM12 3v18M4 5.5l8 2.5 8-2.5M4 12l8 2.5 8-2.5" />;
      break;
    case 'review':
      drawing = (
        <>
          <circle {...common} cx="12" cy="12" r="8.5" />
          <path {...common} d="m8.5 12 2.3 2.3 4.7-5" />
        </>
      );
      break;
    case 'completed':
      drawing = <path {...common} d="m5 12.5 4.2 4.2L19 7" />;
      break;
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      {drawing}
    </svg>
  );
}
