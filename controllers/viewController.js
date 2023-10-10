const path = require('path')

//  Login Page
exports.getLoginForm = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'))
}

// Signup Page
exports.getSignupForm = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'))
}

// Landing Page
exports.getLandingPage = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'views', 'landing.html'))
}