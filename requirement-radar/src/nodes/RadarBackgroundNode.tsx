// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { useRequirementStore } from '../useRequirementStore';

type RadarBackgroundNodeProps = {
  data: {
    size: number;
    spokes: number;
    rings?: number;
  };
};

const SLATE = '#f3f4f6';
const WHITE = '#ffffff';
const SWEEP_COLOR = 'rgba(0, 80, 114, 0.2)';

const RadarBackgroundNode: React.FC<RadarBackgroundNodeProps> = ({
  data: { size, spokes, rings = 5 },
}) => {
  const fillColor = (i: number) => (i % 2 === 1 ? SLATE : WHITE);
  const { isScanning } = useRequirementStore();

  const beamAngleDeg = 20;
  const beamAngleRad = (beamAngleDeg * Math.PI) / 180;
  const r = size;
  const startAngle = -Math.PI / 2 - beamAngleRad / 2;
  const endAngle = -Math.PI / 2 + beamAngleRad / 2;

  const x1 = size + Math.cos(startAngle) * r;
  const y1 = size + Math.sin(startAngle) * r;
  const x2 = size + Math.cos(endAngle) * r;
  const y2 = size + Math.sin(endAngle) * r;

  const sweepPath = `
    M ${size},${size}
    L ${x1},${y1}
    A ${r},${r} 0 0,1 ${x2},${y2}
    Z
  `;

  return (
    <svg
      width={2 * size}
      height={2 * size}
      style={{ pointerEvents: 'none' }}
      className={isScanning ? 'animate-pulse' : ''}
    >
      {/* Filled bands */}
      {Array.from({ length: rings }).map((_, idx) => {
        const ringIndex = rings - idx;
        const radius = (ringIndex / rings) * size;
        return (
          <circle
            key={`fill-${ringIndex}`}
            cx={size}
            cy={size}
            r={radius}
            fill={fillColor(ringIndex)}
          />
        );
      })}

      {/* Stroke outlines */}
      {Array.from({ length: rings }).map((_, idx) => {
        const radius = ((idx + 1) / rings) * size;
        return (
          <circle
            key={`ring-${idx}`}
            cx={size}
            cy={size}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Spokes */}
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (2 * Math.PI * i) / spokes - Math.PI / 2;
        const x2 = size + Math.cos(angle) * size;
        const y2 = size + Math.sin(angle) * size;
        return (
          <line
            key={`spoke-${i}`}
            x1={size}
            y1={size}
            x2={x2}
            y2={y2}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Scanning sweep */}
      {isScanning && (
        <g transform={`rotate(0 ${size} ${size})`}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${size} ${size}`}
            to={`360 ${size} ${size}`}
            dur="3s"
            repeatCount="indefinite"
          />
          <path d={sweepPath} fill={SWEEP_COLOR} />
        </g>
      )}
    </svg>
  );
};

export default RadarBackgroundNode;

