const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const createHash = require("../util/createHash");
const mailTransport = require("../util/sendEmail");
//const { isValidObjectId } = require("mongoose");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

exports.signup = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists.");
  }

  const verificationToken = crypto.randomBytes(2).toString("hex");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    verificationToken,
  });

  // Send mail
  mailTransport.sendMail({
    from: '"Rapport" <rappport@email.com>',
    to: email,
    subject: "Verify your email account",
    html: `<h4> Hello, ${firstName}, kindly verify your account with this token: ${verificationToken}</h4>`,
  });

  res.status(StatusCodes.CREATED).json({
    message: "Success! Please check your email to verify account.",
    user: user,
    email: user.email,
    userId: user._id,
  });
};

exports.verifyEmail = async (req, res) => {
  const { id } = req.params;
  const { verificationToken } = req.body;
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new UnauthenticatedError("Verification Failed.");
  }

  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification Failed.");
  }
  user.verified = true;
  //user.verificationToken = undefined;

  //res.status(StatusCodes.OK).json({message: "Email Verified!"})

  //   const isMatched = await token.compareToken(otp, token.token);
  //   if (!isMatched)
  //     return res
  //       .status(401)
  //       .json({ status: "Failure", message: "Please provide a valid token" });

  //   user.verified = true;
  //   user.verificationToken = undefined;
  await user.save();

  mailTransport.sendMail({
    from: '"Rapport" <rappport@email.com>',
    to: user.email,
    subject: "Verify your email account",
    html: `<h4>Hello, ${user.firstName}</h4> <h2>Congratulations</h2> Email Verified successfully`,
  }),
    res.status(StatusCodes.OK).json({
      message: "Email successfully verified.",
    });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  //check if the email and password fields are filled
  if (!email) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Email is not correct"});
  }

  if (!password) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Password is not correct"});
  }


  //check if user exists in the database and check if password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid User"});
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Password is incorrect"});
  }

  if (!user.verified) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Please verify your email."});
  }

  //send token to client
  //let token = user.createJWT()

  //   res.cookie("token", token, {
  //     expires: new Date(
  //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //     ),
  //     //secure: true,
  //     httpOnly: true,
  //   });
  const token = signToken(user._id)
  res.cookie('jwt', token, {
      expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: true,
      httpOnly: true
  });

    res.status(StatusCodes.OK).json({
      message: "Login Successful",
      userId: user._id,
      token: token
    });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide valid email.");
  }

  //get user based on posted email
  const user = await User.findOne({ email });

  if (user) {
    //generate random token
    const passwordToken = crypto.randomBytes(2).toString("hex");

    // Send email
    mailTransport.sendMail({
      from: '"Rapport" <rappport@email.com>',
      to: email,
      subject: "Reset your account",
      html: `<h4>Hi, kindly reset your password with this token: ${passwordToken}</h4>`,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date (Date.now() + tenMinutes);
    console.log(passwordToken)

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res.status(StatusCodes.OK).json({
    message: "Please check you email for reset password.",
  });
};

exports.resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    // throw new BadRequestError("Please provide all values");
    res.status(404).json({ msg: 'Please provide all values'})
  }
  const user = await User.findOne({ email });

  const currentDate = new Date();

    if (
      user.passwordToken === (token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
    res.status(200).json({msg: `Password successfully updated`});
  }
  

exports.logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out!" });
};
