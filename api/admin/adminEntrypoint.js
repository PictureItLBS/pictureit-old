import { Router } from 'express'
import User from '../../models/User.js'
import Post from '../../models/Post.js'
import verifyToken from '../../libs/verifyToken.js'
import { body as validate, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'


const adminApi = Router()

adminApi.post(
    '/resetPassword',
    validate('username').isString().isAlphanumeric().isLength({ min: 1, max: 32 }),
    validate('password').isLength({ min: 1 }),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken, 2)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "återställning av konto",
                    errorCode: "Account Creation Validation Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.)",
                    error: errors.array().toString()
                }
            )

        const user = await User.findOne({ name: req.body.username })
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await user.updateOne({ password: hashedPassword })

        res.send(`Användaren ${req.body.username} har nu ett nytt lösenord!`)
    }
)

adminApi.post(
    '/lockUser',
    validate('username').isString().isAlphanumeric().isLength({ min: 1, max: 32 }),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken, 2)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "låsning av konto",
                    errorCode: "Account Creation Validation Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.)",
                    error: errors.array().toString()
                }
            )

        const user = await User.findOne({ name: req.body.username })
        await user.updateOne({ password: "LOCKED_ACCOUNT" })

        res.send(`Användaren ${req.body.username} är nu låst!`)
    }
)

adminApi.post(
    '/deleteUser',
    validate('username').isString().isAlphanumeric().isLength({ min: 1, max: 32 }),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken, 2)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "borttagning av konto",
                    errorCode: "Account Creation Validation Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.)",
                    error: errors.array().toString()
                }
            )

        const user = await User.findOne({ name: req.body.username })
        if (!user)
            return res.send("Användaren finns inte!")

        // Delete posts and likes.
        for (const postID in user.posts) {
            const post = await Post.findOne({ _id: user.posts[postID] })

            for (const userID in post.likedBy) {
                const user = await User.findOne({ _id: userID })
                user.likedPosts.splice(user.likedPosts.indexOf(post._id), 1)
                await user.updateOne({ likedPosts: user.likedPosts })
            }

            await Post.deleteOne({ _id: post._id })
        }

        // Delete own likes.
        for (const postID in user.likedPosts) {
            const post = await Post.findOne({ _id: user.likedPosts[postID] })

            if (!post) continue

            post.likedBy?.splice(post?.likedBy?.indexOf(user._id), 1)
            await post?.updateOne({ likedBy: post?.likedBy })

            const publisher = await User.findOne({ _id: post.publisher })
            await publisher.updateOne({ likes: publisher.likes - 1 })
        }

        // Make all followers stop following.
        for (const targetID in user.followers) {
            const target = await User.findOne({ _id: user.followers[targetID] })

            if (!target) continue

            target.following.splice(target.following.indexOf(user._id), 1)
            await target.updateOne({ following: target.following })
        }

        // Unfollow everyone
        for (const targetID in user.following) {
            const target = await User.findOne({ _id: user.following[targetID] })

            if (!target) continue

            target.followers.splice(target.followers.indexOf(user._id), 1)
            await target.updateOne({ followers: target.followers })
        }

        // DELETE ACCOUNT
        await User.deleteOne({ _id: user._id })

        res.send(`Användaren ${req.body.username} har nu tagits bort!`)
    }
)

export default adminApi