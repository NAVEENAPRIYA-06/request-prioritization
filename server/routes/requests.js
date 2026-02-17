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
// server/routes/feedback.js

// GET: Feedback Distribution and Average
router.get('/stats', async (req, res) => {
    try {
        const [distRows] = await db.query(`
            SELECT rating, COUNT(*) as count 
            FROM feedback 
            GROUP BY rating 
            ORDER BY rating DESC
        `);
        
        const [avgRows] = await db.query("SELECT AVG(rating) as average FROM feedback");

        res.status(200).json({
            distribution: distRows,
            average: parseFloat(avgRows[0].average || 0).toFixed(1)
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching feedback stats" });
    }
});

// server/routes/requests.js

router.put('/admin/update-status', async (req, res) => {
    const { request_id, status, admin_id, note } = req.body;

    try {
        // 1. Update the request status
        await db.query(
            "UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [status, request_id]
        );

        // 2. Create the Admin Log entry
        await db.query(
            "INSERT INTO admin_logs (admin_id, request_id, action_type, action_note) VALUES (?, ?, ?, ?)",
            [admin_id, request_id, status, note || `Request moved to ${status}`]
        );

        res.status(200).json({ message: `Request ${status} successfully and logged.` });
    } catch (err) {
        res.status(500).json({ message: "Action failed", error: err });
    }
});

// server/routes/requests.js

router.get('/admin/stats-full', async (req, res) => {
    try {
        // Fetch all requests for volume stats
        const [requests] = await db.query("SELECT status, priority FROM requests");
        
        // Fetch average rating for the Service Quality widget
        const [avgRows] = await db.query("SELECT AVG(rating) as averageRating FROM feedback");
        
        // Fetch latest feedback entries
        const [latestFeedback] = await db.query(`
            SELECT f.*, u.name as user_name 
            FROM feedback f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.created_at DESC LIMIT 3
        `);

        res.status(200).json({
            requests,
            averageRating: avgRows[0].averageRating || 0,
            latestFeedback
        });
    } catch (err) {
        res.status(500).json({ message: "Analytics query failed" });
    }
});

// server/routes/requests.js

// GET: Advanced Search for Resolved Archive
router.get('/admin/archive-search', async (req, res) => {
    const { term, priority } = req.query;
    
    try {
        let query = `
            SELECT r.*, u.name as user_name 
            FROM requests r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.status = 'Resolved'
        `;
        const params = [];

        if (term) {
            query += ` AND (u.name LIKE ? OR r.title LIKE ?)`;
            params.push(`%${term}%`, `%${term}%`);
        }

        if (priority && priority !== 'All') {
            query += ` AND r.priority = ?`;
            params.push(priority);
        }

        query += ` ORDER BY r.updated_at DESC`;

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Archive retrieval failed" });
    }
});
// server/routes/requests.js

router.get('/sla-tracker', async (req, res) => {
    try {
        // Fetch only active (non-resolved) requests
        const [rows] = await db.query(`
            SELECT id, title, priority, created_at, status 
            FROM requests 
            WHERE status != 'Resolved'
            ORDER BY created_at ASC
        `);

        const trackedRequests = rows.map(req => {
            const createdDate = new Date(req.created_at);
            const now = new Date();
            
            // Define SLA hours based on priority
            const slaHours = req.priority === 'Critical' ? 4 : req.priority === 'High' ? 24 : 72;
            const deadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
            const diffMs = deadline - now;
            
            return {
                ...req,
                deadline,
                msRemaining: diffMs,
                isOverdue: diffMs < 0,
                isNearDeadline: diffMs > 0 && diffMs < (slaHours * 0.2 * 60 * 60 * 1000), // Last 20% of time
                autoEscalation: diffMs < 0 && req.priority !== 'Critical' ? 'Active' : 'N/A'
            };
        });

        res.status(200).json(trackedRequests);
    } catch (err) {
        res.status(500).json({ message: "SLA synchronization failed" });
    }
});
// server/routes/requests.js
const { sendSLAAlert } = require('../utils/mailer');

router.get('/sla-tracker', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.*, u.email as user_email 
            FROM requests r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.status != 'Resolved'
        `);

        // Logic to trigger email if isOverdue is true and alert hasn't been sent
        rows.forEach(async (req) => {
            const deadline = new Date(new Date(req.created_at).getTime() + 4 * 60 * 60 * 1000); // Example 4h SLA
            if (new Date() > deadline && req.priority !== 'Critical') {
                // This is where you would call sendSLAAlert(req.user_email, req.title, 'Overdue');
            }
        });

        // ... existing map logic for frontend ...
        res.status(200).json(processedRows);
    } catch (err) {
        res.status(500).json({ message: "SLA sync failed" });
    }
});
// server/routes/requests.js

router.get('/sla-tracker', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, title, priority, created_at, status 
            FROM requests 
            WHERE status != 'Resolved'
        `);

        const updatedRequests = await Promise.all(rows.map(async (req) => {
            const createdDate = new Date(req.created_at);
            const now = new Date();
            
            // Priority-based SLA Hours
            const slaHours = req.priority === 'Critical' ? 4 : req.priority === 'High' ? 24 : 72;
            const deadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
            const diffMs = deadline - now;
            
            let currentPriority = req.priority;
            let autoEscalated = false;

            // Auto-Escalation Logic: If overdue and not yet Critical, bump it up
            if (diffMs < 0 && req.priority !== 'Critical') {
                const nextPriority = req.priority === 'Low' ? 'Medium' : req.priority === 'Medium' ? 'High' : 'Critical';
                
                // Update the database permanently
                await db.query("UPDATE requests SET priority = ? WHERE id = ?", [nextPriority, req.id]);
                currentPriority = nextPriority;
                autoEscalated = true;
            }

            return {
                ...req,
                priority: currentPriority,
                deadline,
                msRemaining: diffMs,
                isOverdue: diffMs < 0,
                autoEscalation: autoEscalated ? 'Active' : 'N/A'
            };
        }));

        res.status(200).json(updatedRequests);
    } catch (err) {
        res.status(500).json({ message: "Auto-escalation sync failed" });
    }
});
// server/routes/requests.js

// GET: Export Resolved Data as JSON/CSV
router.get('/admin/export-data', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.id as Request_ID, 
                u.name as Requester, 
                r.title as Subject, 
                r.priority as Priority, 
                r.category as Category,
                r.status as Status,
                r.created_at as Created_Date,
                r.updated_at as Resolved_Date
            FROM requests r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.status = 'Resolved'
            ORDER BY r.updated_at DESC
        `);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Export failed" });
    }
});

// server/routes/requests.js

// GET: Export Resolved Intelligence Data
router.get('/admin/export-data', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.id AS 'Request ID',
                u.name AS 'Requester Name',
                r.title AS 'Subject',
                r.category AS 'Category',
                r.priority AS 'Final Priority',
                r.status AS 'Current Status',
                DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS 'Created At',
                DATE_FORMAT(r.updated_at, '%Y-%m-%d %H:%i') AS 'Resolved At'
            FROM requests r
            JOIN users u ON r.user_id = u.id
            WHERE r.status = 'Resolved'
            ORDER BY r.updated_at DESC
        `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No resolved data found for export" });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error("Export Error:", err);
        res.status(500).json({ message: "Internal Server Error during export" });
    }
});

module.exports = router;