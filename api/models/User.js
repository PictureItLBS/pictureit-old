import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 32
    },
    password: {
        type: String,
        required: true,
        min: 1,
        max: 1024
    },
    permissionLevel: {
        type: Number,
        default: 0
    },
    follows: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    likedPosts: {
        type: Array,
        default: []
    }
})

export default mongoose.model('User', userSchema)