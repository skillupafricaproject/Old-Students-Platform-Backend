const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema ({
    schoolName: {
        type: String,
        required: [true, 'Please provide name of school'],
        maxlength: [1000, 'Name can not be more than 1000 characters']
    },
    schoolDescription: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        required: [true, 'Please provide country'] ,
    },
    state: {
        type: String,
        required: [true, 'Please provide information']
    },
    city: {
        type: String,
        default: ''
    },
    establishmentYear: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    class: {
        type: Number,
        default: ''
    },
    members: {
        type: Number,
        default: ''
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
})

const School = mongoose.model('School', schoolSchema)

module.exports = School