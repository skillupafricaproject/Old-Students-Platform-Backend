const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { kStringMaxLength } = require('buffer')


const profileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name']
    },
    lastName: {
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
    stateOfResidence: {
        type: String,
        default: ''
    },
    occupation: {
        type: String,
        default: ''
    },
    occupationDetails: {
        type: String,
        default: ''
    }




})


profileSchema.pre(/^find/, function(next) {
    //this points to the current query
    this.find({active: {$ne: false}});
    
    next()
})


const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile