const TimelineItem = ({ title, timestamp, completed, isLast = false }) => (
  <div className="flex gap-4">
    {/* Indicator */}
    <div className="flex flex-col items-center">
      <div
        className={`relative z-10 h-4 w-4 rounded-full border-2 ${
          completed
            ? "bg-blue-600 border-blue-600"
            : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        }`}
      />

      {!isLast && (
        <div
          className={`w-0.5 flex-1 min-h-[60px] ${
            completed
              ? "bg-blue-200 dark:bg-blue-900/50"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        />
      )}
    </div>

    {/* Content */}
    <div className="pb-8">
      <h4
        className={`font-semibold ${
          completed
            ? "text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {title}
      </h4>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {timestamp
          ? new Date(timestamp).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Pending"}
      </p>
      {timestamp && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {Math.floor(
            (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60),
          )}
          h ago
        </p>
      )}
    </div>
  </div>
);

export default function TicketTimeline({ ticket }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Status Timeline
        </h3>

        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          {ticket.status}
        </span>
      </div>

      <TimelineItem
        title="Ticket Opened"
        timestamp={ticket.reported_at}
        completed
      />

      <TimelineItem
        title="Picked Up"
        timestamp={ticket.assigned_at}
        completed={!!ticket.assigned_at}
      />

      <TimelineItem
        title="Ticket Closed"
        timestamp={ticket.closed_at}
        completed={!!ticket.closed_at}
        isLast
      />
    </div>
  );
}
