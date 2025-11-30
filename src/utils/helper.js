import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const verifyPayload = (payload, body) => {
    for (const key of Object.keys(payload)) {
        if (!body[key]) {
            return false;
        }
    }
    return true;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,               
  secure: false,            
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,  
  },
});

const sendNewReleaseMail = async (title, emails) => {
  try {
    for (const email in emails) {
      await transporter.sendMail({
        from: `"MyApp" <${SMTP_USER}>`,
        to: email,
        subject: "New release notification",
        text: `New book titled "${title}" has been added to the collection.`,
      });
    }
    return true;
  } catch (err) {
    console.log('Error sending email:', err);
    return false;
  }
};

const contactRequestMail = async (email, message) => {
  try {
    await transporter.sendMail({
      from: `"MyApp" <${SMTP_USER}>`,
      to: email,
      subject: "Contact Request",
      text: `${message}`,
    });
    return true;
  } catch (err) {
    console.log('Error sending email:', err);
    return false;
  }
};

export { verifyPayload, transporter, sendNewReleaseMail, contactRequestMail };