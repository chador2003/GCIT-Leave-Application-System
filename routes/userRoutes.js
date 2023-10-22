// const express = require('express')
// const userController = require('./../controllers/userController')
// const router = express.Router()
// import User from "../models/userModels"
// import bcrypt from "bcryptjs"
// import generateLogToken from "../utils.js"
// import Token from "../models/Token.js"
// import crypto from "cr"


// Create user
// router.post("/register",
// async(req, res)=>{
//     let user = await User.findOne({email: req.body.email});
//     if (user)
//     return res.send("User with given email is existing!");
// user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: await bcrypt.hash(req.body.password, 10),
//     gender: req.body.gender,
//     }).save();
//     res.send(user);
//     //generate verification token
//     const token = new Token (
//         {userId:user_id, token: crypto.randomBytes(16).toString('hex')
//     });
//     await token.save();
//     console.log(token)
// })


const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.patch('/updateMyPassword',
authController.protect, authController.updatePassword)

router
   .route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser)

router 
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deleteUser)

   module.exports = router


