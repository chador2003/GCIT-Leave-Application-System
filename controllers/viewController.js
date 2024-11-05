const path = require('path')


/* Users Controller*/ 
//  Login Page
exports.getLoginForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'))
}

// Signup Page
exports.getSignupForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'))
}

// Landing Page
exports.getLandingPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'landing.html'))
}

// Home Page
exports.getIndexPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'))
}

//Submit Leave Application Page
exports.getLeaveApplicationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'form.html'))
}

//User Profile Page
exports.getProfilePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'myProfile.html'))
}

// Edit Leave Application Page
exports.getEditApplicationPage = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'views', 'editApplication.html'))
}

// Edit Leave Application Page
exports.getEditAboutUsPage = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'views', 'about_us.html'))
}




/* Admin Controller */
/* dashboard  PAGE */
exports.getAdmUsers = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views/admin', 'admusers.html'))
}

// //  Login Page
// exports.getAdmLoginForm = (req, res) => {
//     res.sendFile(path.join(__dirname, '../', 'views/admin', 'admLogin.html'))
// }



exports.getRequestLeave = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views/admin', 'requestLeave.html'))
}


exports.getApprovedLeave = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views/admin', 'approvedLeave.html'))
}
