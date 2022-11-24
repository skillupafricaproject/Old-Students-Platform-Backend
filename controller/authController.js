const {promisify} = require('util')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const VerificationToken = require('../model/verificationToken')
const {mailTransport, genOTP, emailTemplate, plainEmailTemp} = require('../util/mail')
const sendEmail = require('../util/joEmail')
const {isValidObjectId} = require('mongoose')
const asyncErrors = require('./errorController')
const crypto = require('crypto')
// const mg = require('mailgun-js')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN
    })
}

// const mailgun = () => {
//     mg({
//         apiKey: process.env.MAILGUN_KEY,
//         domain: process.env.MAILGUN_DOMAIN
//     })
// }

exports.signup = asyncErrors(async (req, res, next) => {

    
        const newUser =await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
        // const token = signToken(newUser._id)
        //jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRESIN
        // })

        const OTP = genOTP()
        const verificationToken = new VerificationToken({
            owner: newUser._id,
            token: OTP
        })
        await verificationToken.save()
        await newUser.save()
    
        mailTransport().sendMail({
            from: 'noreply@email.com',
            to: newUser.email,
            subject: 'verify your email account',
            html: emailTemplate(OTP)
        })
        

        // mailgun().messages().send({
        //     from: 'noreply@email.com',
        //     to: newUser.email,
        //     subject: 'verify your email account',
        //     html: emailTemplate(OTP)
        // }, (error, body) =>{
        //     if(error) {
        //         console.log(error)
        //         res.status(500).send({msg: 'error in mail sendings'});
        //     }else{
        //         console.log(body);
        //         res.status(200).send({msg: 'email sent'})
        //     }
        // })
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
        

   
    })
exports.login = asyncErrors(async(req, res, next) =>{
        const { email, password } = req.body
        //check if the email and password fields are filled
        if(!email.trim() || !password.trim()){
            return next(res.status(401).json({message: 'Please fill in your log in details'}))
        }
         
        //check if user exists in the database and check if password is correct
        const user = await User.findOne({email}).select('+password')
        
        if(!user || !(await user.comparePassword(password, user.password))){
            return next(res.status(401).json('Incorrect email or password'))
        }
        
        console.log(req.body)
        
        //send token to client
        const token = signToken(user._id)
        res.cookie('jwt', token, {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            secure: true,
            httpOnly: true
        });
        user.password = undefined;
        res.status(200).json({
            status: 'success',
            token
        })
})

exports.verifyEmail = asyncErrors(async(req, res, next) => {
    const {userId, otp} = req.body
    if(!otp.trim()) {
        return res.status(401).json({status:"Failure", message:"Invalid token"});
    }
    if(!isValidObjectId(userId)) {
        return res.status(401).json({status:"Failure", message:"Invalid User id"});
    }

    const user = await User.findById(userId)
    if (!user) return res.status(401).json({status:"Failure", message:"User not found"});

    if(user.verified) return res.status(401).json({status:"Failure", message:"Account already verified"});

    const token = await VerificationToken.findOne({owner: userId})
    if(!token) return res.status(401).json({status:"Failure", message:"Sorry, user not found"});

    const isMatched = await token.compareToken(otp, token.token)
    if(!isMatched) return res.status(401).json({status:"Failure", message:"Please provide a valid token"});

    user.verified = true; 

    await VerificationToken.findByIdAndDelete(token._id)
    await user.save()

    mailTransport().sendMail({
        from: 'noreply@email.com',
        to: user.email,
        subject: 'verify your email account',
        html: plainEmailTemp("Email Verified Successfully", "Thanks for connecting with us")
    });

    res.json({success: true, message: "Email is successfully verified.", user:{ name:
    user.name, email: user.email, id: user._id}})

})

exports.forgotPassword = asyncErrors(async (req, res, next) => {
    //get user based on posted email
    const user = await User.findOne({email: req.body.email})
    if(!user) return next(res.status(404).json({message: 'No user with this email'}))

    //generate random token
    const resetToken = user.newTokenCreate()
    await user.save({validateBeforeSave: false})

    //send email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/job/resetPassword/${resetToken}`

    const message = `Forgot your password? submit a patch request with your new password and password confirm to: ${resetURL}.\nif
    you didn\'t forget your password, please ignore this email`;

    try{

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (Valid for 10 min)!',
            message
        });
        
        res.status(200).json({
            status: 'Success',
            message: 'Token sent to email'
        })
    } catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false})

        return next(res.status(500).json({message: 'Major error'}))
    }
})

exports.resetPassword = asyncErrors(async(req, res, next) => {
    //get user Based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(hashedToken)
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt: Date.now()} })

    //if expired token or no user
    if(!user) return next(res.status(400).json({message: 'Invalid or expired token'}))

    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    //log user in and send JWT
    const token = signToken(user.id);

    res.status(200).json({
        status: 'success',
        token
    });
})

exports.updatePassword = asyncErrors(async (req, res, next) => {
    //get user from collection
    const user = await User.findById(req.user.id).select('+password');
    
    //check if the current password is correct
    if(!(await user.comparePassword(req.body.currentPassword, user.password))) {
        return next(res.status(401).json({
            status: 'failure',
            message: 'your current password is wrong'
        }))
    }

    //if password is correct, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //LOG THE USER IN AND SEND JWT
    const token = signToken(user.id);

    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = asyncErrors(async(req, res, next) => {
    //getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
   console.log(token)
    if(!token){
        return next(res.status(401).json({message: 'you are not logged in! please log in to get access'}))
    }

    //verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded)
    //check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(res.status(401).json({Message: 'user with token no longer exists'}))
    }

    //check if user recently changed password after token was issued
    if(currentUser.changePasswordAfter(decoded.iat)){
        return next(res.status(401).json({message: 'User recently changed password! please log in again!'}))
    }

    
    req.user = currentUser;
    next()
})

exports.logout = asyncErrors(async(req, res, next) =>{
    res.cookie('jwt', 'logged out',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true})
        res.status(200).json({status: 'Success'})
    })

