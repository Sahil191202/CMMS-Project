const pool = require("../config/database");
const { getMTBFAllAssets, getMTBFByAsset } = require("./ticket.service");

// Build reusable date + asset WHERE conditions
const buildConditions = ({ from, to, asset_id } = {}) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (from) {
    conditions.push(`t.reported_at >= $${idx++}`);
    values.push(new Date(from));
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    conditions.push(`t.reported_at <= $${idx++}`);
    values.push(toDate);
  }

  if (asset_id) {
    conditions.push(`t.asset_id = $${idx++}`);
    values.push(asset_id);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, values, idx };
};

// GET /dashboard/summary
const getSummary = async ({ from, to, asset_id } = {}) => {
  const { where, values } = buildConditions({ from, to, asset_id });

  // Ticket counts by status
  const countResult = await pool.query(
    `SELECT
       COUNT(*)                                          AS total_breakdowns,
       COUNT(*) FILTER (WHERE t.status = 'OPEN')        AS open_tickets,
       COUNT(*) FILTER (WHERE t.status = 'IN_PROGRESS') AS in_progress_tickets,
       COUNT(*) FILTER (WHERE t.status = 'CLOSED')      AS closed_tickets,
       ROUND(AVG(t.mttr_minutes) FILTER (WHERE t.status = 'CLOSED')) AS avg_mttr_minutes
     FROM tickets t
     ${where}`,
    values
  );

  const counts = countResult.rows[0];

  // MTBF across all assets in the same date window
  const avg_mtbf_minutes = await getMTBFAllAssets({ from, to });

  return {
    total_breakdowns:    parseInt(counts.total_breakdowns),
    open_tickets:        parseInt(counts.open_tickets),
    in_progress_tickets: parseInt(counts.in_progress_tickets),
    closed_tickets:      parseInt(counts.closed_tickets),
    avg_mttr_minutes:    counts.avg_mttr_minutes ? parseInt(counts.avg_mttr_minutes) : null,
    avg_mtbf_minutes:    avg_mtbf_minutes,
  };
};

// GET /dashboard/charts
const getCharts = async ({ from, to, asset_id } = {}) => {
  const { where, values, idx } = buildConditions({ from, to, asset_id });

  // Breakdown trend — count per day
  const trendResult = await pool.query(
    `SELECT
       DATE(t.reported_at) AS date,
       COUNT(*)            AS count
     FROM tickets t
     ${where}
     GROUP BY DATE(t.reported_at)
     ORDER BY DATE(t.reported_at) ASC`,
    values
  );

  // Breakdowns by type
  const byTypeResult = await pool.query(
    `SELECT
       COALESCE(bt.name, 'Unknown') AS breakdown_type,
       COUNT(*)                      AS count
     FROM tickets t
     LEFT JOIN breakdown_types bt ON bt.id = t.breakdown_type_id
     ${where}
     GROUP BY bt.name
     ORDER BY count DESC`,
    values
  );

  // Breakdowns by asset
  const byAssetResult = await pool.query(
    `SELECT
       COALESCE(a.name, 'Unknown') AS asset_name,
       COUNT(*)                     AS count
     FROM tickets t
     LEFT JOIN assets a ON a.id = t.asset_id
     ${where}
     GROUP BY a.name
     ORDER BY count DESC
     LIMIT 10`,
    values
  );

  // Open vs In Progress vs Closed donut
  const statusResult = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE t.status = 'OPEN')        AS open,
       COUNT(*) FILTER (WHERE t.status = 'IN_PROGRESS') AS in_progress,
       COUNT(*) FILTER (WHERE t.status = 'CLOSED')      AS closed
     FROM tickets t
     ${where}`,
    values
  );

  const statusCounts = statusResult.rows[0];

  return {
    breakdown_trend: trendResult.rows.map((r) => ({
      date:  r.date,
      count: parseInt(r.count),
    })),
    by_type: byTypeResult.rows.map((r) => ({
      breakdown_type: r.breakdown_type,
      count:          parseInt(r.count),
    })),
    by_asset: byAssetResult.rows.map((r) => ({
      asset_name: r.asset_name,
      count:      parseInt(r.count),
    })),
    open_vs_closed: {
      open:        parseInt(statusCounts.open),
      in_progress: parseInt(statusCounts.in_progress),
      closed:      parseInt(statusCounts.closed),
    },
  };
};

// GET /dashboard/top-machines
// Top machines by breakdown count + avg MTTR — used for the worst machines table
const getTopMachines = async ({ from, to, limit = 5 } = {}) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (from) { conditions.push(`t.reported_at >= $${idx++}`); values.push(new Date(from)); }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    conditions.push(`t.reported_at <= $${idx++}`);
    values.push(toDate);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT
       a.id                                                          AS asset_id,
       a.name                                                        AS asset_name,
       a.asset_code,
       l.name                                                        AS location_name,
       COUNT(*)                                                      AS breakdown_count,
       ROUND(AVG(t.mttr_minutes) FILTER (WHERE t.status = 'CLOSED')) AS avg_mttr_minutes
     FROM tickets t
     JOIN assets    a ON a.id = t.asset_id
     LEFT JOIN locations l ON l.id = a.location_id
     ${where}
     GROUP BY a.id, a.name, a.asset_code, l.name
     ORDER BY breakdown_count DESC
     LIMIT $${idx}`,
    [...values, limit]
  );

  // Attach MTBF per machine
  const rows = await Promise.all(
    result.rows.map(async (row) => {
      const mtbf = await getMTBFByAsset(row.asset_id);
      return {
        asset_id:         row.asset_id,
        asset_name:       row.asset_name,
        asset_code:       row.asset_code,
        location_name:    row.location_name,
        breakdown_count:  parseInt(row.breakdown_count),
        avg_mttr_minutes: row.avg_mttr_minutes ? parseInt(row.avg_mttr_minutes) : null,
        avg_mtbf_minutes: mtbf,
      };
    })
  );

  return rows;
};

module.exports = { getSummary, getCharts, getTopMachines };