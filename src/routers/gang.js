const express = require('express')
const router = new express.Router()
const Gang = require('../models/gang')
const auth = require('../middleware/auth')
const authGang = require('../middleware/authGang')
const error = require('../util/error')
const { db } = require('../models/gang')
const logger = require('../log/logging')

// create gang
router.post('/v1/gang', auth, async (req, res) => {
    logger.info("-----Create gang [start]-----")
    const gang = new Gang(req.body)
    gang.admin = req.user._id
    logger.info(gang.toString())

    try {
        const existingName = await Gang.findOne({ name: gang.name })

        if(existingName){
            throw new Error('This name has been taken')
        }

        await gang.save()
        res.status(201).send({ gang })
    } catch (e) {
        logger.error(e.toString())
        return error(res, 400, e.toString(), req.method, '/v1/gang')
    }
    logger.info("-----Create gang [end]-----")
})

// get all the gangs of the user
router.get('/v1/gangs', auth, async (req, res) => {
    logger.info("-----Get list of gangs [start]-----")
    try {
        await req.user.populate({
            path: 'gangs',
            match: { delete_flag: 'N' }
        }).execPopulate()
        res.send(req.user.gangs)
    } catch (e) {
        logger.error(e.toString())
        return error(res, 500, e.toString(), req.method, '/v1/gangs')
    }
    logger.info("-----Get list of gangs [end]-----")
})

const getGangById = '/v1/gangs/:id'

// get gang details
router.get(getGangById, auth, authGang, async (req, res) => {
    logger.info("-----Get gang details [start]-----")
    try {
        res.send({ gang: req.gang })
    } catch (e) {
        logger.error(e)
        error(res, 400, e.toString(), req.method, getGangById)
    }
    logger.info("-----Get gang details [end]-----")
})


// delete gang
router.delete(getGangById, auth, authGang, async (req, res) => {
    logger.info("-----Delete gang [start]-----")
    try {
        logger.info("Gang ID to delete: " + req.gang._id)
        const deleted = await Gang.findByIdAndUpdate({ _id: req.gang._id }, { delete_flag: 'Y' } )
        res.send(deleted)
    } catch (e) {
        logger.error(e)
        error(res, 400, e.toString(), req.method, getGangById)
    }
    logger.info("-----Delete gang [end]-----")
})

// update gang details
router.patch(getGangById, auth, authGang, async (req, res) => {
    logger.info("-----Update gang details [start]-----")
    try{
        const updates = Object.keys(req.body)
        logger.info("Gang ID to update: " + req.gang._id)
        logger.info("Update details: " + req.body)

        let isAdminExist = null
        const allowedUpdates = ['description', 'members']

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            throw new Error('Invalid updates')
        }

        if(req.body.members){
            const memberArray = []
            req.body.members.forEach((member) => memberArray.push(member._id))
            isAdminExist = memberArray.includes(req.gang.admin.toString())

            if(!isAdminExist){
                throw new Error('Admin cannot remove itself from the gang')
            }
        }

        updates.forEach((update) => req.gang[update] = req.body[update])
        await req.gang.save()
        res.send(req.gang)
    } catch (e) {
        logger.error(e.toString())
        return error(res, 400, e.toString(), req.method, getGangById)
    }
    logger.info("-----Update gang details [end]-----")
})

module.exports = router