import { Router } from 'express'
import User from '../../../models/User.js'
import Post from '../../../models/Post.js'
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

    const me = await User.findOne({ _id: decodedToken._id })

    const users = await User.fuzzySearch(req.query.q)

    const postsFound = await Post.fuzzySearch({ query: req.query.q })
    const posts = []
    for (const postIndex in postsFound) {
        const post = postsFound[postIndex]
        const publisher = await User.findOne({ _id: post.publisher })

        posts.push({
            _id: post._id,
            publisher: publisher.name,
            caption: post.caption,
            isLiked: me.likedPosts.includes(post._id),
            likesAmount: post.likedBy.length,
            date: `${post?.date?.toLocaleTimeString('sv-SE').split(':')[0]}:${post?.date?.toLocaleTimeString('sv-SE').split(':')[1]} - ${post?.date?.toLocaleDateString('sv-SE').split('-').reverse().join('/')}`
        })
    }


    res.render(
        'pages/app/explore.njk',
        {
            query: req.query.q,
            users,
            posts
        }
    )
})

export default exploreEntrypoint