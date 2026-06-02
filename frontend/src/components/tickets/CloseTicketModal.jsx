import { useState } from "react";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CloseTicketModal({
  open,
  onClose,
  rootCauses = [],
  mttrReasons = [],
  onSubmit,
}) {
  const [form, setForm] = useState({
    root_cause_id: "",
    mttr_reason_id: "",
    resolution_notes: "",
    parts_replaced: "",
  });

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Close Ticket">
      <div className="space-y-4">
        <Select
          label="Root Cause"
          value={form.root_cause_id}
          onChange={(e) =>
            setForm({
              ...form,
              root_cause_id: e.target.value,
            })
          }
          options={(rootCauses || []).map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />

        <Select
          label="MTTR Reason"
          value={form.mttr_reason_id}
          onChange={(e) =>
            setForm({
              ...form,
              mttr_reason_id: e.target.value,
            })
          }
          options={(mttrReasons || []).map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />

        <Input
          label="Resolution Notes"
          value={form.resolution_notes}
          onChange={(e) =>
            setForm({
              ...form,
              resolution_notes: e.target.value,
            })
          }
        />

        <Input
          label="Parts Replaced"
          value={form.parts_replaced}
          onChange={(e) =>
            setForm({
              ...form,
              parts_replaced: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit}>Close Ticket</Button>
        </div>
      </div>
    </Modal>
  );
}
