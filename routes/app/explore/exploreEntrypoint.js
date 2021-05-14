import { Router } from 'express'
import User from '../../../models/User.js'
import verifyToken from '../../../libs/verifyToken.js'

const exploreEntrypoint = Router()

exploreEntrypoint.get('/', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    res.render('pages/app/explore.njk')
})

exploreEntrypoint.get('/search', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    // const users = await User.fuzzy(req.query.q)

    res.render(
        'pages/app/explore.njk',
        {
            query: req.query.q
        }
    )
})

export default exploreEntrypoint