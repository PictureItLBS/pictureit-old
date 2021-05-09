import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import Post from '../../../models/Post.js'
import User from '../../../models/User.js'


const postEntrypoint = Router()

postEntrypoint.get('/view/:id', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action()

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

    const imageURL = `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`

    const publisher = await User.findOne({ _id: post.publisher })

    const isLiked = post.likedBy.includes(decodedToken._id) ? 'active' : ''

    const publishDate = `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`

    res.render(
        'pages/app/post.njk', 
        {
            postID: post?._id,
            publisher: publisher?.name,
            image: imageURL,
            caption: post?.caption,
            likesAmount: post?.likedBy?.length,
            isLiked: isLiked,
            publishDate: publishDate
        }
    )
})

export default postEntrypoint