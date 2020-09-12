const mongoose = require('mongoose')
const validator = require('validator')

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "An unique name is required for the expense"],
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
    },
    delete_flag: {
        type: String,
        default: "N"
    }
}, {
    timestamps: true
})

expenseSchema.methods.toJSON = function () {
    const expense = this
    const expenseObject = expense.toObject()

    delete expenseObject.delete_flag
    delete expenseObject.gang
    delete expenseObject.createdAt
    delete expenseObject.updatedAt
    delete expenseObject.__v

    return expenseObject
}


expenseSchema.index({ name: 1, gang: 1 }, { unique: true })

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense