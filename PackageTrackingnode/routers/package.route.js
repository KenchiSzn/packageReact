const express = require("express");
const {
  getAllPackages,
  getDriverPackages,
  createPackage,
  getPackageById,
  trackPackage,
  getUserPackages,
  updatePackageStatus,
  deletePackage,
} = require("../controllers/package.contoller");
const { verifyUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/createpackage", verifyUser, createPackage)
router.get("/allpackages", verifyUser, getAllPackages)
router.get("/driverpackages", verifyUser, getDriverPackages )
router.get("/userpackages", verifyUser, getUserPackages)
router.get("/package/:packageId", verifyUser, getPackageById)
router.patch("/:id/status", verifyUser, updatePackageStatus)
router.delete("/:id", verifyUser, deletePackage)
router.get("/trackpackage/:trackId", trackPackage)

module.exports = router;
