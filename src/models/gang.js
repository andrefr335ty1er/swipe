const mongoose = require('mongoose')
const validator = require('validator')

const gangSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "An unique name is required for a gang"],
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
    },
    delete_flag: {
        type: String,
        default: 'N'
    }
}, {
    timestamps: true
})

gangSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'gang'
})

gangSchema.methods.toJSON = function () {
    const gang = this
    const gangObject = gang.toObject()

    delete gangObject.delete_flag
    delete gangObject.createdAt
    delete gangObject.updatedAt
    delete gangObject.__v

    return gangObject
}

const Gang = mongoose.model('Gang', gangSchema)

module.exports = Gang