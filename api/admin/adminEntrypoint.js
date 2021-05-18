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
                    errorSource: "skapande av konto",
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

export default adminApi