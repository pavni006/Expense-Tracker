const {groupExpense} = require ("../controllers/expenseController.js");

const express = require ("express");
const router = express.Router();

router.get("/:user_id",groupExpense);

module.exports = router;