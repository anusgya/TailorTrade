const express = require("express");
const {
  getUserById,
  getAllUsers,
  getAllSeamsters,
  getAllCustomers,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/seamsters", getAllSeamsters);
router.get("/customers", getAllCustomers);
router.put("/:_id", updateUser);
router.get("/:_id", getUserById);
router.get("/seamsters/:_id", getUserById);
router.get("/customers/:_id", getUserById);

module.exports = router;
