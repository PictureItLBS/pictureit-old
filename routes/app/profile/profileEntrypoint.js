import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import User from '../../../models/User.js'


const profileEntrypoint = Router()

profileEntrypoint.get('/', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken, 0)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ _id: decodedToken._id })

    res.render(
        'pages/app/user.njk', 
        { 
            user,
            myProfile: true
        }
    )
})

profileEntrypoint.get('/mydata', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken, 0)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    // Fetch the user from the database
    const userInDatabase = await User.findOne({ _id: decodedToken._id })
    const profilePictureUrl = userInDatabase.profilePicture.data ? `data:${userInDatabase.profilePicture.contentType};base64,${userInDatabase.profilePicture.data.toString('base64')}` : '/assets/resources/logo.png'

    res.render(
        'pages/app/accountZone/myData.njk',
        {
            username: userInDatabase.name,
            profilePictureUrl: profilePictureUrl,
            following: userInDatabase.following?.length,
            followers: userInDatabase.followers?.length,
            likes: userInDatabase.likes,
            permissionLevel: userInDatabase.permissionLevel,
            postsAmount: userInDatabase.posts?.length,
            likedPostsAmount: userInDatabase.likedPosts?.length,
        }
    )
})

profileEntrypoint.get('/user/:name', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ name: req.params.name })
    if (!user)
        return res.status(404).send('Error 404: användaren hittades inte.')

    res.render(
        'pages/app/user.njk', 
        { 
            user,
            teacherView: decodedToken.permissionLevel >= 2,
            unverified: user.permissionLevel == 0
        }
    )
})

profileEntrypoint.get('/id/:id', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ _id: req.params.id })
    if (!user)
        return res.status(404).send('Error 404: användaren hittades inte.')

    res.render(
        'pages/app/user.njk', 
        { 
            user,
            teacherView: decodedToken.permissionLevel >= 2,
            unverified: user.permissionLevel == 0
        }
    )
})

export default profileEntrypoint