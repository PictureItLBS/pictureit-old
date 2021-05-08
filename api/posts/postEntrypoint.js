import { Router } from 'express'
import fileUpload from '../../libs/fileUpload.js'
import Post from '../../models/Post.js'
import User from '../../models/User.js'
import verifyToken from '../../libs/verifyToken.js'
import { body as validate, validationResult } from 'express-validator'


const postApi = Router()

postApi.post(
    '/new',
    fileUpload.single('image'),
    validate('caption').isString().isLength({ min: 1, max: 512 }),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken)
        if (!decodedToken)
            return res.status(401).render('pages/errors/tokenExpired.njk')

        if (!req.file)
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "uppladdning av inlägg",
                    errorCode: "Missing Image File",
                    solution: "Det ser ut som att du glömde att ladda upp en bild.",
                    error: null
                }
            )

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "uppladdning av inlägg",
                    errorCode: "Missing Caption Text",
                    solution: "Du glömde att skriva in en bildtext, gå gärna tillbaka och skriv en! :)",
                    error: errors.array().toString()
                }
            )

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
    }
)

postApi.post('/like/:id',  async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (!decodedToken)
        return res.status(401).render('pages/errors/tokenExpired.njk')

    const post = await Post.findOne({ _id: req.params.id })
    if (!post)
        return res.status(400).render(
            'pages/errors/genericError.njk',
            {
                errorSource: "gillning av inlägg",
                errorCode: "Post Does Not Exist",
                solution: "Posten du letar efter existerar inte. Den kan ha blivit borttagen.",
                error: null
            }
        )

    if (post.likedBy.includes(decodedToken._id))
        return res.json({
            success: false,
            error: "You have already liked that post."
        })

    post.likedBy.push(decodedToken._id)
    await post.updateOne({ likedBy: post.likedBy })

    const userInDB = await User.findOne({ _id: decodedToken._id })
    userInDB.likedPosts.push(post._id)
    await userInDB.updateOne({ likedPosts: userInDB.likedPosts })

    res.json({
        success: true
    })
})

postApi.delete('/unlike/:id',  async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (!decodedToken)
        return res.status(401).render('pages/errors/tokenExpired.njk')

    const post = await Post.findOne({ _id: req.params.id })
    if (!post)
        return res.status(400).render(
            'pages/errors/genericError.njk',
            {
                errorSource: "gillning av inlägg",
                errorCode: "Post Does Not Exist",
                solution: "Posten du letar efter existerar inte. Den kan ha blivit borttagen.",
                error: null
            }
        )

    if (!post.likedBy.includes(decodedToken._id))
        return res.json({
            success: false,
            error: "You haven't liked that post."
        })

    post.likedBy.splice(post.likedBy.indexOf(decodedToken._id), 1)
    await post.updateOne({ likedBy: post.likedBy })

    const userInDB = await User.findOne({ _id: decodedToken._id })
    userInDB.likedPosts.splice(userInDB.likedPosts.indexOf(post._id), 1)
    await userInDB.updateOne({ likedPosts: userInDB.likedPosts })

    res.json({
        success: true
    })
})

postApi.get('/show', async (req, res) => {
    const posts = await Post.find({})

    const buffer = posts[0].image.data
    const imageURL = `data:image/png;base64,${buffer.toString('base64')}`

    res.render('pages/app/post.njk', { image: imageURL })
})

export default postApi