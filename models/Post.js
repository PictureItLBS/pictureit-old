import mongoose from 'mongoose'
import mongoose_fuzzy_searching from 'mongoose-fuzzy'

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
        type: [String],
        default: []
    }
})

postSchema.plugin(mongoose_fuzzy_searching, {
    fields: ["caption"]
})

export default mongoose.model('Post', postSchema)