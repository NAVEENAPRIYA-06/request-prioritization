const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all FAQs and Guides
router.get('/faqs', async (req, res) => {
    try {
        const faqs = [
            { 
                id: 1, 
                category: 'Account', 
                question: 'How do I change my profile photo?', 
                answer: 'Navigate to Settings, click "Browse Gallery" under your avatar, and select a new image from your computer.' 
            },
            { 
                id: 2, 
                category: 'Requests', 
                question: 'What is a "Critical" priority?', 
                answer: 'Critical priority is reserved for system-wide outages or blockers that prevent all work. These notify admins immediately.' 
            },
            { 
                id: 3, 
                category: 'Security', 
                question: 'How often should I update my password?', 
                answer: 'We recommend updating your security credentials every 90 days via the Security tab in Settings.' 
            }
        ];
        res.status(200).json(faqs);
    } catch (err) {
        res.status(500).json({ message: "Error loading help data" });
    }
});

// server/routes/help.js

// Fetch detailed platform guides
router.get('/guides', async (req, res) => {
    try {
        const guides = [
            {
                id: 'g1',
                title: 'Getting Started',
                steps: [
                    'Log in using your corporate credentials.',
                    'Update your profile in the Settings menu.',
                    'Navigate to New Request to log your first ticket.'
                ],
                tag: 'Basics'
            },
            {
                id: 'g2',
                title: 'Priority Levels',
                steps: [
                    'Use Low for general inquiries.',
                    'Use High for department-specific issues.',
                    'Use Critical ONLY for system-wide outages.'
                ],
                tag: 'Process'
            }
        ];
        res.status(200).json(guides);
    } catch (err) {
        res.status(500).json({ message: "Error fetching guides" });
    }
});

module.exports = router;