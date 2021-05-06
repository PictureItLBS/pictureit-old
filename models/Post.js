import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        min: 1
    },
    caption: {
        type: String,
        required: true,
        min: 1,
        max: 32
    },
    likedPosts: {
        type: Array,
        default: []
    }
})

export default mongoose.model('Post', postSchema)