import Button from "../ui/Button";

export default function TicketActions({
  ticket,
  role,
  onPickup,
  onClose,
}) {
  if (role === "operator") return null;

  return (
    <div className="flex gap-3">
      {ticket.status === "OPEN" && (
        <Button onClick={onPickup}>
          Pick Up
        </Button>
      )}

      {ticket.status === "IN_PROGRESS" && (
        <Button variant="primary" onClick={onClose}>
          Close Ticket
        </Button>
      )}
    </div>
  );
}