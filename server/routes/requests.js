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

// server/routes/requests.js

// Update request status (Resolve logic)
router.put('/update/:id', async (req, res) => {
    const { status } = req.body;
    const requestId = req.params.id;

    try {
        // 1. Get the user_id and title of the request before updating
        const [requestData] = await db.query(
            "SELECT user_id, title FROM requests WHERE id = ?", 
            [requestId]
        );

        if (requestData.length === 0) return res.status(404).send("Request not found");
        const { user_id, title } = requestData[0];

        // 2. Update the request status to 'Resolved'
        await db.query("UPDATE requests SET status = ? WHERE id = ?", [status, requestId]);

        // 3. AUTO-TRIGGER NOTIFICATION
        if (status === 'Resolved') {
            await db.query(
                "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
                [
                    user_id, 
                    "Request Resolved", 
                    `Your request for "${title}" has been successfully completed by the admin.`, 
                    'success'
                ]
            );
        }

        res.status(200).json({ message: "Status updated and notification sent" });
    } catch (err) {
        res.status(500).json({ message: "Error processing resolution", error: err });
    }
});

// server/routes/requests.js

// Get Analytics Data (Admin Only)
router.get('/admin/analytics', async (req, res) => {
    try {
        // 1. Category Distribution
        const [categoryData] = await db.query(
            "SELECT category as name, COUNT(*) as value FROM requests GROUP BY category"
        );

        // 2. Weekly Trend (Last 7 Days)
        const [trendData] = await db.query(
            "SELECT DATE(created_at) as date, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date"
        );

        // 3. Efficiency Stats
        const [efficiency] = await db.query(
            "SELECT status, COUNT(*) as count FROM requests GROUP BY status"
        );

        res.status(200).json({ categoryData, trendData, efficiency });
    } catch (err) {
        res.status(500).json({ message: "Analytics fetch failed", error: err });
    }
});

// server/routes/requests.js

router.get('/admin/analytics', async (req, res) => {
    const { timeframe } = req.query; // daily, weekly, monthly
    try {
        let trendQuery = "";
        
        if (timeframe === 'daily') {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%H:00') as label, COUNT(*) as count FROM requests WHERE DATE(created_at) = CURDATE() GROUP BY hour(created_at) ORDER BY created_at";
        } else if (timeframe === 'monthly') {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%b %d') as label, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY created_at";
        } else {
            // Default Weekly
            trendQuery = "SELECT DATE_FORMAT(created_at, '%a') as label, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY created_at";
        }

        const [trendData] = await db.query(trendQuery);
        const [categoryData] = await db.query("SELECT category as name, COUNT(*) as value FROM requests GROUP BY category");
        
        res.status(200).json({ trendData, categoryData });
    } catch (err) {
        res.status(500).json({ message: "Analytics fetch failed", error: err });
    }
});

router.get('/admin/analytics', async (req, res) => {
    const { timeframe } = req.query;
    try {
        let trendQuery = "";
        // Aggregating data based on timeframe to create chart points
        if (timeframe === 'daily') {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%H:00') as label, COUNT(*) as count FROM requests WHERE DATE(created_at) = CURDATE() GROUP BY hour(created_at) ORDER BY created_at";
        } else if (timeframe === 'monthly') {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%b %d') as label, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY created_at";
        } else {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%a') as label, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY created_at";
        }

        const [trendData] = await db.query(trendQuery);
        const [categoryData] = await db.query("SELECT category as name, COUNT(*) as value FROM requests GROUP BY category");
        
        res.status(200).json({ trendData, categoryData });
    } catch (err) {
        res.status(500).json({ message: "Analytics fetch failed", error: err });
    }
});
// server/routes/requests.js

router.get('/admin/analytics', async (req, res) => {
    const { timeframe } = req.query;
    try {
        // 1. Fetch Trend Data based on timeframe
        let trendQuery = "";
        if (timeframe === 'daily') {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%H:00') as label, COUNT(*) as count FROM requests WHERE DATE(created_at) = CURDATE() GROUP BY hour(created_at) ORDER BY created_at";
        } else if (timeframe === 'monthly') {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%b %d') as label, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY created_at";
        } else {
            trendQuery = "SELECT DATE_FORMAT(created_at, '%a') as label, COUNT(*) as count FROM requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY created_at";
        }

        const [trendData] = await db.query(trendQuery);

        // 2. Fetch Global Stats for cards and gauge
        const [statsRows] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN priority = 'Critical' AND status != 'Resolved' THEN 1 ELSE 0 END) as urgent
            FROM requests
        `);

        // Ensure we send back a valid object even if the table is empty
        const stats = statsRows[0] || { total: 0, resolved: 0, pending: 0, urgent: 0 };

        res.status(200).json({ 
            trendData, 
            stats: {
                total: stats.total || 0,
                resolved: stats.resolved || 0,
                pending: stats.pending || 0,
                urgent: stats.urgent || 0
            } 
        });
    } catch (err) {
        res.status(500).json({ message: "Analytics fetch failed", error: err });
    }
});

// server/routes/requests.js

// Fetch all active (non-resolved) requests for the Admin
router.get('/admin/active', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT r.*, u.name as user_name FROM requests r JOIN users u ON r.user_id = u.id WHERE r.status != 'Resolved' ORDER BY r.priority = 'Critical' DESC, r.created_at ASC"
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching active queue", error: err });
    }
});

// The Resolve Action
router.put('/resolve/:id', async (req, res) => {
    const requestId = req.params.id;
    try {
        // 1. Get request details for the notification
        const [requestData] = await db.query("SELECT user_id, title FROM requests WHERE id = ?", [requestId]);
        if (requestData.length === 0) return res.status(404).send("Request not found");
        
        const { user_id, title } = requestData[0];

        // 2. Move to Resolved status
        await db.query("UPDATE requests SET status = 'Resolved' WHERE id = ?", [requestId]);

        // 3. Trigger automatic notification for the user
        await db.query(
            "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
            [user_id, "Request Resolved", `Great news! Your request "${title}" has been completed.`, 'success']
        );

        res.status(200).json({ message: "Request successfully resolved" });
    } catch (err) {
        res.status(500).json({ message: "Resolution failed", error: err });
    }
});

// server/routes/requests.js

// Update status with specific notification for rejection
router.put('/update-status/:id', async (req, res) => {
    const { status } = req.body; // 'In Progress', 'Resolved', or 'Rejected'
    const requestId = req.params.id;

    try {
        const [requestData] = await db.query("SELECT user_id, title FROM requests WHERE id = ?", [requestId]);
        if (requestData.length === 0) return res.status(404).send("Request not found");
        const { user_id, title } = requestData[0];

        // Update main request status
        await db.query("UPDATE requests SET status = ? WHERE id = ?", [status, requestId]);

        // Trigger specific notification based on choice
        let notifTitle = "Status Update";
        let notifMsg = `Your request "${title}" is now ${status}.`;
        let notifType = 'info';

        if (status === 'Resolved') {
            notifTitle = "Request Resolved";
            notifMsg = `Great news! Your request "${title}" has been completed.`;
            notifType = 'success';
        } else if (status === 'Rejected') {
            notifTitle = "Request Rejected";
            notifMsg = `Your request "${title}" could not be processed at this time.`;
            notifType = 'alert';
        }

        await db.query(
            "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
            [user_id, notifTitle, notifMsg, notifType]
        );

        res.status(200).json({ message: `Status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// server/routes/requests.js

// Fetch all archived requests (Resolved or Rejected)
router.get('/admin/archives', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT r.*, u.name as employee_name 
             FROM requests r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.status IN ('Resolved', 'Rejected') 
             ORDER BY r.updated_at DESC`
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching archives", error: err });
    }
});

// server/routes/analytics.js

router.get('/admin/feedback-stats', async (req, res) => {
    try {
        // Get average rating
        const [avgRows] = await db.query("SELECT AVG(rating) as averageRating FROM feedback");
        
        // Get latest 5 comments with user names
        const [commentRows] = await db.query(`
            SELECT f.*, u.name as user_name 
            FROM feedback f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC 
            LIMIT 5
        `);

        res.status(200).json({
            averageRating: parseFloat(avgRows[0].averageRating || 0).toFixed(1),
            latestFeedback: commentRows
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching feedback stats", error: err });
    }
});

// server/routes/requests.js

// Combined Analytics Endpoint
router.get('/admin/stats-full', async (req, res) => {
    try {
        // 1. Fetch Request Stats
        const [requestRows] = await db.query("SELECT status, priority FROM requests");
        
        // 2. Fetch Feedback Stats
        const [avgRows] = await db.query("SELECT AVG(rating) as averageRating FROM feedback");
        
        // 3. Fetch Latest Comments
        const [commentRows] = await db.query(`
            SELECT f.*, u.name as user_name 
            FROM feedback f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC 
            LIMIT 3
        `);

        res.status(200).json({
            requests: requestRows,
            averageRating: parseFloat(avgRows[0].averageRating || 0).toFixed(1),
            latestFeedback: commentRows
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching system metrics", error: err });
    }
});


module.exports = router;