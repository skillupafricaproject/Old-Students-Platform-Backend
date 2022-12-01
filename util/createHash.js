// const mg = require('mailgun-js')
// const nodemailer = require('nodemailer')
// exports.genOTP = () =>{
//     let otp = '';
//     for(let i = 0; i<=4; i++){
//     const randval = Math.round(Math.random()*9)
//     otp += randval 
//     }
//     return otp;
// }

const crypto = require("crypto");

const hashString = (string) =>
    crypto.createHash("md5").update("string").digest("hex");

module.exports = hashString;