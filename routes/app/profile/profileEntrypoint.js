import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import Post from '../../../models/Post.js'
import User from '../../../models/User.js'


const profileEntrypoint = Router()

profileEntrypoint.get('/', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken, 0)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ _id: decodedToken._id })

    const posts = []
    for (const postID in user.posts) {
        const post = await Post.findOne({ _id: user.posts[postID] })
        posts.push({
            _id: post._id,
            publisher: user.name,
            caption: post.caption,
            isLiked: user.likedPosts.includes(post._id),
            likesAmount: post.likedBy.length,
            canDelete: true,
            date: `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`
        })
    }
    posts.reverse()

    res.render(
        'pages/app/user.njk', 
        { 
            user,
            posts,
            myProfile: true,
            following: false,
            teacherView: decodedToken.permissionLevel >= 2,
            unverified: user.permissionLevel == 0
        }
    )
})

profileEntrypoint.get('/likedPosts', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const me = await User.findOne({ _id: decodedToken._id })

    const posts = []
    for (const postID in me.likedPosts) {
        const post = await Post.findOne({ _id: me.likedPosts[postID] })
        const publisher = await User.findOne({ _id: post.publisher })
        posts.push({
            _id: post._id,
            publisher: publisher.name,
            caption: post.caption,
            isLiked: true,
            likesAmount: post.likedBy.length,
            canDelete: me._id == post.publisher || decodedToken.permissionLevel >= 2,
            date: `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`
        })
    }
    posts.reverse()

    res.render(
        'pages/app/likedPosts.njk', 
        { 
            posts
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

profileEntrypoint.get('/mydata/deleteAccount', (req, res) => res.render('pages/auth/delete.njk'))

profileEntrypoint.get('/user/:name', async (req, res) => {
    // Try to verify the token, if the decodedToken is null/empty, it is not verified.
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ name: req.params.name })
    if (!user)
        return res.status(404).send('Error 404: användaren hittades inte.')

    const visitor = await User.findOne({ _id: decodedToken._id })

    const posts = []
    for (const postID in user.posts) {
        const post = await Post.findOne({ _id: user.posts[postID] })
        posts.push({
            _id: post._id,
            publisher: user.name,
            caption: post.caption,
            isLiked: visitor.likedPosts.includes(post._id),
            likesAmount: post.likedBy.length,
            canDelete: decodedToken.permissionLevel >= 2,
            date: `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`
        })
    }
    posts.reverse()

    res.render(
        'pages/app/user.njk', 
        { 
            user,
            posts,
            myProfile: false,
            following: visitor.following.includes(user._id),
            teacherView: decodedToken.permissionLevel >= 2,
            adminView: decodedToken.permissionLevel >= 3,
            unverified: user.permissionLevel == 0,
            notTeacher: user.permissionLevel < 2
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

    const visitor = await User.findOne({ _id: decodedToken._id })

    const posts = []
    for (const postID in user.posts) {
        const post = await Post.findOne({ _id: user.posts[postID] })
        posts.push({
            _id: post._id,
            publisher: user.name,
            caption: post.caption,
            isLiked: visitor.likedPosts.includes(post._id),
            likesAmount: post.likedBy.length,
            canDelete: decodedToken.permissionLevel >= 2,
            date: `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`
        })
    }
    posts.reverse()

    res.render(
        'pages/app/user.njk', 
        { 
            user,
            posts,
            myProfile: false,
            following: visitor.following.includes(user._id),
            teacherView: decodedToken.permissionLevel >= 2,
            adminView: decodedToken.permissionLevel >= 3,
            unverified: user.permissionLevel == 0,
            notTeacher: user.permissionLevel < 2
        }
    )
})

export default profileEntrypoint