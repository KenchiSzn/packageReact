const express = require("express");
const {
  registerUser,
  verifyUser,
  getUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  updateUser,
  registerAdmin,
  loginAdmin,
  registerDriver,
  getAdmin,
  getUsersByRole,
  getDriver,
  deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/register/driver", registerDriver);
router.post("/login/admin", loginAdmin);
router.get("/getuser", verifyUser, getUser);
router.get("/users", verifyUser, getUsersByRole);
router.delete("/users/:userId", verifyUser, deleteUser);
router.get("/getuser/:userId", verifyUser);
router.get("/getadmin", verifyUser, getAdmin);
router.get("/getdriver/:driverId", verifyUser);
router.get("/getdriver", verifyUser, getDriver);
router.get("/getadmin/:adminId", verifyUser, getAdmin);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
router.patch("/update/:id", verifyUser, updateUser);
router.patch("/update", verifyUser, updateUser);
// router.get("user/:accountNumber", verifyUser, resolveAccount)

module.exports = router;
