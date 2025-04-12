const express = require("express");
const {addBudget, getBudget, deleteBudget, getTotalSpent} = require("../controllers/budgetController.js")

const router = express.Router();

router.post("/", addBudget);
router.post("/:user_id", getBudget);
router.delete("/:user_id/:budget_id", deleteBudget);
router.post("/:user_id/total_spent", getTotalSpent);


module.exports = router;