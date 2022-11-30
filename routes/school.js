const router = require('express').Router()
const schoolController = require('../controller/schoolController')

router.post('/createSchool', schoolController.createSchool)
router.patch('/updateSchool', schoolController.updateSchool)


module.exports = router