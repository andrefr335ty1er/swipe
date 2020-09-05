const express = require('express')
const router = new express.Router()
const Expense = require('../models/expense')
const authGang = require('../middleware/authGang')
const auth = require('../middleware/auth')

router.post('/v1/expense', auth, async (req, res) => {
    const expense = new Expense(req.body)

    try {
        await expense.save()
        res.status(201).send({ expense })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/v1/expenses/:id', auth, authGang, async (req, res) => {
    try {
        await req.gang.populate({
            path: 'expenses'
        }).execPopulate()
        res.send(req.user.expenses)
    } catch (e) {
        res.status(500).send()
    }

})

module.exports = router