const User = require('./../models/userModels')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    }
    res.cookie('jwt', token, cookieOptions)
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

const signToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.signup = async (req, res, next)=>{
   try{
    const newUser = await User.create(req.body)
    createSendToken(newUser, 201, res)
   }catch(err){
    res.status(500).json({error: err.message});
   }
}

exports.login = async(req, res, next) => {
    try{
        const {email, password} = req.body

        // 1) Check if email and password exist
        if (!email || !password){
            return next(new AppError('Please provide an email and password!', 400))
        }

        // 2) Check if user exists && password are correct
        const user = await User.findOne({email}).select('+password')
        const correct = await user.correctPassword(password, user.password)

        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Incorrect email or password', 401))
        }
        createSendToken(user, 201, res)
    }catch(err){
       res.status(500).json({error: err.message})
    }
}