const express = require("express");
const {
  addTrackingHistory,
  deleteTrackingHistory,
  getPackageHistory,
  getTrackingHistoryById,
} = require("../controllers/tracking.controller");
const { verifyUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/addtrackhistory", verifyUser, addTrackingHistory);
router.get("/getpackagehistory/:packageId", verifyUser, getPackageHistory);
router.get("/gettrackhistory/:id", verifyUser, getTrackingHistoryById);
router.delete("/deletehistory/:id", verifyUser, deleteTrackingHistory);

module.exports = router;