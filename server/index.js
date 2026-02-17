const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();

// 1. DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(() => console.log("Connected to MySQL Database."))
    .catch((err) => console.error("Database connection failed:", err));

// Export db BEFORE importing routes so they can use it
module.exports = db; 

// 2. GLOBAL MIDDLEWARE
app.use(cors({
    origin: "https://request-prioritization.vercel.app", // Your live Vercel link
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
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
const adminRoutes = require('./routes/admin'); //

// 5. ROUTE REGISTRATION
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes); // This enables the Audit Logs

// 6. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});