import { Router } from 'express'

const siteEntryoint = Router()

// Main site
siteEntryoint.get('/', (req, res) => res.render('pages/landing.njk'))

// Register and signin
siteEntryoint.get('/login', (req, res) => res.render('pages/auth/login.njk'))
siteEntryoint.get('/register', (req, res) => res.render('pages/auth/register.njk'))

// Main app
siteEntryoint.get('/home', (req, res) => res.render('pages/app/feed.njk'))
siteEntryoint.get('/explore', (req, res) => res.render('pages/app/explore.njk'))
siteEntryoint.get('/me', (req, res) => res.render('pages/app/myprofile.njk'))
siteEntryoint.get('/user/:username', (req, res) => res.render('pages/app/user.njk', {username: req.params.username}))

// Hello World Testing! =D
siteEntryoint.get('/helloworld', (req, res) => res.render('pages/helloworld.njk'))

export default siteEntryoint