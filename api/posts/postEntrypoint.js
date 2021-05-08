import { Router } from 'express'
import fileUpload from '../../libs/fileUpload.js'
import Post from '../../models/Post.js'
import verifyToken from '../../libs/verifyToken.js'
import { body as validate, validationResult } from 'express-validator'


const postApi = Router()

postApi.post(
    '/new',
    validate('caption').isString().isLength({ min: 1, max: 512 }),
    fileUpload.single('image'),
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

postApi.get('/show', async (req, res) => {
    const posts = await Post.find({})

    const buffer = posts[0].image.data
    const imageURL = `data:image/png;base64,${buffer.toString('base64')}`

    res.render('pages/app/post.njk', { image: imageURL })
})

export default postApi