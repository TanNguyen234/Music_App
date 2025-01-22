const nodemailer =  require('nodemailer');

const sendMail = async (email: string, subject: string, html: string): Promise<any> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html
  }

  await transporter.sendMail(mailOptions, (error: any, res: Response) => {
    if (error) {
      return false;
    }else {
      return true;
    }
  });
}

export default sendMail;