const express = require('express')
const applicationController = require('./../controllers/leaveApplicationController')
const authController = require('./../controllers/authController')
const router = express.Router()

router
   .route('/')
   .get(authController.protect, applicationController.getAllApplication)

router.post("/submitApplication",
authController.protect,
applicationController.application_file,
applicationController.createApplication)


router
   .route('/:id')
   .get(applicationController.getApplication)
   .patch(applicationController.updateApplication)
   .delete(applicationController.deleteApplication)

router
   .route('/user/:id')
   .get(applicationController.getApplicationByUserId)

module.exports = router