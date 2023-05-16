const nodemailer = require("nodemailer");

require("dotenv").config();

// create new transporter for email
const Transporter = nodemailer.createTransport({
  host: process.env.HOST_SERVICE,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// email Options
interface mailOptions {
  from: string;
  to: string;
  cc: Array<string>;
  bcc: Array<string>;
  subject: string;
  html: string;
}

//sending email to the given email address
const sendEmail = (mailOptions: mailOptions) => {
  Transporter.sendMail(mailOptions, (err: Error, info: String) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sended with=", info);
    }
  });
};

export default sendEmail;
