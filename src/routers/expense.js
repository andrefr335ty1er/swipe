const express = require('express')
const router = new express.Router()
const Expense = require('../models/expense')
const authGang = require('../middleware/authGang')
const auth = require('../middleware/auth')
const error = require('../util/error')
const logger = require('../log/logging')

// create new expense
router.post('/v1/expense', auth, async (req, res) => {
    logger.info("----- Create new expense [start] -----")
    const expense = new Expense(req.body)
    logger.info("Expense " + expense)
    try {
        await expense.save(function(err){
            if(err){
                logger.error(err.toString())
                if(err.name === 'MongoError' && err.code === 11000){    
                    return error(res, 400, 'There should be no expense with the same name in a gang' , req.method, '/v1/expense')
                }else{
                    return error(res, 400, err.toString() , req.method, '/v1/expense')
                }
            }else{
                logger.info("Expense created successfully.")
                res.status(201).send({ expense })
            }
        })
    } catch (e) {
        logger.error(e)
        return error(res, 400, e.toString(), req.method, '/v1/expense')
    }

    logger.info("----- Create new expense [end] -----")
})

// get all expenses of the gang
router.get('/v1/expenses/:id', auth, authGang, async (req, res) => {
    logger.info("----- Get gang expenses [start] -----")
    try {
        await req.gang.populate({
            path: 'expenses',
            match: { delete_flag: 'N' }
        }).execPopulate()
        res.send(req.gang.expenses)
    } catch (e) {
        logger.error(e)
        return error(res, 500, e.toString(), req.method, '/v1/expenses/:id')
    }
    logger.info("----- Get gang expenses [end] -----")
})

// delete all expenses of the gang
router.delete('/v1/expenses/:id/all', auth, authGang, async (req, res) => {
    logger.info("----- Delete all gang expenses [start] -----")
    try{
        logger.info("Gang ID: " + req.gang._id)
        await Expense.updateMany({ gang: req.gang._id }, { delete_flag: 'Y' })
        res.status(200).send("Delete successfully")
    }catch(e){
        logger.error(e)
        return error(res, 500, e.toString(), req.method, 'v1/expenses/:id/all')
    }
    logger.info("----- Delete all gang expenses [end] -----")
})

// delete one of the expense of the gang
router.delete('/v1/expense/:expenseID', auth, async (req, res) => {
    logger.info("----- Delete gang expense [start] -----")
    try{
        logger.info("Expense ID to delete: " + req.params.expenseID)
        const expense = await Expense.findByIdAndUpdate({ _id: req.params.expenseID }, { delete_flag: 'Y' })
        if(!expense){
            return error(res, 404, 'Expense not found', req.method, 'v1/expense/:id')
        }

        res.status(200).send("Delete successfully")
    }catch(e){
        logger.error(e)
        return error(res, 500, e.toString(), req.method, 'v1/expense/:id')
    }
    logger.info("----- Delete gang expense [end] -----")
})

// update expense details
router.patch('/v1/expense/:expenseID', auth, async (req, res) => {
    logger.info("-----Update expense [start]-----")

    try{
        logger.info("Expense ID to update: " + req.params.expenseID)

        const expense = await Expense.findById({ _id: req.params.expenseID })
        const updates = Object.keys(req.body)
        const allowedUpdates = ['recurring', 'recurring_period', 'description', 'amount']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if(!expense){
            throw new Error('Expense not found')
        }

        if (!isValidOperation) {
            throw new Error('Invalid updates')
        }
    
        updates.forEach((update) => expense[update] = req.body[update])
        await expense.save()
        res.send(expense)
    
    } catch (e) {
        logger.error(e.toString())
        return error(res, 400, e.toString(), req.method, '/v1/expense/:expenseID')
    }
    logger.info("-----Update expense [end]-----")
})

module.exports = router