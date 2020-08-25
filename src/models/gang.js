const mongoose = require('mongoose')
const validator = require('validator')

const gangSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Gang = mongoose.model('Gang', gangSchema)

module.exports = Gang