import { Router } from 'express'
import { body as validate, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'


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
                    username: username
                }
            )

        // Hash the password, because ... security.
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user.
        const user = new User({
            name: username,
            password: hashedPassword,
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

authApi.get(
    '/login',
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
                    errorSource: "inloggning",
                    errorCode: "Account Login Validation Failed",
                    solution: "Den informationen du slog in kan ha innehållt icke-tillåtna tecken. (T.ex. likhetstecken i användarnamnet.) \nOm problemet återstår efter att du har försökt igen, kontakta PictureIt eller rapportera det som en bugg.",
                    error: errors.array()
                }
            )

        // Get the data from the body
        const { username, password } = req.body

        // Check if the user exists in the database; if not, you can't sign in.
        const userInDatabase = await User.findOne({ name: username })
        if (!userInDatabase)
            return res.status(400).render(
                'pages/errors/userDoesNotExist.njk',
                {
                    username: username
                }
            )

        const match = await bcrypt.compare(password, userInDatabase.password)
        if (match) {
            // Create an API token for the user that lasts one hour.
            const userApiToken = jwt.sign(
                {
                    _id: userInDatabase._id,
                    name: userInDatabase.name,
                    permissionLevel: userInDatabase.permissionLevel
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
                    expires: new Date(Date.now() + 360000) // One hour in milliseconds.
                }
            )

            // Send the user to the home/feed page.
            res.redirect('/home')
        }
    }
)

export default authApi