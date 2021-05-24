import { Router } from 'express'
import feedEntrypoint from './feed/feedEntrypoint.js'
import exploreEntrypoint from './explore/exploreEntrypoint.js'
import postEntrypoint from './post/postEntrypoint.js'
import profileEntrypoint from './profile/profileEntrypoint.js'
import adminEntrypoint from './admin/adminEntrypoint.js'

const appEntrypoint = Router()



appEntrypoint.use('/home', feedEntrypoint)
appEntrypoint.use('/profile', profileEntrypoint)

appEntrypoint.use('/explore', exploreEntrypoint)
appEntrypoint.use('/post', postEntrypoint)

appEntrypoint.get('/news', (req, res) => res.render('pages/app/news.njk'))

appEntrypoint.use('/admin', adminEntrypoint)

export default appEntrypoint