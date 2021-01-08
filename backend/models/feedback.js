const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    course: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    pr: {
        required: true,
        type: Number
    },
    ratings: {
        experience: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                max: 5,
                min: 1
            }
        },
        lite: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                max: 5,
                min: 1
            }
        },
        grade: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                max: 5,
                min: 1
            }
        }
    },
    feedbacks: {
        good: {
            type: String
        },
        bad: {
            type: String
        },
        other: {
            type: String
        }
    }
})


const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
