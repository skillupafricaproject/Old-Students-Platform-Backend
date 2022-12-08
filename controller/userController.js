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
    const user = await User.findOneAndUpdate({id:req.params.id}).select("-password")
    if (!user) 
    return res.status(400).json({message: "User does not exist"})
    user.firstName = req.body.firstName,
    user.lastName = req.body.lastName,
    user.email = req.body.email,
    user.nickname = req.body.nickname,
    user.currentLocation = req.body.currentLocation,
    user.gender = req.body.gender,
    user.maritalStatus = req.body.maritalStatus,
    user.phoneNumber = req.body.phoneNumber,
    user.secondarySchool = req.body.secondarySchool,
    user.tertiarySchool = req.body.tertiarySchool,
    user.facultyDepartment = req.body.facultyDepartment,
    user.profession = req.body.profession,
    user.employmentStatus = req.body.employmentStatus,
    user.yearOfStudy = req.body.yearOfStudy,
    user.whatsApp = req.body.whatsApp,
    user.twitter = req.body.twitter,
    user.linkedIn = req.body.linkedIn,
    user.faceBook = req.body.faceBook,
    user.instagram = req.body.instagram,

    res.status(StatusCodes.OK).json({user})
}   

exports.updateUser = async (req, res) => {
    //const user = await User.findByIdAndUpdate ({id: userId} = req.params)
    const user = await User.findByIdAndUpdate(req.user.id,
        {new: true, runValidators: true,
        })

    //create error if user Posts password data
    // if(userId !== req.user.userId) {
    //     res.status(StatusCodes.BAD_REQUEST).json({message: 'You cannot perform this task'})
    // }

    //update user document


    res.status(200).json({
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