const { pool } = require("../db/db.js");
const bcrypt = require("bcrypt");

const signup = async (req, resp) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users(username, email, password) VALUES ($1,$2,$3) RETURNING *',
            [username, email, hashedPassword]
        );

        if (result.rows.length > 0) {
            resp.status(201).json(result.rows[0]);
        }
        else {
            resp.status(400).json({ message: "Login failed" });
        }
    } catch (error) {
        resp.status(500).json({ error: err.message });
    }
};

const login = async (req, resp) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(
            "SELECT user_id, username, email, password FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return resp.status(400).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return resp.status(400).json({ message: "Invalid email or password" });
        }

        delete user.password;
        resp.status(200).json(user);

    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
}

module.exports = { signup, login };