const request = require('supertest')
const mongoose = require('mongoose')
const app =require('../src/app')
const User = require('../src/models/user')
const logger = require('../src/log/logging')

const email = 'lionelmessi@hotmail.com'
const mobile_number = '0178654432'
const userOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'lionel',
    email,
    password: 'lionelmessi',
    mobile_number
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should return 1 when the new email is available', async () => {
    const response = await request(app)
        .get(`/v1/check/email/cristiano@gmail.com`)
        .send()
        .expect(200)
    
    expect(response.body.code).toEqual('1')
})

test('Should return -1 when the new email has already been taken', async () => {
    const response = await request(app)
        .get(`/v1/check/email/${email}`)
        .send()
        .expect(404)
    
    expect(response.body.code).toEqual('-1')
})


test('Should return 1 when the new mobile number is available', async () => {
    const response = await request(app)
        .get(`/v1/check/mobile/0145675543`)
        .send()
        .expect(200)
    
    expect(response.body.code).toEqual('1')
})

test('Should return -1 when the new mobile number has already been taken', async () => {
    const response = await request(app)
        .get(`/v1/check/mobile/${mobile_number}`)
        .send()
        .expect(404)
    
    expect(response.body.code).toEqual('-1')
})