import { Router } from 'express'
import User from '../../../models/User.js'

const exploreEntrypoint = Router()

exploreEntrypoint.get('/', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    res.end()
})

export default exploreEntrypoint