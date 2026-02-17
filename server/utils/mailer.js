// server/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendSLAAlert = async (userEmail, requestTitle, status) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `⚠️ SLA BREACH: ${requestTitle}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #e11d48;">SLA Deadline Breached</h2>
                <p>The request <strong>"${requestTitle}"</strong> has exceeded its allocated resolution time.</p>
                <p><strong>Current Status:</strong> ${status}</p>
                <div style="margin-top: 20px; padding: 15px; background: #fff1f2; color: #be123c; border-radius: 8px;">
                    Action required: Please review this ticket in the AdminHub immediately.
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendSLAAlert };