export function AudioControl({
  muted,
  volume,
  onToggleMute,
  onVolumeChange,
}: {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
}) {
  const isSilent = muted || volume === 0;
  return (
    <div className="audio-control">
      <button
        className="audio-btn"
        aria-label={isSilent ? 'Riattiva la musica' : 'Disattiva la musica'}
        aria-pressed={isSilent}
        onClick={onToggleMute}
      >
        {isSilent ? '🔇' : '🔊'}
      </button>
      <input
        className="audio-slider"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        aria-label="Volume musica"
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
