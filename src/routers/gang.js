const express = require('express')
const router = new express.Router()
const Gang = require('../models/gang')
const auth = require('../middleware/auth')
const authGang = require('../middleware/authGang')
const error = require('../util/error')
const { db } = require('../models/gang')

router.post('/v1/gang', auth, async (req, res) => {
    const gang = new Gang(req.body)
    gang.admin = req.user._id

    try {
        await gang.save()
        res.status(201).send({ gang })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/v1/gangs', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'gangs'
        }).execPopulate()
        res.send(req.user.gangs)
    } catch (e) {
        res.status(500).send()
    }
})

const getGangById = '/v1/gangs/:id'
router.get(getGangById, auth, authGang, async (req, res) => {
    try {
        res.send({ gang: req.gang })
    } catch (e) {
       res.status(404).send(e)
    }
})

router.delete(getGangById, auth, authGang, async (req, res) => {
    try {
        const deleted = await Gang.findByIdAndDelete({ _id: req.gang._id })
        res.send(deleted)
        
    } catch (e) {
       error(res, 404, 'Resource not found', getGangById)
    }
})

router.patch(getGangById, auth, authGang, async (req, res) => {
    const updates = Object.keys(req.body)
    const memberArray = []
    const allowedUpdates = ['description', 'members']
    req.body.members.forEach((member) => memberArray.push(member._id))
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const isAdminExist = memberArray.includes(req.gang.admin.toString())

    if (!isValidOperation) {
        return error(res, 400, 'Invalid updates!', getGangById)
    }

    if(!isAdminExist){
        return error(res, 400, 'Admin cannot remove itself from the gang', getGangById)
    }

    try {
        updates.forEach((update) => req.gang[update] = req.body[update])
        await req.gang.save()
        res.send(req.gang)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router