const  nodemailer = require('nodemailer');

const sendEmail = async options =>{
    //Create a transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD
        }
    });

    //define the email options
    const mailOptions = {
        from: 'ARENA 360 <hello@Arena.com>',
        to: options.email,
        subject: options.subject,
        text: options.message

        //html;
    }

    // Actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;