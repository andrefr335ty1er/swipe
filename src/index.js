const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const signUpRouter = require('./routers/signUpVerification')
const gangRouter = require('./routers/gang')
const expenseRouter = require('./routers/expense')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(signUpRouter)
app.use(gangRouter)
app.use(expenseRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})