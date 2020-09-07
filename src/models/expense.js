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
        required: [true, 'Amount of the expense is required']
    }
}, {
    timestamps: true
})

expenseSchema.index({ name: 1, gang: 1 }, { unique: true })

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense