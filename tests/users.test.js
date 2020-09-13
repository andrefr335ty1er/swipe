const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app =require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'lionel',
    email: 'lionelmessi@hotmail.com',
    password: 'lionelmessi',
    mobile_number: '0178654432',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/v1/users').send({
        name: 'fr335ty1er',
        email: 'fr335ty1er@hotmail.com',
        password: 'fr335ty1er',
        mobile_number: '0125647765'
    }).expect(201)

    // assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'fr335ty1er'
        },
        token: user.tokens[0].token
    })
})

test('Should login existing user', async () => {
    const response = await request(app).post('/v1/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {
    await request(app).post('/v1/users/login').send({
        email: userOne.email,
        password: 'somerandomstring'
    }).expect(400)
})


test('Should get profile for user', async () => {
    await request(app)
        .get('/v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/v1/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/v1/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/andre.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)

    // check if the avatar is of type Buffer
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'cabron'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('cabron')
})


test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Texas'
        })
        .expect(400)
})