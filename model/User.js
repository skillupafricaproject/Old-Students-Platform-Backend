const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { kStringMaxLength } = require('buffer')


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please provide your first name']
    },
    lastname: {
        type: String,
        required: [true, 'Please provide your last name']
    },
    email: {
        type: String,
        required: [true, ' Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    }, 
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        maxlength: 20,
        select: false
    }, 
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        // validate:{
        //     validator: function(el){
        //         return el === this.password
        //     },
        // }
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    dob: {
       type: String,
    

    },
    nickname: {
        type: String,
        default: ''

    },
    address: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: '',
    },
    maritalStatus: {
        type: String,
        default: ''
    },
    number: {
        type: Number,
    },
    otherNumber: {
        type: Number,
    },
    Stateofresidence: {
        type: String,
        default: ''
    },
    occupation: {
        type: String,
        default: ''
    },
    occupationdetails: {
        type: String,
        default: ''
    }




})

//encrypt the password by using a mongoose middleware(presave middleware)
userSchema.pre('save', async function(next){
    //run this function if password was modified
    if(!this.isModified('password')) return next()
    //the this represents the password of the document being posted
    this.password = await bcrypt.hash(this.password, 12)

    next()
})

userSchema.pre(/^find/, function(next) {
    //this points to the current query
    this.find({active: {$ne: false}});
    
    next()
})

//comparing original password to provided password to log user in
userSchema.methods.comparePassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.newTokenCreate = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 100;
    console.log({resetToken}, this.passwordResetToken )

    return resetToken;
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp;
    }

    
    return false;
}





const User = mongoose.model('User', userSchema)

module.exports = User