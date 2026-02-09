const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const notificationRoutes = require('./routes/notifications');
const helpRoutes = require('./routes/help');
const feedbackRoutes = require('./routes/feedback');
dotenv.config();

const app = express(); // <--- APP INITIALIZED FIRST

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2. FILE UPLOAD SETUP
// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve the uploads folder so images are viewable in the browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/notifications', notificationRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/feedback', feedbackRoutes);
// 3. DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test connection
db.getConnection()
    .then(() => console.log("Connected to MySQL Database."))
    .catch((err) => console.error("Database connection failed:", err));

module.exports = db;

// 4. ROUTES
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// 5. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});