const mongoose = require('mongoose')
const validator = require('validator')

const gangSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

gangSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'gang'
})

const Gang = mongoose.model('Gang', gangSchema)

module.exports = Gang