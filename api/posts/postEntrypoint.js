import { Router } from 'express'
import fileUpload from '../../libs/fileUpload.js'
import Post from '../../models/Post.js'
import verifyToken from '../../libs/verifyToken.js'

const postApi = Router()

postApi.post('/new', fileUpload.single('image'), async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (!decodedToken)
        return res.status(401).render('pages/errors/tokenExpired.njk')

    const image = req.file.buffer

    const post = new Post({
        publisher: decodedToken._id,
        image: {
            data: image,
            contentType: 'image/png'
        },
        caption: req.body.caption,
        date: new Date(Date.now()),
        likedBy: []
    })

    const savedPost = await post.save()

    res.redirect('/app/post/view/' + savedPost._id)
})

postApi.get('/show', async (req, res) => {
    const posts = await Post.find({})

    const buffer = posts[0].image.data
    const imageURL = `data:image/png;base64,${buffer.toString('base64')}`

    res.render('pages/app/post.njk', { image: imageURL })
})

export default postApi