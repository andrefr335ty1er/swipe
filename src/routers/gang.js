const express = require('express')
const router = new express.Router()
const Gang = require('../models/gang')
const auth = require('../middleware/auth')
const error = require('../util/error')
const { db } = require('../models/gang')

router.post('/v1/gang', auth, async (req, res) => {
    const gang = new Gang(req.body)

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
router.get(getGangById, auth, async (req, res) => {
    try {
        const gang = await Gang.findById(req.params.id)

        if (!gang) {
            return error(res, 404, 'Cant find any gang.', getGangById)
        }

        if(!gang.members.includes(req.user._id)){
            return error(res, 403, 'You are not a member of this gang', getGangById)
        }

        res.send({ gang })
    } catch (e) {
       res.status(404).send(e)
    }
})

router.delete(getGangById, auth, async (req, res) => {
    try {
        const gang = await Gang.findById(req.params.id)

        if (!gang) {
            return error(res, 404, 'Cant find any gang.', getGangById)
        }

        if(!gang.members.includes(req.user._id)){
            return error(res, 403, 'You are not a member of this gang', getGangById)
        }

        const deleted = await Gang.findByIdAndDelete({ _id: gang._id })

        if (!deleted) {
            res.status(404).send()
        }

        res.send(deleted)
        
    } catch (e) {
       res.status(404).send(e)
    }
})

module.exports = router