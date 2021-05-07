import { Router } from 'express'
import fileUpload from '../../libs/fileUpload.js'
import Post from '../../models/Post.js'

const postApi = Router()

postApi.post('/new', fileUpload.single('image'), async (req, res) => {
    const image = req.file.buffer

    const post = new Post({
        image: {
            data: image,
            contentType: 'image/png'
        },
        caption: "yes!",
        date: new Date(Date.now()),
        likedBy: []
    })

    await post.save()
})

postApi.get('/show', async (req, res) => {
    const images = await Post.find({})

    res.contentType(images[0].image.contentType).send(images[0].image.data)
})

export default postApi