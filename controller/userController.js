const {StatusCodes } = require("http-status-codes")
const { BadRequestError, 
    UnauthenticatedError, 
    NotFoundError} = require("../errors")
const User = require('../model/User')

// const filterObj = (obj, ...allowedFields) => {
//     const newObj = {};
//     Object.keys(obj).forEach(el => {
//         if(allowedFields.includes(el)) newObj[el] = obj[el];
//     });
//     return newObj;
// }
// get user profile
exports.getUser = async (req, res) => {
    const user = await User.findOne({_id:req.params.id}).select("-password")
    if (!user) 
    return res.status(400).json({message: "User does not exist"})
    
    res.status(StatusCodes.OK).json({ user })
}

exports.updateUser = async (req, res) => {
    //const user = await User.findByIdAndUpdate ({id: userId} = req.params;)

    //create error if user Posts password data
    if(userId !== req.user.userId) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'You cannot perform this task'})
    }

    //update user document
    const user = await User.findByIdAndUpdate({ _id: userId}, req.body, 
        {new: true, runValidators: true,
        })


    res.status(StatusCodes.OK).json({
            profile: user
        
    })
}


exports.deleteMe = async(req, res, next) => {
    await Profile.findByIdAndUpdate(req.user.id, { active: false});
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: null
    })
}