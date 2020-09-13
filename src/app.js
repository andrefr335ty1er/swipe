const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const signUpRouter = require('./routers/signUpVerification')
const gangRouter = require('./routers/gang')
const expenseRouter = require('./routers/expense')
const logger = require('./log/logging')

const app = express()

app.use(express.json())

app.use(userRouter)
app.use(signUpRouter)
app.use(gangRouter)
app.use(expenseRouter)

module.exports = app