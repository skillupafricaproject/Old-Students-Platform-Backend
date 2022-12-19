const { json } = require("body-parser")
const { StatusCodes} = require("http-status-codes")
const { BadRequestError, UnauthenticatedError, NotFoundError} = require("../errors")
const School = require('../model/School')
//const node_fetch = require('node-fetch')
//const asyncErrors = require('./errorController')

exports.createSchool = async (req, res, next) => {
    const newSchool = new School ({
        schoolName: req.body.schoolName,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        establishmentYear: req.body.establishmentYear,
        type: req.body.type,
    })
    await newSchool.save()

    res.status(StatusCodes.OK).json({
        message: 'School group created successfully.',
        data:
            newSchool
    })

}

exports.getallSchools = async(req, res) => {
    const schools = await School.find({});
    res.json(schools);
    await getallSchools.save()

    res.status(StatusCodes.OK).json({
        message: 'List of all school groups.',
        data: getallSchools
    })
  };

exports.joinSchool = async (req, res) => {
    const School = await School.findOne({name:req.body.name})
console.log();

res.status(StatusCodes.OK).json({"message": "School group joined successfully"})
}


exports.updateSchool = async (req, res, next) => {
    
        //update school document
        const updatedSchool = await Profile.findByIdAndUpdate(req.body, 
            {new: true, runValidators: true,})
    
    
        res.status(StatusCodes.OK).json({
            message: 'Updates has been made.',
            data: {
                user: updatedSchool
            }
            
        }) 
    }