const mongoose = require('mongoose')
const validator = require('validator')

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    gang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gang'
    },
    recurring: {
        type: Boolean,
        default: false
    },
    recurring_period: {
        type: String,
        default: "monthly"
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    }
}, {
    timestamps: true
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense