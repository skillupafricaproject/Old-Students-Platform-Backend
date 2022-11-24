const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema ({
    schoolname: {
        type: String,
        required: [true, 'Please provide name of school'],
        maxlength: [1000, 'Name can not be more than 1000 characters']
    },
    schooldescription: {
        type: String,
        required: [true, 'Please provide school description']

    }
})