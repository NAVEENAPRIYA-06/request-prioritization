const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new request
router.post('/create', async (req, res) => {
    const { userId, title, description, category, priority } = req.body;

    try {
        const sql = "INSERT INTO requests (user_id, title, description, category, priority) VALUES (?, ?, ?, ?, ?)";
        await db.query(sql, [userId, title, description, category, priority]);
        res.status(201).json({ message: "Request submitted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving request", error: err });
    }
});
// Get stats for a specific user
router.get('/stats/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved,
                COUNT(CASE WHEN priority = 'Critical' OR priority = 'High' THEN 1 END) as highPriority
             FROM requests WHERE user_id = ?`, [userId]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});
// Get all requests for a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC", 
            [userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching requests" });
    }
});
// Get ALL requests for Admin view
router.get('/admin/all', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT requests.*, users.name as employee_name 
             FROM requests 
             JOIN users ON requests.user_id = users.id 
             ORDER BY created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching admin data" });
    }
});

// Update request status
router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query("UPDATE requests SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Status updated!" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});
// Get stats - Professional Version
router.get('/stats/:userId/:role', async (req, res) => {
    const { userId, role } = req.params;
    try {
        let sql = "";
        let params = [];

        if (role === 'admin') {
            // Admins see TOTAL company stats
            sql = `SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
                    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved,
                    COUNT(CASE WHEN priority = 'Critical' OR priority = 'High' THEN 1 END) as highPriority
                 FROM requests`;
        } else {
            // Employees see only THEIR stats
            sql = `SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
                    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved,
                    COUNT(CASE WHEN priority = 'Critical' OR priority = 'High' THEN 1 END) as highPriority
                 FROM requests WHERE user_id = ?`;
            params = [userId];
        }

        const [rows] = await db.query(sql, params);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});
// Updated Delete Route
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT status FROM requests WHERE id = ?", [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: "Request not found" });
        
        // Allow deletion if status is 'Pending' OR 'Open'
        const allowedStatuses = ['Pending', 'Open'];
        if (!allowedStatuses.includes(rows[0].status)) {
            return res.status(400).json({ message: "Cannot delete a request that is already in progress or resolved." });
        }

        await db.query("DELETE FROM requests WHERE id = ?", [id]);
        res.json({ message: "Request cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting request" });
    }
});
// server/routes/requests.js -> GET /stats/:userId/:role
router.get('/stats/:userId/:role', async (req, res) => {
    const { userId, role } = req.params;
    try {
        let sql = "";
        let params = [];

        // Updated query to group 'Open' and 'Pending' together for the yellow count
        const statsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'Pending' OR status = 'Open' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved,
                COUNT(CASE WHEN priority = 'Critical' OR priority = 'High' THEN 1 END) as highPriority
            FROM requests
        `;

        if (role === 'admin') {
            sql = statsQuery;
        } else {
            sql = statsQuery + ` WHERE user_id = ?`;
            params = [userId];
        }

        const [rows] = await db.query(sql, params);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching stats" });
    }
});
// Get all resolved requests for the Archive/Vault (Admin Only)
router.get('/admin/resolved', async (req, res) => {
    try {
        const [resolved] = await db.query(
            "SELECT id, title, category, priority, status, updated_at FROM requests WHERE status = 'Resolved' ORDER BY updated_at DESC"
        );
        res.status(200).json(resolved);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
module.exports = router;