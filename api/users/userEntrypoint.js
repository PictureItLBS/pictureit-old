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

    const me = await User.findOne({ _id: decodedToken._id })
    if (me.following.includes(target._id))
        return res.status(400).json({
            success: false,
            error: "You already follow that user."
        })

    // Add target to the user following list.
    me.following.push(target._id)
    await me.updateOne({ following: me.following })

    // Add the user to the target followers list
    target.followers.push(me._id)
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

    const me = await User.findOne({ _id: decodedToken._id })
    if (!me.following.includes(target._id))
        return res.status(400).json({
            success: false,
            error: "You don't follow that user."
        })

    // Remove target to the user following list.
    me.following.splice(me.following.indexOf(target._id), 1)
    await me.updateOne({ following: me.following })

    // Remove the user to the target followers list
    target.followers.splice(target.followers.indexOf(me._id), 1)
    await target.updateOne({ followers: target.followers })

    res.json({
        success: true
    })
})

userApi.post('/validate/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken, 2)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ _id: req.params.id })
    if (!user)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    await user.updateOne({ permissionLevel: 1 })

    res.json({
        success: true
    })
})

userApi.post('/promote/:id', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken, 3)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ _id: req.params.id })
    if (!user)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    if (user.permissionLevel >= 2)
        return res.status(400).json({
            success: false,
            error: "User is already teacher or higher."
        })

    await user.updateOne({ permissionLevel: 2 })

    res.json({
        success: true
    })
})

export default userApi