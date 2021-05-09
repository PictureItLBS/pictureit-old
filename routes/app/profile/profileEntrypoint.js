import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import User from '../../../models/User.js'


const profileEntrypoint = Router()

profileEntrypoint.get('/', (req, res) => res.render('pages/app/myProfile.njk'))
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

export default profileEntrypoint