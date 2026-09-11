import { TOTAL_PIECES } from '../lib/pieces';

/** The sticky top bar showing the ten collectible-tool slots. */
export function Inventory({ pieces }: { pieces: (string | null)[] }) {
  return (
    <div className="topbar">
      <div className="inventory-wrap">
        <div className="inventory-grid">
          {Array.from({ length: TOTAL_PIECES }, (_, i) => {
            const icon = pieces[i];
            return (
              <div key={i} className={`inv-slot${icon ? ' filled pop' : ''}`}>
                {icon ?? '?'}
              </div>
            );
          })}
        </div>
        <div className="inventory-label">La tua cassetta degli attrezzi</div>
      </div>
    </div>
  );
}
