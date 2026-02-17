const express = require('express');
const router = express.Router();
const db = require('../index'); // Pulls the database pool exported from your index.js
// A helper function to record actions automatically
const recordLog = async (action, details) => {
    try {
        await db.query(
            "INSERT INTO audit_logs (admin_name, action, details) VALUES (?, ?, ?)", 
            ['ADMIN USER', action, details]
        );
    } catch (err) {
        console.error("Audit log failed to record:", err);
    }
};
// 1. Get all users for the User Directory
router.get('/users', async (req, res) => {
    const query = "SELECT id, name, email, role, created_at FROM users ORDER BY name ASC";
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get global system stats for Analytics
router.get('/stats', async (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM requests) as total,
            (SELECT COUNT(*) FROM requests WHERE status = 'Open') as pending,
            (SELECT COUNT(*) FROM requests WHERE status = 'In Progress') as processing,
            (SELECT COUNT(*) FROM requests WHERE status = 'Resolved') as resolved,
            (SELECT COUNT(*) FROM requests WHERE priority = 'Critical' AND status != 'Resolved') as critical
        FROM dual`;
    try {
        const [results] = await db.query(query);
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET individual user intelligence stats
router.get('/user-stats/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [requests] = await db.query(
            "SELECT status, COUNT(*) as count FROM requests WHERE user_id = ? GROUP BY status", 
            [userId]
        );
        
        const [feedback] = await db.query(
            "SELECT AVG(rating) as avgRating FROM feedback WHERE user_id = ?", 
            [userId]
        );

        res.status(200).json({
            requests: requests || [],
            rating: parseFloat(feedback[0]?.avgRating || 0).toFixed(1)
        });
    } catch (err) {
        console.error("Admin API Error:", err);
        res.status(500).json({ message: "Intelligence sync failed" });
    }
});

// 4. GET All Audit Logs for Admin Intelligence
router.get('/audit-logs', async (req, res) => {
    try {
        const query = `
            SELECT a.*, u.name as admin_name 
            FROM audit_logs a
            LEFT JOIN users u ON a.admin_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 100
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Audit Logs Error:", err);
        res.status(500).json({ message: "Failed to retrieve logs" });
    }
});

// 5. POST: Manual Action Log
router.post('/log-action', async (req, res) => {
    const { admin_id, action_type, details } = req.body;
    try {
        await db.query(
            "INSERT INTO audit_logs (admin_id, action_type, details) VALUES (?, ?, ?)",
            [admin_id, action_type, details]
        );
        res.status(201).json({ message: "Action logged" });
    } catch (err) {
        res.status(500).json({ message: "Logging failed" });
    }
});
// GET: All Departments
router.get('/departments', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM departments ORDER BY name ASC");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch departments" });
    }
});

// POST: Add New Department
router.post('/departments', async (req, res) => {
    const { name, manager_name } = req.body;
    try {
        await db.query("INSERT INTO departments (name, manager_name) VALUES (?, ?)", [name, manager_name]);
        res.status(201).json({ message: "Department added" });
    } catch (err) {
        res.status(500).json({ message: "Failed to add department" });
    }
});
// server/routes/admin.js

// 1. GET: All Departments with Request Counts
router.get('/departments', async (req, res) => {
    try {
        const query = `
            SELECT d.*, COUNT(r.id) as ticket_count 
            FROM departments d
            LEFT JOIN requests r ON d.name = r.category
            GROUP BY d.id
            ORDER BY d.name ASC
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch department intelligence" });
    }
});

// 2. DELETE: Remove a Department
router.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM departments WHERE id = ?", [id]);
        res.status(200).json({ message: "Department decommissioned" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});
// server/routes/admin.js

router.get('/departments', async (req, res) => {
    try {
        const query = `
            SELECT d.id, d.name, d.manager_name, 
            (SELECT COUNT(*) FROM requests WHERE category = d.name AND status != 'Resolved') as active_count
            FROM departments d
            ORDER BY d.name ASC
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Intelligence sync failed" });
    }
});
// server/routes/admin.js

// PUT: Update Department Lead Name
router.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { manager_name } = req.body;
    try {
        await db.query("UPDATE departments SET manager_name = ? WHERE id = ?", [manager_name, id]);
        res.status(200).json({ message: "Authorized Head updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Intelligence update failed" });
    }
});
// server/routes/admin.js

// GET: System Health Intelligence
router.get('/system-health', async (req, res) => {
    const startTime = Date.now();
    try {
        // Test Database Connection
        await db.query("SELECT 1");
        const dbLatency = Date.now() - startTime;

        res.status(200).json({
            status: "Operational",
            database: "Connected",
            latency: `${dbLatency}ms`,
            uptime: Math.floor(process.uptime()) + "s",
            serverTime: new Date().toLocaleTimeString(),
            memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB"
        });
    } catch (err) {
        res.status(500).json({ 
            status: "Critical", 
            database: "Disconnected",
            error: err.message 
        });
    }
});

// server/routes/admin.js

// 1. GET: Fetch all logs
router.get('/audit-logs', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM audit_logs ORDER BY timestamp DESC");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Log retrieval failed" });
    }
});

// 2. HELPER: Function to save a log (Internal use)
const logAction = async (action, details) => {
    try {
        await db.query("INSERT INTO audit_logs (action, details) VALUES (?, ?)", [action, details]);
    } catch (err) {
        console.error("Audit logging failed:", err);
    }
};
router.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Get name before deleting for the log
        const [dept] = await db.query("SELECT name FROM departments WHERE id = ?", [id]);
        
        // 2. Perform delete
        await db.query("DELETE FROM departments WHERE id = ?", [id]);
        
        // 3. RECORD THE LOG
        if(dept.length > 0) {
            await recordLog('DEPARTMENT_DELETED', `Deleted department: ${dept[0].name}`);
        }

        res.status(200).json({ message: "Department removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});
// server/routes/admin.js

router.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Fetch name for the log before deleting
        const [dept] = await db.query("SELECT name FROM departments WHERE id = ?", [id]);
        
        // 2. Delete the department
        await db.query("DELETE FROM departments WHERE id = ?", [id]);

        // 3. Trigger a REAL audit log entry
        if (dept.length > 0) {
            await db.query(
                "INSERT INTO audit_logs (action, details) VALUES (?, ?)", 
                ['DEPT_DELETED', `Admin decommissioned the ${dept[0].name} department.`]
            );
        }

        res.status(200).json({ message: "Action Logged" });
    } catch (err) {
        res.status(500).json({ message: "Logging failed" });
    }
});
module.exports = router;