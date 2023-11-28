const User = require('./../models/userModels')
const Token = require('./../models/Token')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const { promisify, isNullOrUndefined } = require('util')

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

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        createSendToken(newUser, 201, res)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide an email and password!', 400))
        }

        // 2) Check if user exists && password are correct
        const user = await User.findOne({ email }).select('+password')
        const correct = await user.correctPassword(password, user.password)

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401))
        }
        createSendToken(user, 201, res)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and checking if its there
        let token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }
        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            )
        }
        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        console.log(decoded)


        // 3) check if user still exists
        const freshUser = await User.findById(decoded.id)
        if (!freshUser) {
            return next(
                new AppError('The user belonging to this token no longer exist', 401)
            )
        }
        req.user = freshUser
        // Grant access to protected route
        next()
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.updatePassword = async (req, res, next) => {
    try {
        //1) Get User from collection
        const user = await User.findById(req.user.id).select('+password')

        //2) Check if posted currrent password is correct
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return next(new AppError('Your current is wrong', 401))
        }

        //3) If so, update password
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()

        //4) Log user in, send JWT
        createSendToken(user, 200, res)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: "success" })
}
