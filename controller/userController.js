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
    if(req.body.password || req.body.confirmPassword) {
        return next(res.status(400)
        .json({message: 'you cannot update your password here. please use the forget password route'}))
    }

    //filtered out unwanted fields not allowed to get updated
    const filteredBody =filterObj(req.body, 'name', 'email');


    //update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, 
        {new: true, runValidators: true,})


    res.status(200).json({
        status:'success',
        data: {
            user: updatedUser
        }
        
    })
})

exports.getUser = asyncErrors(async (req, res, next) => {
    const user = await User.findOne({_id:req.params.id}).select("-password")

    if(!user) return res.status(400).json({message:"No user exists"})

    res.status(201).json({
        user
    })
})

exports.deleteMe = asyncErrors(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false});
    res.status(204).json({
        status: 'success',
        data: null
    })
})