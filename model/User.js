const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    roles: {
        type: Map,
        of: Number,
        default: { User: 2001 }
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, {
    toJSON: { flattenMaps: true },
    toObject: { flattenMaps: true }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel