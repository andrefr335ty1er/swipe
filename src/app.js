const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const signUpRouter = require('./routers/signUpVerification')
const gangRouter = require('./routers/gang')
const expenseRouter = require('./routers/expense')
const checkExistRouter = require('./routers/checkExist')
const testingRouter = require('./routers/testing')

const app = express()

app.use(express.json())

app.use(userRouter)
app.use(signUpRouter)
app.use(gangRouter)
app.use(expenseRouter)
app.use(checkExistRouter)
app.use(testingRouter)

module.exports = app