const { pool } = require("../db/db.js");
const { groupExpense } = require("./expenseController.js");


const addBudget = async (req, resp) => {
    try {
        const { user_id, category, amount } = req.body;

        // Try to update existing budget atomically
        const updated = await pool.query(
            'UPDATE budgets SET amount = amount + $3 WHERE user_id = $1 AND category = $2 RETURNING *',
            [user_id, category, parseFloat(amount)]
        );

        if (updated.rows.length > 0) {
            // Existing record updated
            return resp.status(200).json(updated.rows[0]);
        }

        // If no existing record, insert new one
        const inserted = await pool.query(
            'INSERT INTO budgets (user_id, category, amount) VALUES ($1, $2, $3) RETURNING *',
            [user_id, category, parseFloat(amount)]
        );

        return resp.status(201).json(inserted.rows[0]);

    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: error.message });
    }
};


const getBudget = async (req, resp) => {
    try {
        const { user_id } = req.params;
        const { month } = req.body; // e.g. "October 2025"

        // Convert month string ("October 2025") to numeric month and year
        const [monthName, year] = month.split(" ");
        const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;


        const budget = await pool.query(
            `SELECT *
            FROM budgets
      WHERE user_id = $1
      AND EXTRACT(MONTH FROM created_at) = $2
      AND EXTRACT(YEAR FROM created_at) = $3
      ORDER BY created_at DESC
            `, [user_id, monthNumber, year]
            // 'SELECT * FROM expenses WHERE user_id = $1 ',
            // [user_id]
        );
        // const budget = await pool.query(
        //     'SELECT * FROM budgets WHERE user_id = $1',
        //     [user_id]
        // );
        resp.status(200).send(budget.rows);
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
};

const deleteBudget = async (req, resp) => {

    try {
        const { user_id, budget_id } = req.params;
        const deleted = await pool.query(
            'DELETE FROM budgets WHERE budget_id = $1 AND user_id = $2 RETURNING *',
            [budget_id, user_id]
        );
        resp.status(200).json({
            message: "Budget deleted successfully",
            deletedBudget: deleted.rows[0]
        });

    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
};

// const getTotalSpent = async (req, resp) => {
//     try {
//         const { user_id } = req.params;
//         const totalSpent = await pool.query(
//             'SELECT category,  SUM(amount) as total_spent  FROM expenses WHERE user_id = $1 GROUP BY category',
//             [user_id]
//         );
//         console.log("Total Spent:", totalSpent.rows);
//         resp.status(200).send(totalSpent.rows);
//     } catch (error) {
//         resp.status(500).json({ error: error.message });
//     }
// }

const getTotalSpent = async (req, resp) => {
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

        const totalSpent = await pool.query(query, [user_id, monthNumber, year]);
        resp.status(200).send(totalSpent.rows);

    } catch (err) {
        console.error("Error fetching grouped expenses:", err);
        resp.status(500).json({ error: err.message });
    }
};


module.exports = { addBudget, getBudget, deleteBudget, getTotalSpent };