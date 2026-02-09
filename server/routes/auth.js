const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Registration Route
router.post('/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        await db.query(sql, [fullName, email, password, role || 'employee']);
        
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error", error: err });
    }
});
// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);

        if (users.length > 0) {
            res.status(200).json({ message: "Login successful!", user: users[0] });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
// Get User Directory (Admin Only)
router.get('/directory', async (req, res) => {
    try {
        // Fetching id, name, email, and role for the directory
        const [users] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY name ASC");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
// server/routes/auth.js
 // Ensure bcrypt is imported for password hashing

// 1. Update Profile (Name)
router.put('/update-profile/:id', async (req, res) => {
    const { name } = req.body;
    try {
        await db.query("UPDATE users SET name = ? WHERE id = ?", [name, req.params.id]);
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err });
    }
});

// 2. Change Password
router.put('/change-password/:id', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        // Fetch current user data
        const [users] = await db.query("SELECT password FROM users WHERE id = ?", [req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        // Hash and save new password
        const hashedPw = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPw, req.params.id]);
        
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error changing password", error: err });
    }
});

// server/routes/auth.js

// 1. Update User Performance/Role (Admin Only)
router.put('/admin/update-user/:id', async (req, res) => {
    const { role, performance_note } = req.body;
    try {
        await db.query(
            "UPDATE users SET role = ?, performance_note = ? WHERE id = ?", 
            [role, performance_note, req.params.id]
        );
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating user data", error: err });
    }
});

// 2. Toggle User Access (Admin Only)
router.put('/admin/toggle-access/:id', async (req, res) => {
    const { status } = req.body; // status could be 'active' or 'suspended'
    try {
        await db.query("UPDATE users SET account_status = ? WHERE id = ?", [status, req.params.id]);
        res.status(200).json({ message: `User account ${status}` });
    } catch (err) {
        res.status(500).json({ message: "Error toggling access" });
    }
});

// server/routes/auth.js

// Update Profile Photo URL
router.put('/update-photo/:id', async (req, res) => {
    const { photoUrl } = req.body;
    try {
        await db.query("UPDATE users SET profile_pic = ? WHERE id = ?", [photoUrl, req.params.id]);
        res.status(200).json({ message: "Profile photo updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating photo", error: err });
    }
});

router.put('/upload-photo/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        
        // Generate the URL for the stored file
        const photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        
        await db.query("UPDATE users SET profile_pic = ? WHERE id = ?", [photoUrl, req.params.id]);
        res.status(200).json({ message: "Photo uploaded", photoUrl });
    } catch (err) {
        res.status(500).json({ message: "Server error during upload", error: err });
    }
});

router.put('/upload-photo/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file received by server" });
        }
        
        // Construct the full URL for the frontend to display
        const photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        
        await db.query("UPDATE users SET profile_pic = ? WHERE id = ?", [photoUrl, req.params.id]);
        res.status(200).json({ message: "Upload successful", photoUrl });
    } catch (err) {
        res.status(500).json({ message: "Database update failed", error: err });
    }
});

module.exports = router;
