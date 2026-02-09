const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST: Submit user feedback
router.post('/submit', async (req, res) => {
    const { user_id, rating, comment } = req.body;
    
    if (!user_id || !rating) {
        return res.status(400).json({ message: "User ID and Rating are required" });
    }

    try {
        await db.query(
            "INSERT INTO feedback (user_id, rating, comment) VALUES (?, ?, ?)",
            [user_id, rating, comment]
        );
        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save feedback", error: err });
    }
});

module.exports = router;