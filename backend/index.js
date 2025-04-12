const express = require("express");
require("dotenv").config();
const cors = require("cors");

const expenseRoute = require ("./routes/expenseRoute.js");
const dashRoute = require ("./routes/dashRoute.js");
const budgetRoute = require ("./routes/budgetRoute.js");
const userRoute = require ("./routes/userRoute.js");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/expenses", expenseRoute);
app.use("/dashboard", dashRoute);
app.use("/budget", budgetRoute);
app.use("/auth", userRoute);

const PORT = process.env.PORT || 5000;

// require the database module so the pool is initialized
const { pool } = require("./db/db.js");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});