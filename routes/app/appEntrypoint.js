import { Router } from 'express'
import profileEntrypoint from './profile/profileEntrypoint.js'
import postEntrypoint from './post/postEntrypoint.js'

const appEntrypoint = Router()

appEntrypoint.get('/home', (req, res) => res.render('pages/app/feed.njk'))

appEntrypoint.get('/explore', (req, res) => res.render('pages/app/explore.njk'))

appEntrypoint.get('/upload', (req, res) => res.render('pages/app/upload.njk'))
appEntrypoint.use('/post', postEntrypoint)

appEntrypoint.use('/profile', profileEntrypoint)

appEntrypoint.get('/user/:username', (req, res) => res.render('pages/app/user.njk', {username: req.params.username}))

export default appEntrypoint