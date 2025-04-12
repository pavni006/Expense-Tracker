const express = require ("express");
const router = express.Router();
const {addExpense, getExpense, deleteExpense, groupExpense} = require("../controllers/expenseController.js");

router.post("/:user_id",getExpense);
router.post("/",addExpense);
router.delete("/:user_id/:expense_id", deleteExpense);
router.post("/:user_id/group_expense",groupExpense);

module.exports = router;