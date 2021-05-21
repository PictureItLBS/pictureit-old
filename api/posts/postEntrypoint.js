import { Router } from 'express'
import fileUpload from '../../libs/fileUpload.js'
import Post from '../../models/Post.js'
import User from '../../models/User.js'
import verifyToken from '../../libs/verifyToken.js'
import { body as validate, validationResult } from 'express-validator'


const postApi = Router()

postApi.post(
    '/new',
    fileUpload.multer.single('image'),
    validate('caption').isString().isLength({ min: 1, max: 512 }).trim().escape(),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        const fileValidation = fileUpload.validate(req.file)
        if (fileValidation.errors)
            return fileValidation.action(res)

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
                contentType: req.file.mimetype
            },
            caption: req.body.caption,
            date: new Date(Date.now()),
            likedBy: []
        })

        const savedPost = await post.save()

        const user = await User.findOne({ _id: decodedToken._id })
        user.posts.push(savedPost._id)
        await user.updateOne({ posts: user.posts })

        res.redirect('/app/post/view/' + savedPost._id)
    }
)

postApi.delete('/delete/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const post = await Post.findOne({ _id: req.params.id })
    if (!post)
        return res.status(400).json({
            success: false,
            error: "Post doesn't exist."
        })

    // If the user is not a teacher, and does not own the post, fail.
    if (decodedToken.permissionLevel < 2 && post.publisher != decodedToken._id)
        return res.status(400).json({
            success: false,
            error: "That's not your post!"
        })

    // Remove this post from all liked-collections for all users. (How to explain in words?)
    for (const userID in post.likedBy) {
        const user = await User.findOne({ _id: post.likedBy[userID] })
        user.likedPosts.splice(user.likedPosts.indexOf(post._id), 1)
        await user.updateOne({ likedPosts: user.likedPosts })
    }

    // Remove likes from the publisher's total-likes-counter.
    const publisher = await User.findOne({ _id: post.publisher })
    await publisher.updateOne({ likes: publisher.likes - post.likedBy?.length })

    // Remove the post from the user's profile
    const me = await User.findOne({ _id: decodedToken._id })
    me.posts.splice(me.posts.indexOf(post._id), 1)
    await me.updateOne({ posts: me.posts })

    await Post.deleteOne({ _id: post._id })

    res.json({
        success: true
    })
})

postApi.get('/rawimage/render/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const post = await Post.findOne({ _id: req.params.id })
    if (!post)
        return res.status(400).json({
            success: false,
            error: "Image doesn't exist."
        })

    const buffer = post.image.data
    const imageURL = `data:${post.image.contentType};base64,${buffer.toString('base64')}`

    res.render('pages/app/viewImage.njk', { imageDataUrl: imageURL })
})

postApi.get('/rawimage/string/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const post = await Post.findOne({ _id: req.params.id })
    if (!post)
        return res.status(400).json({
            success: false,
            error: "Image doesn't exist."
        })

    const buffer = post.image.data
    const imageURL = `data:${post.image.contentType};base64,${buffer.toString('base64')}`

    res.json({
        success: true,
        image: imageURL
    })
})

postApi.post('/like/:id',  async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

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

    // Increment publisher's total like count.
    const publisher = await User.findOne({ _id: post.publisher })
    await publisher.updateOne({ likes: publisher.likes + 1 })


    // Add to the user's collection of liked posts.
    const userInDB = await User.findOne({ _id: decodedToken._id })
    userInDB.likedPosts.push(post._id)
    await userInDB.updateOne({ likedPosts: userInDB.likedPosts })

    res.json({
        success: true
    })
})

postApi.delete('/unlike/:id',  async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

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

    // Decrease publisher's total like count.
    const publisher = await User.findOne({ _id: post.publisher })
    await publisher.updateOne({ likes: publisher.likes - 1 })

    // Delete from the user's collection of liked posts.
    const userInDB = await User.findOne({ _id: decodedToken._id })
    userInDB.likedPosts.splice(userInDB.likedPosts.indexOf(post._id), 1)
    await userInDB.updateOne({ likedPosts: userInDB.likedPosts })

    res.json({
        success: true
    })
})

export default postApi