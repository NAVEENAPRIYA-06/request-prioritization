const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get notifications for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", 
            [req.params.userId]
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err });
    }
});

// Mark notification as read
router.put('/read/:id', async (req, res) => {
    try {
        await db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id]);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

// server/routes/notifications.js

router.get('/user-feed/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await db.query(`
            SELECT n.*, r.title as request_title 
            FROM notifications n
            LEFT JOIN requests r ON n.request_id = r.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC LIMIT 20
        `, [userId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to sync notification intelligence" });
    }
});

module.exports = router;