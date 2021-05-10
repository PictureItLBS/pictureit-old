import { Router } from 'express'
import User from '../../models/User.js'
import verifyToken from '../../libs/verifyToken.js'
import pfpApi from "./profilePicture.js";

const userApi = Router()

userApi.use('/profilePicture', pfpApi)

userApi.post('/follow/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const target = await User.findOne({ _id: req.params.id })
    if (!target)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    const user = await User.findOne({ _id: decodedToken._id })
    if (user.following.includes(target._id))
        return res.status(400).json({
            success: false,
            error: "You already follow that user."
        })

    // Add target to the user following list.
    user.following.push(target._id)
    await user.updateOne({ following: user.following })

    // Add the user to the target followers list
    target.followers.push(user._id)
    await target.updateOne({ followers: target.followers })

    res.json({
        success: true
    })
})

userApi.delete('/unfollow/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const target = await User.findOne({ _id: req.params.id })
    if (!target)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    const user = await User.findOne({ _id: decodedToken._id })
    if (!user.following.includes(target._id))
        return res.status(400).json({
            success: false,
            error: "You don't follow that user."
        })

    // Remove target to the user following list.
    user.following.splice(user.following.indexOf(target._id), 1)
    await user.updateOne({ following: user.following })

    // Remove the user to the target followers list
    target.followers.splice(target.followers.indexOf(user._id), 1)
    await target.updateOne({ followers: target.followers })

    res.json({
        success: true
    })
})

export default userApi