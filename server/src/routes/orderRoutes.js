const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersBySeamster,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
  searchOrder,
  getOrderById,
  getRecentOrderByCustomer,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/search", searchOrder);
router.get("/recent/customer/:_id", getRecentOrderByCustomer);
router.get("/seamster/:_id", getOrdersBySeamster);
router.get("/customer/:_id", getOrdersByCustomer);
router.get("/:_id", getOrderById);
router.put("/:_id", updateOrder);
router.delete("/:_id", deleteOrder);

module.exports = router;
