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