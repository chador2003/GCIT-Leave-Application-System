const express = require('express');
const path = require('path')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
const applicationRouter = require('./routes/applicationRoutes')
// const session = require('express-session');
const app = express();

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


