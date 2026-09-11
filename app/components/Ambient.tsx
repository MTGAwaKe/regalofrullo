const POSITIONS = [
  { top: '6%', left: '4%', rot: '-8deg' },
  { top: '72%', left: '80%', rot: '10deg' },
  { top: '38%', left: '88%', rot: '-6deg' },
  { top: '85%', left: '8%', rot: '7deg' },
];

/** Faint decorative emoji scattered behind a screen's content. */
export function Ambient({ icons }: { icons: string[] }) {
  return (
    <div className="ambient">
      {icons.map((icon, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        return (
          <span key={i} style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rot})` }}>
            {icon}
          </span>
        );
      })}
    </div>
  );
}
