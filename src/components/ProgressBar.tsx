/**
 * A sunken/raised progress meter for goal and savings completion. The visual
 * styling lives in globals.css so it can be reskinned by the active theme
 * (classic 98 vs. neo-brutalism); only the dynamic width is set inline.
 */
export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-bar" style={{ width: `${clamped}%` }} />
    </div>
  );
}
