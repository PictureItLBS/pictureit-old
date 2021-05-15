import { Router } from 'express'
import verifyToken from '../../../libs/verifyToken.js'
import Post from '../../../models/Post.js'
import User from '../../../models/User.js'

const feedEntrypoint = Router()

feedEntrypoint.get('/', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const me = await User.findOne({ _id: decodedToken._id })

    const postsForFeed = []
    for (const userID in me.following) {
        const user = await User.findOne({ _id: me.following[userID] })

        // Get the latest post from the user
        const post = await Post.findOne({ _id: user.posts[user.posts.length - 1] })

        postsForFeed.push({
            _id: post._id,
            publisher: user.name,
            caption: post.caption,
            isLiked: me.likedPosts.includes(post._id),
            likesAmount: post.likedBy.length,
            canDelete: post.publisher == me._id || me.permissionLevel >= 2,
            date: `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`,
            realDate: post.date
        })
    }

    postsForFeed.sort((a, b) => b.realDate - a.realDate )

    res.render(
        'pages/app/feed.njk',
        {
            posts: postsForFeed
        }
    )
})

export default feedEntrypoint