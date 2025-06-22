const express = require("express");
const {
  createBid,
  acceptBid,
  getBidsByPost,
  updateBid,
  deleteBid,
  getBidsBySeamster,
} = require("../controllers/bidController");

// modify later on

// const express = require("express");
// const { authMiddleware, authorizeRole } = require("../middleware/auth");
// const {
//   createBid,
//   acceptBid,
// } = require("../controllers/bidController");

// const router = express.Router();

// router.post("/", authMiddleware, authorizeRole("Seamster"), createBid);
// router.put("/accept", authMiddleware, authorizeRole("Customer"), acceptBid);

// module.exports = router;

const router = express.Router();

router.post("/", createBid);
router.get("/seamster/:_id", getBidsBySeamster);
router.get("/post/:_id", getBidsByPost);
router.put("/accept/:_id", acceptBid);
router.put("/:_id", updateBid);
router.delete("/:_id", deleteBid);

module.exports = router;
