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
    profilePicture: {
        data: Buffer,
        contentType: String
    },
    permissionLevel: {
        type: Number,
        default: 0
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    likedPosts: {
        type: [String],
        default: []
    },
    posts: {
        type: [String],
        default: []
    }
})

export default mongoose.model('User', userSchema)