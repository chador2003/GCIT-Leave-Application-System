const express = require('express');
const path = require('path')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
const applicationRouter = require('./routes/applicationRoutes')
// const session = require('express-session');
const app = express();

// app.use(session({
//     secret: '47c57b15e203fbe46898015c57f2d98ff64827347c9deef48a36f0200c15341f', // Replace with a secret key for session encryption
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Set to true if your application is served over HTTPS
//   }));

app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use('/static', express.static('/workspaces/DeVopds/gcit-leave-application/views/img/applications'));

app.use('/api/v1/users', userRouter)
app.use('/api/v1/application', applicationRouter)
app.use('/', viewRouter)
app.use(express.static(path.join(__dirname, 'views')))
module.exports = app 

// Use the session middleware


