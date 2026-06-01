const pool = require("../config/database");

// Generate ticket number like TKT-0001
const generateTicketNumber = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM tickets");
  const count = parseInt(result.rows[0].count) + 1;
  return `TKT-${String(count).padStart(4, "0")}`;
};

// POST /tickets
const createTicket = async ({ asset_id, location_id, breakdown_type_id, description, priority, reported_by }) => {
  // Validate required fields
  if (!asset_id)      throw { status: 400, message: "asset_id is required" };
  if (!description)   throw { status: 400, message: "description is required" };

  // Validate asset exists
  const asset = await pool.query("SELECT id FROM assets WHERE id = $1 AND is_active = TRUE", [asset_id]);
  if (!asset.rows[0]) throw { status: 400, message: "Asset not found or inactive" };

  const ticket_number = await generateTicketNumber();
  const validPriorities = ["low", "medium", "high"];
  const finalPriority = validPriorities.includes(priority) ? priority : "medium";

  const result = await pool.query(
    `INSERT INTO tickets
       (ticket_number, asset_id, location_id, breakdown_type_id, description, priority, status, reported_by, reported_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', $7, NOW())
     RETURNING *`,
    [
      ticket_number,
      asset_id,
      location_id   || null,
      breakdown_type_id || null,
      description,
      finalPriority,
      reported_by,
    ]
  );

  return getTicketById(result.rows[0].id);
};

// GET /tickets — with filters + pagination
const getTickets = async ({ status, asset_id, breakdown_type_id, from, to, page = 1, limit = 20, user_id, role }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  // Operators only see their own tickets
  if (role === "operator") {
    conditions.push(`t.reported_by = $${idx++}`);
    values.push(user_id);
  }

  if (status) {
    conditions.push(`t.status = $${idx++}`);
    values.push(status.toUpperCase());
  }

  if (asset_id) {
    conditions.push(`t.asset_id = $${idx++}`);
    values.push(asset_id);
  }

  if (breakdown_type_id) {
    conditions.push(`t.breakdown_type_id = $${idx++}`);
    values.push(breakdown_type_id);
  }

  if (from) {
    conditions.push(`t.reported_at >= $${idx++}`);
    values.push(new Date(from));
  }

  if (to) {
    // Include the full "to" day
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    conditions.push(`t.reported_at <= $${idx++}`);
    values.push(toDate);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count total for pagination
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tickets t ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].count);

  // Fetch paginated rows with joins
  const offset = (page - 1) * limit;
  const dataResult = await pool.query(
    `SELECT
       t.id, t.ticket_number, t.description, t.priority, t.status,
       t.reported_at, t.assigned_at, t.closed_at, t.mttr_minutes,
       a.id   AS asset_id,   a.name  AS asset_name,
       l.name AS location_name,
       bt.name AS breakdown_type,
       ru.name AS reported_by_name,
       au.name AS assigned_to_name
     FROM tickets t
     LEFT JOIN assets         a  ON a.id  = t.asset_id
     LEFT JOIN locations      l  ON l.id  = t.location_id
     LEFT JOIN breakdown_types bt ON bt.id = t.breakdown_type_id
     LEFT JOIN users          ru ON ru.id = t.reported_by
     LEFT JOIN users          au ON au.id = t.assigned_to
     ${where}
     ORDER BY t.reported_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  return {
    data: dataResult.rows,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

// GET /tickets/:id — single ticket with all details
const getTicketById = async (id) => {
  const result = await pool.query(
    `SELECT
       t.id, t.ticket_number, t.description, t.priority, t.status,
       t.reported_at, t.assigned_at, t.closed_at, t.mttr_minutes,
       t.resolution_notes, t.parts_replaced,
       a.id   AS asset_id,   a.name  AS asset_name,
       l.name AS location_name,
       bt.name AS breakdown_type,
       rc.name AS root_cause,
       mr.name AS mttr_reason,
       ru.name AS reported_by_name,
       au.name AS assigned_to_name,
       cu.name AS closed_by_name
     FROM tickets t
     LEFT JOIN assets          a  ON a.id  = t.asset_id
     LEFT JOIN locations       l  ON l.id  = t.location_id
     LEFT JOIN breakdown_types bt ON bt.id = t.breakdown_type_id
     LEFT JOIN root_causes     rc ON rc.id = t.root_cause_id
     LEFT JOIN mttr_reasons    mr ON mr.id = t.mttr_reason_id
     LEFT JOIN users           ru ON ru.id = t.reported_by
     LEFT JOIN users           au ON au.id = t.assigned_to
     LEFT JOIN users           cu ON cu.id = t.closed_by
     WHERE t.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

// PATCH /tickets/:id/pickup — set IN_PROGRESS
const pickupTicket = async (ticket_id, user_id) => {
  const ticket = await pool.query("SELECT * FROM tickets WHERE id = $1", [ticket_id]);

  if (!ticket.rows[0]) throw { status: 404, message: "Ticket not found" };

  const current = ticket.rows[0];

  if (current.status !== "OPEN") {
    throw { status: 400, message: "Ticket is already assigned or closed" };
  }

  await pool.query(
    `UPDATE tickets
     SET status = 'IN_PROGRESS', assigned_to = $1, assigned_at = NOW(), updated_at = NOW()
     WHERE id = $2`,
    [user_id, ticket_id]
  );

  return getTicketById(ticket_id);
};

module.exports = { createTicket, getTickets, getTicketById, pickupTicket };