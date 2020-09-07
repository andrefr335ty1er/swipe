const express = require('express')
const router = new express.Router()
const Expense = require('../models/expense')
const authGang = require('../middleware/authGang')
const auth = require('../middleware/auth')
const error = require('../util/error')
const logger = require('../log/logging')

router.post('/v1/expense', auth, async (req, res) => {
    logger.info("----- Create new expense [start] -----")
    const expense = new Expense(req.body)

    try {
        await expense.save(function(err){
            if(err){
                if(err.name === 'MongoError' && err.code === 11000){
                    logger.error(err.toString())
                    return error(res, 400, 'There should be no expense with the same name in a gang' ,'/v1/expense')
                }
            }else{
                res.status(201).send({ expense })
            }
        })
    } catch (e) {
        logger.error(e)
        return error(res, 400, e.toString(), '/v1/expense')
    }

    logger.info("----- Create new expense [end] -----")
})

router.get('/v1/expenses/:id', auth, authGang, async (req, res) => {
    try {
        await req.gang.populate({
            path: 'expenses'
        }).execPopulate()
        res.send(req.gang.expenses)
    } catch (e) {
        return error(res, 500, e.toString(), '/v1/expenses/:id')
    }

})

module.exports = router