const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
//const { kStringMaxLength } = require("buffer");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"],
  },
  email: {
    type: String,
    required: [true, " Please provide an email"],
    unique: true,
    lowercase: [true, "Email already exist in our database"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
    //required: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  passwordToken: String,
  passwordTokenExpirationDate: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  nickname: {
    type: String,
    default: "",
  },
  currentLocation: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  maritalStatus: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: Number,
  },
  secondarySchool: {
    type: String,
    default: "",
  },
  tertiarySchool: {
    type: String,
    default: "",
  },
  facultyDepartment:{
    type: String,
    default: "",
  },
  profession: {
    type: String,
    default: "",
  },
  employmentStatus: {
    type: String,
    default: "",
  },
  yearOfStudy:{
    type: String,
    default: "",
  },
  whatsApp:{
    type: String,
    default: "",
  },
  twitter:{
    type: String,
    default: "",
  },
  linkedIn:{
    type: String,
    default: "",
  },
  faceBook:{
    type: String,
    default: "",
  },
  instagram:{
    type: String,
    default: "",
  },
  verificationToken: String,

});

//encrypt the password by using a mongoose middleware(presave middleware)
UserSchema.pre("save", async function() {
  //run this function if password was modified
  if (!this.isModified("password")) return;
  //the this represents the password of the document being posted
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt);

});

// UserSchema.pre(/^find/, function (next) {
//   //this points to the current query
//   this.find({ active: { $ne: false } });

//   next();
// });

//comparing original password to provided password to log user in
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, firstName: this.firstName, lastName: this.lastName, email: this.email},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRESIN,
    }
    )
}
  

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch;

//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.passwordResetExpires = Date.now() + 10 * 60 * 100;
//   console.log({ resetToken }, this.passwordResetToken);

//   return resetToken;
};

// UserSchema.methods.changePasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     return JWTTimestamp < changedTimestamp;
//   }

//   return false;
// };

const User = mongoose.model("User", UserSchema);

module.exports = User;
