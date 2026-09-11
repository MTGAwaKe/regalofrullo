import { MAX_VIEW_DEPTH, type FirstPersonView } from '../lib/mazeLayout';

const CX = 120;
const CY = 80;

function frameSize(depth: number) {
  const scale = 1 / (1 + depth * 0.85);
  return { halfW: 120 * scale, halfH: 80 * scale };
}

export function MazeFirstPersonView({ view, won }: { view: FirstPersonView; won: boolean }) {
  const cap = Math.min(view.openCount, MAX_VIEW_DEPTH);
  const capFrame = frameSize(cap);

  const segments = Array.from({ length: cap }, (_, d) => {
    const near = frameSize(d);
    const far = frameSize(d + 1);
    return { d, near, far };
  });

  return (
    <svg className="maze-fpv" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="240" height="160" fill="#050714" />

      {/* ceiling */}
      <polygon
        points={`0,0 240,0 ${CX + capFrame.halfW},${CY - capFrame.halfH} ${CX - capFrame.halfW},${CY - capFrame.halfH}`}
        fill="#11163a"
      />
      {/* floor */}
      <polygon
        points={`0,160 240,160 ${CX + capFrame.halfW},${CY + capFrame.halfH} ${CX - capFrame.halfW},${CY + capFrame.halfH}`}
        fill="#0a0d26"
      />

      {segments.map(({ d, near, far }) => (
        <g key={d}>
          {view.leftWalls[d] && (
            <polygon
              className="fpv-wall"
              points={`${CX - near.halfW},${CY - near.halfH} ${CX - far.halfW},${CY - far.halfH} ${CX - far.halfW},${CY + far.halfH} ${CX - near.halfW},${CY + near.halfH}`}
            />
          )}
          {view.rightWalls[d] && (
            <polygon
              className="fpv-wall"
              points={`${CX + near.halfW},${CY - near.halfH} ${CX + far.halfW},${CY - far.halfH} ${CX + far.halfW},${CY + far.halfH} ${CX + near.halfW},${CY + near.halfH}`}
            />
          )}
          {view.goalDepth === d && (
            <g className="fpv-goal">
              <circle cx={CX} cy={CY} r={Math.min(far.halfW, far.halfH) * 0.6} />
              <text x={CX} y={CY + 3} textAnchor="middle">
                33
              </text>
            </g>
          )}
        </g>
      ))}

      {view.hasEndWall && (
        <rect
          className="fpv-endwall"
          x={CX - capFrame.halfW}
          y={CY - capFrame.halfH}
          width={capFrame.halfW * 2}
          height={capFrame.halfH * 2}
        />
      )}
      {!view.hasEndWall && (
        <rect
          x={CX - capFrame.halfW * 0.7}
          y={CY - capFrame.halfH * 0.7}
          width={capFrame.halfW * 1.4}
          height={capFrame.halfH * 1.4}
          fill="#050714"
        />
      )}

      {won && <rect x="0" y="0" width="240" height="160" className="fpv-win-flash" />}
    </svg>
  );
}
