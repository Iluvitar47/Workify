const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailModel {
    send = async (body) => {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const info = await transporter.sendMail({
            from: body.emailSender,
            to: body.emailReceiver,
            subject: body.subject,
            text: body.message
        });
    
        return info;
    }
}

module.exports = new EmailModel;