const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust based on your DB config path
const { verifyToken, isAdmin } = require('../middleware/auth'); // Adjust based on your middleware

// Get all users for the Directory
router.get('/users', verifyToken, isAdmin, (req, res) => {
    const query = "SELECT id, name, email, role, created_at FROM users ORDER BY name ASC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get global system stats for Analytics
router.get('/stats', verifyToken, isAdmin, (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM requests) as total,
            (SELECT COUNT(*) FROM requests WHERE status = 'Open') as pending,
            (SELECT COUNT(*) FROM requests WHERE status = 'In Progress') as processing,
            (SELECT COUNT(*) FROM requests WHERE status = 'Resolved') as resolved,
            (SELECT COUNT(*) FROM requests WHERE priority = 'Critical' AND status != 'Resolved') as critical
        FROM dual`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

module.exports = router;