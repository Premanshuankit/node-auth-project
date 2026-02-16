const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: {
            type: Number,
            default: 1984
        },
        Admin: {
            type: Number,
            default: 5150
        }
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel