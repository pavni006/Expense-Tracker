const { pool } = require("../db/db.js");

const addExpense = async (req, resp) => {

    try {
        const { user_id, category, amount } = req.body;
        const expense = await pool.query(
            'INSERT INTO expenses( user_id, category, amount) VALUES ($1, $2, $3) RETURNING *',
            [user_id, category, amount]
        );
        resp.status(201).send(expense.rows[0]);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }

};

const getExpense = async (req, resp) => {

    try {
        const { user_id } = req.params;
        const { month } = req.body; // e.g. "October 2025"

        // Convert month string ("October 2025") to numeric month and year
        const [monthName, year] = month.split(" ");
        const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;


        const expense = await pool.query(
            `SELECT *
            FROM expenses
      WHERE user_id = $1
      AND EXTRACT(MONTH FROM created_at) = $2
      AND EXTRACT(YEAR FROM created_at) = $3
      ORDER BY created_at DESC
            `, [user_id, monthNumber, year]
            // 'SELECT * FROM expenses WHERE user_id = $1 ',
            // [user_id]
        );
        resp.status(200).send(expense.rows);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }

};

const deleteExpense = async (req, resp) => {
    try {
        const { user_id, expense_id } = req.params;
        const deleted = await pool.query(
            'DELETE FROM expenses WHERE expense_id = $1 AND user_id=$2 RETURNING *',
            [expense_id, user_id]
        );

        resp.status(200).json({
            message: "Expense deleted successfully",
            deletedExpense: deleted.rows[0], // return deleted expense info
        });
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};

// const groupExpense = async (req, resp) => {
//     try {
//         const { user_id } = req.params;
//         const grouped = await pool.query(
//             'SELECT category ,  SUM(amount) as total_amount FROM expenses WHERE user_id = $1 GROUP BY category ',
//             [user_id]
//         );

//         resp.status(200).send(grouped.rows);
//     } catch (err) {
//         resp.status(500).json({ error: err.message });
//     }
// };

const groupExpense = async (req, resp) => {
  try {
    const { user_id } = req.params;
    const { month } = req.body; // e.g. "October 2025"

    // Convert month string to numeric month and year
    const [monthName, year] = month.split(" ");
    const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;

    const query = `
      SELECT 
        category, 
        SUM(amount) AS total_amount 
      FROM expenses 
      WHERE user_id = $1
        AND EXTRACT(MONTH FROM created_at) = $2
        AND EXTRACT(YEAR FROM created_at) = $3
      GROUP BY category
      ORDER BY total_amount DESC
    `;

    const grouped = await pool.query(query, [user_id, monthNumber, year]);
    resp.status(200).send(grouped.rows);

  } catch (err) {
    console.error("Error fetching grouped expenses:", err);
    resp.status(500).json({ error: err.message });
  }
};


module.exports = { getExpense, addExpense, deleteExpense, groupExpense };