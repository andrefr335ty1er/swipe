const mongoose = require('mongoose')

const referralSchema = new mongoose.Schema({
    referral_code: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})

const Referral = mongoose.model('Referral', referralSchema)

module.exports = Referral