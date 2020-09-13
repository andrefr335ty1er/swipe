const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app =require('../src/app')
const Gang = require('../src/models/gang')
const User = require('../src/models/user')
const logger = require('../src/log/logging')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'timowerner',
    email: 'timowerner@hotmail.com',
    password: 'timowerner',
    mobile_number: '01111076543',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'hakimziyech',
    email: 'hakimziyech@hotmail.com',
    password: 'hakimziyech',
    mobile_number: '0146758876',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const userThree = {
    _id: userThreeId,
    name: 'kaihavertz',
    email: 'kaihavertz@hotmail.com',
    password: 'kaihavertz',
    mobile_number: '0166757876',
    tokens: [{
        token: jwt.sign({ _id: userThreeId }, process.env.JWT_SECRET)
    }]
}

const gang = {
    _id: new mongoose.Types.ObjectId(),
    name: 'PV13 17-18',
    description: 'Hostel gang',
    admin: userOne._id,
    members: [
        { _id: userOne._id },
        { _id: userTwo._id }
    ]
}

beforeEach(async () => {
    await Gang.deleteMany()
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Gang(gang).save()
})

test('Should create new gang', async () => {
    const response = await request(app)
        .post('/v1/gang')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'TARUC FC',
            description: 'College football gang',
            members: [
                { _id: userOneId },
                { _id: userTwoId }
            ]
        }).expect(201)

    // assert that the database was changed correctly
    const gang = await Gang.findById(response.body.gang._id)
    expect(gang).not.toBeNull()
})

test('Should not create new gang for unauthenticated user', async () => {
    await request(app)
        .post('/v1/gang')
        .send({
            name: 'TARUC FC',
            description: 'College football gang',
            members: [
                { _id: userOneId },
                { _id: userTwoId }
            ]
        }).expect(401)
})

test('Should not create new gang with an existing name', async () => {
    await request(app)
        .post('/v1/gang')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'PV13 17-18',
            description: 'College football gang',
            members: [
                { _id: userOneId },
                { _id: userTwoId }
            ]
        }).expect(400)
})

test('Should get all the gangs of the user', async () => {
    const response = await request(app)
        .get('/v1/gangs')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(1)
})

test('Should get gang details', async () => {
    const response = await request(app)
        .get(`/v1/gangs/${gang._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get gang details if unauthenticated', async () => {
    const response = await request(app)
        .get(`/v1/gangs/${gang._id}`)
        .send()
        .expect(401)
})

test('Should not get gang details if user not member of the gang', async () => {
    const response = await request(app)
        .get(`/v1/gangs/${gang._id}`)
        .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
        .send()
        .expect(401)

    logger.info("This is the response " + response.body.toString())
})