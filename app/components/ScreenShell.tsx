import type { ReactNode } from 'react';
import { Ambient } from './Ambient';

/**
 * Common header (ambient icons + eyebrow + title + lead paragraph) shared by
 * every screen, wrapping whatever body content that screen needs.
 */
export function ScreenShell({
  screenId,
  ambientIcons,
  eyebrow,
  title,
  lead,
  children,
}: {
  screenId: number;
  ambientIcons: string[];
  eyebrow: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="screen" data-screen={screenId}>
      <Ambient icons={ambientIcons} />
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="title">{title}</h1>
      <p className="lead">{lead}</p>
      {children}
    </section>
  );
}
