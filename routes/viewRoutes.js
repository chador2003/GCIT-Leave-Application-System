const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewController')

router.get('/', viewsController.getLandingPage)
router.get('/login', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm)


router.get('/admusers', viewsController.getAdmUsers)
router.get('/admLogin', viewsController.getAdmLoginForm)
module.exports = router