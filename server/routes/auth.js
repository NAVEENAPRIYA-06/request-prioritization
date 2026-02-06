const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Registration Route
router.post('/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        await db.query(sql, [fullName, email, password, role || 'employee']);
        
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error", error: err });
    }
});

module.exports = router;