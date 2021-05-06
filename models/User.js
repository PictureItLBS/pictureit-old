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
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    likedPosts: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: []
    }
})

export default mongoose.model('User', userSchema)