import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";

import TicketTimeline from "../../components/tickets/TicketTimeline";
import TicketActions from "../../components/tickets/TicketActions";
import CloseTicketModal from "../../components/tickets/CloseTicketModal";

import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";

export default function TicketDetailPage() {
  const { id } = useParams();

  const role = useSelector((state) => state.auth.user?.role);

  const [showCloseModal, setShowCloseModal] = useState(false);

  const pickupMutation = useMutation(`/tickets/${id}/pickup`, "PATCH", {
    onSuccess: () => {
      refetch(true);
    },
  });

  const handlePickup = async () => {
    await pickupMutation.mutate();
  };

  const closeMutation = useMutation(`/tickets/${id}/close`, "PATCH", {
    onSuccess: () => {
      setShowCloseModal(false);
      refetch(true);
    },
  });

  const handleCloseTicket = async (form) => {
    await closeMutation.mutate(form);
  };

  const { data: ticket, loading, refetch } = useFetch(`/tickets/${id}`);

  const { data: rootCauses = [] } = useFetch("/root-causes");

  const { data: mttrReasons = [] } = useFetch("/mttr-reasons");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">
          Loading ticket...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader title={ticket.ticket_number} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 shadow-sm dark:shadow-none">
            {" "}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {ticket.asset_name}
              </h2>

              <Badge status={ticket.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Field label="Machine" value={ticket.asset_name} />
              <Field label="Location" value={ticket.location_name} />
              <Field label="Breakdown Type" value={ticket.breakdown_type} />
              <Field label="Opened By" value={ticket.reported_by_name} />
            </div>
          </div>
        </div>

        <TicketTimeline ticket={ticket} />
      </div>

      {ticket.status === "CLOSED" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Resolution Report
            </h2>

            <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
              MTTR: {ticket.mttr_minutes || 0} mins
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Root Cause" value={ticket.root_cause} />
            <Field label="MTTR Reason" value={ticket.mttr_reason} />
            <Field label="Closed By" value={ticket.closed_by_name} />
            <Field label="Parts Replaced" value={ticket.parts_replaced} />
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Resolution Notes
            </p>

            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {ticket.resolution_notes || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      <TicketActions
        ticket={ticket}
        role={role}
        onPickup={handlePickup}
        onClose={() => setShowCloseModal(true)}
      />

      <CloseTicketModal
        open={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        rootCauses={rootCauses}
        mttrReasons={mttrReasons}
        onSubmit={handleCloseTicket}
      />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="font-semibold text-gray-900 dark:text-white mt-2">
        {value || "-"}
      </p>
    </div>
  );
}
