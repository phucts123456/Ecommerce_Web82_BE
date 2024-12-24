const nodemailer = require("nodemailer");
require("dotenv").config();
const sendMail = async ({email , subject, html}) => {
    console.log(process.env.NODE_MAILER_EMAIL)
    console.log(process.env.NODE_MAILER_CODE)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: "Gmail",
        auth: {
            user: process.env.NODE_MAILER_EMAIL,
            pass: process.env.NODE_MAILER_CODE
        }
    })

    const message = {
        from: "Admin",
        to: email,
        subject:subject,
        html:html
    }

    const result = await transporter.sendMail(message);
    return result;
}

module.exports = sendMail