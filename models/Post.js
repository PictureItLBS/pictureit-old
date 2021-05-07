import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    publisher: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    caption: {
        type: String,
        required: true,
        min: 1,
        max: 512
    },
    date: {
        type: Date
    },
    likedBy: {
        type: Array,
        default: []
    }
})

export default mongoose.model('Post', postSchema)