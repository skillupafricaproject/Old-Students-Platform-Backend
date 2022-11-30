 require('dotenv').config()
const  nodemailer = require('nodemailer');


// const sendEmail = async options =>{
//     //Create a transporter
//     const transporter = nodemailer.createTransport({
//         host: "smtp.mailtrap.io",
//         port: 2525,
//         //secure: true,
//         auth: {
//           user: process.env.MAILTRAP_USERNAME,
//           pass: process.env.MAILTRAP_PASSWORD
//         },
//     //     tls: {
//     //         rejectUnauthorized: false, 
//     //     }
//     });

    // sendEmail.verify(function(error, success){
    //     if (error) {
    //         console.log(error);
    //       } else {
    //         console.log('Server is ready to take our messages');
    //       }
    // })
    //define the email options
    // const mailOptions = {
    //     from: 'ARENA 360 <hello@Arena.com>',
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message
    // }
    // //     //html;
    // // }
    


     //Actually send the email
//      await transporter.sendEMail(mailOptions)
 
//  }

// exports.mailTransport = () =>
//     nodemailer.createTransport({
//         host: "smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//             user: process.env.SMS_USER,
//             pass: process.env.SMS_PASS,
//         },
//     });


const mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});


mailTransport.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

module.exports =  mailTransport 
  
    // transporter
    //   .sendMail({
    //     from: '"Node tes👻" <foo@example.com>', // sender address
    //     to: 'festuspeteragbo@gmail.com', // list of receivers
    //     subject: 'we are good to go', // Subject line
    //     // text: "Trying from the server with env keys", // plain text body
    //     html: '<b>Hello from Festus</b>', // html body
    //   })
      


