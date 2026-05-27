// Badge.jsx
const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  CLOSED: {
    label: 'Closed',
    classes: 'bg-green-500/10 text-green-400 border-green-500/30',
    dot: 'bg-green-400',
  },
  RESOLVED: {
    label: 'Resolved',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  HIGH: {
    label: 'High',
    classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-400',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  LOW: {
    label: 'Low',
    classes: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    dot: 'bg-gray-400',
  },
};

const Badge = ({ status, label, showDot = true, className = '' }) => {
  const key = status?.toUpperCase();
  const config = STATUS_CONFIG[key] || {
    label: label || status || 'Unknown',
    classes: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold tracking-wide border ${config.classes} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      )}
      {label || config.label}
    </span>
  );
};

export default Badge;