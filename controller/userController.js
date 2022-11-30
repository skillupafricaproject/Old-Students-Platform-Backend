const User = require('../model/User')
const asyncErrors = require('./errorController')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.updateMe = asyncErrors(async (req, res, next) => {
    //create error if user Posts password data
    if(req.body.password) {
        return next(res.status(400)
        .json({message: 'You cannot update your password here. Please use the forget password route'}))
    }

    //filtered out unwanted fields not allowed to get updated
    const filteredBody =filterObj(req.body, 'name', 'email', 'dob', 'country', 'stateOfResidence', 'maritalStatus', 'occupation', 'number' );


    //update user document
    const updatedUser = await Profile.findByIdAndUpdate(req.user.id, filteredBody, 
        {new: true, runValidators: true,})


    res.status(200).json({
        status:'success',
        data: {
            user: updatedUser
        }
        
    })
})

exports.getUser = asyncErrors(async (req, res, next) => {
    const user = await Profile.findOne({_id:req.params.id}).select("-password")

    if(!user) return res.status(400).json({message:"No user exists"})

    res.status(201).json({
        user
    })
})

exports.deleteMe = asyncErrors(async(req, res, next) => {
    await Profile.findByIdAndUpdate(req.user.id, { active: false});
    res.status(204).json({
        status: 'success',
        data: null
    })
})