const nodemailer = require("nodemailer");

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // for Gmail
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,      // Your email
        pass: process.env.SMTP_PASSWORD,   // App password if Gmail
    },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"Student Feedback System" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
        });
        console.log("Email sent: ", info.messageId);
    } catch (err) {
        console.error("Error sending email: ", err);
        throw new Error("Failed to send email");
    }
};

module.exports = { sendEmail };
