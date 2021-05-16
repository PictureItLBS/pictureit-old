import { Router } from 'express'
import { body as validate, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import Post from '../../models/Post.js'
import verifyToken from '../../libs/verifyToken.js'
import JSZip from 'jszip'


const authApi = Router()

authApi.post(
    '/register', 
    validate('username').isString().isAlphanumeric().isLength({ min: 1, max: 32 }),
    validate('password').isLength({ min: 1 }),
    async (req, res) => {
        // Check for errors
        const errors = validationResult(req)

        // Return the errors to the client if there are any.
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "skapande av konto",
                    errorCode: "Account Creation Validation Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.)",
                    error: errors.array().toString()
                }
            )

        // Get the data from the body
        const { username, password } = req.body

        // Check if the username already exists; we can't have two BurnyLlamas, for example.
        const checkForAlreadyExistingUser = await User.findOne({ name: username })
        if (checkForAlreadyExistingUser)
            return res.status(400).render(
                'pages/errors/userAlreadyExists.njk',
                {
                    username
                }
            )

        // Hash the password, because ... security.
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user.
        const user = new User({
            name: username,
            password: hashedPassword,
            profilePicture: {
                data: null,
                contentType: null
            },
            permissionLevel: 0,
            follows: [],
            following: [],
            likes: 0,
            likedPosts: [],
            posts: []
        })

        // Save the user in the database. If it fails send an error to the user.
        try {
            await user.save()
            res.render('pages/auth/message.njk')
        } catch (err) {
            res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "sparande av användaren i databasen",
                    errorCode: "Account Save to Database Failed",
                    solution: "Testa att registrera dig igen, eller kontakta PictureIt.",
                    error: err
                }
            )
        }
    }
)

authApi.post(
    '/login',
    validate('username').isString().isAlphanumeric().isLength({ min: 1, max: 32 }),
    validate('password').isString().isLength({ min: 1 }),
    async (req, res) => {
        // Check for errors
        const errors = validationResult(req)

        // Return the errors to the client if there are any.
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "inloggning",
                    errorCode: "Account Login Validation Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.) \nOm problemet återstår efter att du har försökt igen, kontakta PictureIt eller rapportera det som en bugg.",
                    error: errors.array()
                }
            )

        // Get the data from the body
        const { username, password } = req.body

        // Check if the user exists in the database; if not, you can't sign in.
        const user = await User.findOne({ name: username })
        if (!user)
            return res.status(400).render(
                'pages/errors/userDoesNotExist.njk',
                {
                    username
                }
            )

        const match = await bcrypt.compare(password, user.password)
        if (match) {
            // Create an API token for the user that lasts one hour.
            const userApiToken = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    permissionLevel: user.permissionLevel
                },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: '3600s',
                }
            )

            // Create a cookie that also expires in an hour.
            res.cookie(
                'apiToken',
                userApiToken,
                {
                    expires: new Date(Date.now() + 3600000) // One hour in milliseconds.
                }
            )

            // Send the user to the home/feed page.
            res.redirect('/app/home')
        } else {
            res.status(400).render(
                'pages/auth/login.njk',
                {
                    username
                }
            )
        }
    }
)

authApi.post(
    '/changePass',
    validate('oldPass').isString().isLength({ min: 1 }),
    validate('newPass').isString().isLength({ min: 1 }),
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "borttagning av konto",
                    errorCode: "Account Deletion Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.) \nOm problemet återstår efter att du har försökt igen, kontakta PictureIt eller rapportera det som en bugg.",
                    error: errors.array()
                }
            )

        const decodedToken = verifyToken(req.cookies.apiToken, 0)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        const user = await User.findOne({ _id: decodedToken._id })

        const match = await bcrypt.compare(req.body.oldPass, user.password)
        if (match) {
            const newHashedPassword = await bcrypt.hash(req.body.newPass, 10)

            await user.updateOne({ password: newHashedPassword })

            res.cookie(
                'apiToken',
                null,
                {
                    expires: new Date(Date.now() + 100000) // One hour in milliseconds.
                }
            )

            res.redirect('/login')
        } else {
            res.status(400).send("Fel lösenord!")
        }
    }
)

authApi.post(
    '/deleteAccount',
    validate('username').isString().isAlphanumeric().isLength({ min: 1, max: 32 }),
    validate('password').isString().isLength({ min: 1 }),
    async (req, res) => {
        // Check for errors
        const errors = validationResult(req)

        // Return the errors to the client if there are any.
        if (!errors.isEmpty())
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "borttagning av konto",
                    errorCode: "Account Deletion Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.) \nOm problemet återstår efter att du har försökt igen, kontakta PictureIt eller rapportera det som en bugg.",
                    error: errors.array()
                }
            )

        // Check if the user exists in the database; if not, you can't sign in.
        const decodedToken = verifyToken(req.cookies.apiToken, 0)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        // Get the data from the body
        const { username, password } = req.body

        if (username != decodedToken.name)
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "borttagning av konto",
                    errorCode: "Account Deletion Failed",
                    solution: "Det ser ut som att du slog in fel användarnamn. Du måste också redan vara inloggad för att ta bort ditt konto.",
                    error: errors.array()
                }
            )

        const me = await User.findOne({ _id: decodedToken._id })

        const match = await bcrypt.compare(password, me.password)
        if (match) {
            // Delete posts and likes.
            for (const postID in me.posts) {
                const post = await Post.findOne({ _id: me.posts[postID] })

                for (const userID in post.likedBy) {
                    const user = await User.findOne({ _id: userID })
                    user.likedPosts.splice(user.likedPosts.indexOf(post._id), 1)
                    await user.updateOne({ likedPosts: user.likedPosts })
                }

                await Post.deleteOne({ _id: post._id })
            }

            // Delete own likes.
            for (const postID in me.likedPosts) {
                const post = await Post.findOne({ _id: me.likedPosts[postID] })

                if (!post) continue

                post.likedBy?.splice(post?.likedBy?.indexOf(me._id), 1)
                await post?.updateOne({ likedBy: post?.likedBy })

                const publisher = await User.findOne({ _id: post.publisher })
                await publisher.updateOne({ likes: publisher.likes - 1 })
            }

            // Make all followers stop following.
            for (const targetID in me.followers) {
                const target = await User.findOne({ _id: me.followers[targetID] })

                if (!target) continue

                target.following.splice(target.following.indexOf(me._id), 1)
                await target.updateOne({ following: target.following })
            }

            // Unfollow everyone
            for (const targetID in me.following) {
                const target = await User.findOne({ _id: me.following[targetID] })

                if (!target) continue

                target.followers.splice(target.followers.indexOf(me._id), 1)
                await target.updateOne({ followers: target.followers })
            }

            // Overwrite cookie.
            res.cookie(
                'apiToken',
                null,
                {
                    expires: new Date(Date.now() + 100000)
                }
            )

            // DELETE ACCOUNT
            await User.deleteOne({ _id: me._id })

            res.send("Konto borttagit!")
        } else {
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "borttagning av konto",
                    errorCode: "Account Deletion Failed",
                    solution: "Det ser ut som att du slog in fel lösenord.",
                    error: errors.array()
                }
            )
        }
    }
)

authApi.get('/downloadData', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken, 0)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const zip = new JSZip()
    
    const user = await User.findOne({ _id: decodedToken._id })
    zip.file(`profilePicture.${user.profilePicture.contentType.split('/')[1]}`, user.profilePicture.data, { base64: true })

    const userJSON = JSON.parse(JSON.stringify(user)) // For some reason doing this is necessary to remove "profilePicture" from the JSON file...
    delete userJSON.profilePicture
    zip.file('user.json', JSON.stringify(userJSON, null, 4))

    const posts = []
    for (const postID in user.posts) {
        const post = await Post.findOne({ _id: user.posts[postID] })
        const postHTML = `
            <img src="data:${post.image.contentType};base64,${post.image.data.toString('base64')}" style="max-width: 100vw; max-height: 80vh">
            <p>${post.caption}</p>
            <i>${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}</i>
        `
        posts.push({
            _id: post._id,
            postHTML
        })
    }
    
    const postsDir = zip.folder('posts')
    for (const postIndex in posts) {
        const post = posts[postIndex]
        postsDir.file(`${post._id}.html`, post.postHTML)
    }

    const zipBase64 = await zip.generateAsync({ type: "base64" })
    const zipData = Buffer.from(zipBase64, "base64")

    res.header({
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment; filename=userdata.zip'
    })

    res.send(zipData)
})

export default authApi