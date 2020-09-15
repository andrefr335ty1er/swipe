const mongoose = require('mongoose')

const choiceSchema = new mongoose.Schema({
    choice: {
        type: String,
        trim: true
    },
    answer_flag: {
        type: String,
        required: [true, 'Answer flag is required']
    }
})

const quizSchema = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
        required: [true, 'Question is required']
    },
    choices: [choiceSchema]
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz