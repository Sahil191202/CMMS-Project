// pages/DashboardPage.jsx
// KPI cards: Total Breakdowns, Open Tickets, Avg MTTR, Avg MTBF
// All values hardcoded to "—" for now — Dev B wires real data when Dev A's API is ready.
// Chart section is stubbed with placeholder boxes.

import { PageHeader, KPICard } from "../components/ui";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";

// ─── KPI icon helpers ─────────────────────────────────────────────────────────
const BreakdownIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const OpenTicketsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const MTTRIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const MTBFIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

// ─── Chart placeholder ────────────────────────────────────────────────────────
const ChartPlaceholder = ({ title, height = "h-48" }) => (
  <div className="bg-gray-900 border border-gray-800 p-5">
    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
      {title}
    </p>
    <div
      className={`${height} flex items-center justify-center border border-dashed border-gray-800`}
    >
      <p className="text-xs text-gray-700 uppercase tracking-widest">
        Chart — wired in later
      </p>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  // TODO: Dev B — fetch from GET /dashboard/stats and replace hardcoded values
  // Expected shape: { totalBreakdowns, openTickets, avgMTTR, avgMTBF }

  const kpiCards = [
    {
      title: "Total Breakdowns",
      value: "15",
      unit: "this month",
      icon: <BreakdownIcon />,
    },
    {
      title: "Open Tickets",
      value: "7",
      unit: "unresolved",
      icon: <OpenTicketsIcon />,
    },
    {
      title: "Avg MTTR",
      value: "8",
      unit: "hrs",
      icon: <MTTRIcon />,
    },
    {
      title: "Avg MTBF",
      value: "4",
      unit: "hrs",
      icon: <MTBFIcon />,
    },
  ];

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");

  const machines = ["Machine A", "Machine B", "Machine C", "Machine D"];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]}
        subtitle="Plant overview — breakdown metrics and machine health"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KPICard
            key={card.title}
            title={card.title}
            value={card.value}
            unit={card.unit}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Filters row — stubbed */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
            Filters:
          </span>

          {/* Date Picker */}
          <div className="relative">
            <CalendarDays
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 w-44 bg-gray-900 border border-gray-800 pl-9 pr-3 text-xs text-gray-300 outline-none focus:border-gray-600"
            />
          </div>

          {/* Machine Dropdown */}
          <div className="relative">
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="h-8 w-44 appearance-none bg-gray-900 border border-gray-800 px-3 pr-8 text-xs text-gray-300 outline-none focus:border-gray-600"
            >
              <option value="">Select Machine</option>

              {machines.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPlaceholder
          title="Breakdown Trend — Last 30 Days"
          height="h-52"
        />
        <ChartPlaceholder title="Breakdowns by Type" height="h-52" />
        <ChartPlaceholder title="Breakdowns by Machine" height="h-52" />
        <ChartPlaceholder title="Open vs Closed" height="h-52" />
      </div>
    </div>
  );
};

export default DashboardPage;
