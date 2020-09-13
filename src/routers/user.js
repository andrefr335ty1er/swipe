const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()
const logger = require('../log/logging')
const error = require('../util/error')
const originPath = __filename.replace(path.dirname(__dirname), '')

router.post('/v1/users', async (req, res) => {
    logger.info("-----Create User [start]-----")
    logger.info(JSON.stringify(req.body))
    const user = new User(req.body)

    try {
        const existingEmail = await User.findOne({ email: user.email })
        if (existingEmail) {
            throw new Error('Email address has been taken')
        }

        const existingMobileNum = await User.findOne({ mobile_number: user.mobile_number })
        if (existingMobileNum) {
            throw new Error('Mobile number has been taken')
        }

        await user.save()
        logger.info("Finish saving user")

        //sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        logger.error(e)
        return error(res, 400, e.toString(), req.method ,'/v1/users')
    }
    logger.info("-----Create User [end]-----")
})

router.post('/v1/users/login', async (req, res) => {
    logger.info("-----Login [start]-----")
    try {
        logger.info(JSON.stringify(req.body))
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        logger.info(user + "\n" + token)
        res.send({ user, token })
    } catch (e) {
        logger.error(e)
        return error(res, 400, e.toString(), req.method, '/v1/users/login')
    }
    logger.info("-----Login [end]-----")
})

router.post('/v1/users/logout', auth, async (req, res) => {
    logger.info("-----Logout user [start]-----")
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        return error(res, 500, e.toString(), req.method, '/v1/users/logout')
    }
    logger.info("-----Logout user [end]-----")
})

router.post('/v1/users/logoutAll', auth, async (req, res) => {
    logger.info("-----Logout user all [start]-----")
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        return error(res, 500, e.toString(), req.method, '/v1/users/logoutAll')
    }
    logger.info("-----Logout user all [end]-----")
})

router.get('/v1/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/v1/users/me', auth, async (req, res) => {
    logger.info("-----Update user [start]-----")

    try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            throw new Error('Invalid updates')
        }

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        logger.error(e.toString())
        return error(res, 400, e.toString(), req.method, '/v1/users/me')
    }
    logger.info("-----Update user [end]-----")
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image. Formats allowed are jgp/jpeg/png'))
        }

        cb(undefined, true)
    }
})

router.post('/v1/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    logger.info("-----Create user avatar [start]-----")
    try{
        if(req.file !== undefined){
            const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
            req.user.avatar = buffer
            await req.user.save()
            res.send()
        }else{
            throw new Error("No file is uploaded")
        }
    }catch(e){
        return error(res, 400, e.toString(), req.method, '/v1/users/me/avatar')
    }
    logger.info("-----Create user avatar [end]-----")
}, (err, req, res, next) => {
    return error(res, 400, err.message, req.method, '/v1/users/me/avatar')
})

router.delete('/v1/users/me/avatar', auth, async (req, res) => {
    logger.info("-----Delete user avatar [start]-----")
    req.user.avatar = undefined
    await req.user.save()
    res.send("Delete successfully")
    logger.info("-----Delete user avatar [end]-----")
})

router.get('/v1/users/:id/avatar', async (req, res) => {
    logger.info("-----Get user avatar [start]-----")
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error("Could not locate the resource")
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        logger.error(e.toString())
        return error(res, 404, e.toString(), req.method, '/v1/users/:id/avatar')
    }
    logger.info("-----Get user avatar [end]-----")
})

module.exports = router