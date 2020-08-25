const express = require('express')
const router = new express.Router()
const Gang = require('../models/gang')
const auth = require('../middleware/auth')

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

module.exports = router