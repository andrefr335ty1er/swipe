const express = require('express')
const router = new express.Router()
const Expense = require('../models/expense')

router.post('/v1/expense', async (req, res) => {
    const expense = new Expense(req.body)

    try {
        await expense.save()
        res.status(201).send({ expense })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router