const router = require('express').Router()
const schoolController = require('../controller/schoolController')

router.post('/createSchool', schoolController.createSchool)
router.post('/joinSchool/:id', schoolController.joinSchool)
router.get('/getallSchools', schoolController.getallSchools)
router.get('/joinSchool/:id', schoolController.joinSchool)
router.patch('/updateSchool', schoolController.updateSchool)


module.exports = router