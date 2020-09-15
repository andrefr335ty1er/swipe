const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const error = require('../util/error')
const logger = require('../log/logging')

router.get('/v1/check/email/:item', async (req, res) => {
    logger.info("----- Check email availability [start] -----")
    const item = req.params.item

    try{
        logger.info("Mobile number: " + item)
        const exist = await User.findOne({ email: item })

        if(exist){
            res.status(404).send({ code: '-1' })
        }else{
            res.status(200).send({ code: '1' })
        }
        
    }catch(e){
        logger.error(e.toString())
        return error(res, 400, e.toString(), req.method, '/v1/check/email')
    }
    
    logger.info("----- Check email availability [end] -----")
})


router.get('/v1/check/mobile/:item', async (req, res) => {
    logger.info("----- Check mobile availability [start] -----")
    const item = req.params.item
    try{
        logger.info("Mobile number: " + item)
        const exist = await User.findOne({ mobile_number: item })

        if(exist){
            res.status(404).send({ code: '-1' })
        }else{
            res.status(200).send({ code: '1' })
        }
        
    }catch(e){
        logger.error(e.toString())
        return error(res, 400, e.toString(), req.method, '/v1/check/mobile')
    }
    
    logger.info("----- Check mobile availability [end] -----")
})

module.exports = router