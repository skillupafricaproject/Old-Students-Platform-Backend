const router = require('express').Router()
const schoolController = require('../controller/schoolController')

router.post('/createSchool', schoolController.createSchool)


module.exports = router