export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs font-semibold text-muted">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
        <div
          className="h-full rounded-full bg-action transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
