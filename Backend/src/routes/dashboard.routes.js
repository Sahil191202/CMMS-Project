const express = require("express");
const router = express.Router();
const { getSummary, getCharts, getTopMachines } = require("../controllers/dashboard.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const guard = [authenticate, authorize(["admin", "maintenance"])];

router.get("/summary",      ...guard, getSummary);
router.get("/charts",       ...guard, getCharts);
router.get("/top-machines", ...guard, getTopMachines);

module.exports = router;