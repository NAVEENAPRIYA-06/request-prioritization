const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();

// 1. DATABASE CONNECTION (Restored for your local phpMyAdmin)
const db = mysql.createPool({
    host: "localhost",
    user: "root",              // Default for XAMPP
    password: "",              // Default is empty - leave as ""
    database: "request_tool_db", // Found in your image!
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(() => console.log("Website is back! Local MySQL Connected."))
    .catch((err) => console.error("Database connection failed:", err));

module.exports = db; 

// 2. GLOBAL MIDDLEWARE
app.use(cors()); 
app.use(express.json());

// 3. STATIC FILES
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }
app.use('/uploads', express.static(uploadDir));

// 4. ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const requestsRoute = require('./routes/requests');
const notificationRoutes = require('./routes/notifications');
const helpRoutes = require('./routes/help');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

// 5. ROUTE REGISTRATION
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// 6. SERVER START
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});