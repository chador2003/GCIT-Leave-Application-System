const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewController')
const authController = require('./../controllers/authController')

router.get('/', viewsController.getLandingPage)
router.get('/login', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm)
router.get('/applications', viewsController.getLeaveApplicationPage)
router.get('/myProfile', authController.protect, viewsController.getProfilePage)


module.exports = router