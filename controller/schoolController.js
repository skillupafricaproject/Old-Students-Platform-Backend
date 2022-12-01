const { StatusCodes} = require("http-status-codes")
const { BadRequestError, UnauthenticatedError, NotFoundError} = require("../errors")
const School = require('../model/School')
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
        data: {
            user: newSchool
        }
    })

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