import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import Post from '../../../models/Post.js'
import User from '../../../models/User.js'


const postEntrypoint = Router()

postEntrypoint.get('/:id', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (!decodedToken)
        return res.status(401).render('pages/errors/tokenExpired.njk')

    const post = await Post.findOne({ _id: req.params.id })
    if (!post)
        return res.status(400).render(
            'pages/errors/genericError.njk',
            {
                errorSource: "hämtning av inlägg",
                errorCode: "Post Does Not Exist",
                solution: "Posten du letar efter existerar inte. Den kan ha blivit borttagen.",
                error: null
            }
        )

    const imageURL = `data:image/png;base64,${post.image.data.toString('base64')}`

    const publisher = await User.findOne({ _id: post.publisher })

    res.render(
        'pages/app/post.njk', 
        { 
            publisher: publisher?.name,
            image: imageURL,
            caption: post?.caption
        }
    )
})

export default postEntrypoint