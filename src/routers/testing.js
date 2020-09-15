const express = require('express')
const router = new express.Router()
const Quiz = require('../models/quiz')
const error = require('../util/error')
const logger = require('../log/logging')

router.post('/v1/quiz', async (req, res) => {
    
    try{
        const quiz = new Quiz(req.body)

        await quiz.save()
        res.status(200).send(quiz)
    }catch(e){
        return error()
    }
})

module.exports = router