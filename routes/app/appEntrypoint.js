import { Router } from 'express'
import feedEntrypoint from './feed/feedEntrypoint.js'
import exploreEntrypoint from './explore/exploreEntrypoint.js'
import postEntrypoint from './post/postEntrypoint.js'
import profileEntrypoint from './profile/profileEntrypoint.js'

const appEntrypoint = Router()

appEntrypoint.use('/home', feedEntrypoint)

appEntrypoint.use('/explore', exploreEntrypoint)

appEntrypoint.get('/upload', (req, res) => res.render('pages/app/upload.njk'))
appEntrypoint.use('/post', postEntrypoint)

appEntrypoint.use('/profile', profileEntrypoint)

appEntrypoint.get('/user/:username', (req, res) => res.render('pages/app/user.njk', {username: req.params.username}))

export default appEntrypoint