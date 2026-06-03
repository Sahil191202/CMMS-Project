const dashboardService = require("../services/dashboard.service");

// GET /dashboard/summary
const getSummary = async (req, res) => {
  try {
    const { from, to, asset_id } = req.query;
    const data = await dashboardService.getSummary({ from, to, asset_id });
    return res.status(200).json(data);
  } catch (err) {
    console.error("getSummary error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /dashboard/charts
const getCharts = async (req, res) => {
  try {
    const { from, to, asset_id } = req.query;
    const data = await dashboardService.getCharts({ from, to, asset_id });
    return res.status(200).json(data);
  } catch (err) {
    console.error("getCharts error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /dashboard/top-machines
const getTopMachines = async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const data = await dashboardService.getTopMachines({ from, to, limit });
    return res.status(200).json(data);
  } catch (err) {
    console.error("getTopMachines error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSummary, getCharts, getTopMachines };