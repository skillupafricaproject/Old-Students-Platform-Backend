const School = require('../model/School')
const asyncErrors = require('./errorController')

exports.createSchool = asyncErrors(async (req, res, next) => {
    const newSchool = new School ({
        schoolName: req.body.schoolName,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        establishmentYear: req.body.establishmentYear,
        type: req.body.type,
    })
    await newSchool.save()

    res.status(201).json({
        status: 'success',
        data: {
            user: newSchool
        }
    })

})

exports.updateSchool = asyncErrors(async (req, res, next) => {
    
        //update school document
        const updatedSchool = await Profile.findByIdAndUpdate(req.body, 
            {new: true, runValidators: true,})
    
    
        res.status(200).json({
            status:'success',
            data: {
                user: updatedSchool
            }
            
        }) 
    })