const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const User = require("../model/User");

// const filterObj = (obj, ...allowedFields) => {
//     const newObj = {};
//     Object.keys(obj).forEach(el => {
//         if(allowedFields.includes(el)) newObj[el] = obj[el];
//     });
//     return newObj;
// }
// get user profile
exports.getUser = async (req, res) => {
  //   const user = await User.findOne({ id: req.params.id })
  console.log(req.user);
 if (!req.user.userId) return res.status(400).json({ message: "Please provide id" });
  const updateUser = await User.findByIdAndUpdate(
     req.user.userId ,
    {firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      image: req.body.image,
      nickname: req.body.nickname,
      currentLocation: req.body.currentLocation,
      gender: req.body.gender,
      maritalStatus: req.body.maritalStatus,
      phoneNumber: req.body.phoneNumber,
      secondarySchool: req.body.secondarySchool,
      tertiarySchool: req.body.tertiarySchool,
      facultyDepartment: req.body.facultyDepartment,
      profession: req.body.profession,
      employmentStatus: req.body.employmentStatus,
      yearOfStudy: req.body.yearOfStudy,
      whatsApp: req.body.whatsApp,
      twitter: req.body.twitter,
      linkedIn: req.body.linkedIn,
      faceBook: req.body.faceBook,
      instagram: req.body.instagram,
    },
    
    { runValidators: true, new: false }
    );
 console.log(updateUser);   
  res
    .status(StatusCodes.OK)
    .json({ updateUser, msg: `Profile successfully created ` });
};

exports.getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `User with id ${id} not found` });

  //   const user = await User.find({});
  res.status(StatusCodes.OK).json({ user });
};

exports.updateUser = async (req, res) => {
  //const user = await User.findByIdAndUpdate ({id: userId} = req.params)
  const user = await User.findByIdAndUpdate(req.user.id, {
    new: true,
    runValidators: true,
  });

  //create error if user Posts password data
  // if(userId !== req.user.userId) {
  //     res.status(StatusCodes.BAD_REQUEST).json({message: 'You cannot perform this task'})
  // }

  //update user document

  res.status(200).json({
    profile: user,
  });
};

exports.deleteMe = async (req, res) => {
  await Profile.findByIdAndUpdate(req.user.id, { active: false });
  res.status(StatusCodes.OK).json({
    status: "success",
    data: null,
  });
};
