/**
 * A simple sunken progress meter for goal/savings completion. Kept minimal and
 * animation-free in keeping with the design philosophy.
 */
export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        border: "2px solid",
        borderColor: "#808080 #ffffff #ffffff #808080",
        background: "#ffffff",
        height: 14,
        padding: 1,
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: "#000080",
        }}
      />
    </div>
  );
}
