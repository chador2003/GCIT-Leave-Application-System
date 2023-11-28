const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewController')
const authController = require('./../controllers/authController')

router.get('/', viewsController.getLandingPage)
router.get('/home', viewsController.getIndexPage)
router.get('/login', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm)
router.get('/about', viewsController.getEditAboutUsPage)
router.get('/applications', authController.protect, viewsController.getLeaveApplicationPage)
router.get('/myProfile', authController.protect, viewsController.getProfilePage)
router.get('/editApplication', authController.protect, viewsController.getEditApplicationPage)

// Admin View Routes
router.get('/admusers', viewsController.getAdmUsers)
router.get('/admLogin', viewsController.getAdmLoginForm)

router.get('/requestLeave', viewsController.getRequestLeave)
router.get('/ApprovedLeave', viewsController.getApprovedLeave)
module.exports = router