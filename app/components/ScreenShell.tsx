import type { ReactNode } from 'react';
import { Ambient } from './Ambient';

/**
 * Every screen is one numbered sheet in the same drawing set — a title
 * block (sheet number + drawing name) in a ruled frame with corner
 * registration marks, the way an actual technical drawing is captioned.
 * Content sits directly on the sheet; there is no separate floating card.
 */
export function ScreenShell({
  sheetIndex,
  sheetName,
  ambientIcons,
  title,
  lead,
  children,
}: {
  sheetIndex: number;
  sheetName: string;
  ambientIcons: string[];
  title: ReactNode;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="sheet" data-sheet={sheetIndex}>
      <Ambient icons={ambientIcons} />
      <div className="sheet-frame">
        <div className="sheet-titleblock">
          <span className="sheet-number">{String(sheetIndex).padStart(2, '0')} / 10</span>
          <span className="sheet-name">{sheetName}</span>
        </div>
        <h1 className="sheet-title">{title}</h1>
        <p className="sheet-lead">{lead}</p>
        {children}
      </div>
    </section>
  );
}
