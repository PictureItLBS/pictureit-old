import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import User from '../../../models/User.js'


const adminEntrypoint = Router()

adminEntrypoint.get('/', (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken, 2)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    res.render('pages/admin/admin.njk')
})

adminEntrypoint.get('/unverifiedUsers', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken, 2)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const users = await User.find({ permissionLevel: 0 })

    res.render(
        'pages/admin/unverifiedUsers.njk',
        {
            users
        }
    )
})

export default adminEntrypoint