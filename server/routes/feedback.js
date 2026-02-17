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

// server/routes/feedback.js

// Fetch latest feedback as notifications for Admin
router.get('/admin/notifications', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.id, f.rating, f.comment, f.created_at, u.name as user_name 
            FROM feedback f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC 
            LIMIT 10
        `);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching feedback alerts" });
    }
});
// server/routes/feedback.js
router.get('/admin/notifications', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.id, f.rating, f.comment, f.created_at, u.name as user_name 
            FROM feedback f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC 
            LIMIT 10
        `);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching feedback alerts" });
    }
});
module.exports = router;