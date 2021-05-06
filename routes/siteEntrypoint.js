import { Router } from 'express'
import appEntrypoint from './app/appEntrypoint.js'

const siteEntrypoint = Router()

// Main site
siteEntrypoint.get('/', (req, res) => res.render('pages/landing.njk'))

// Register and signin
siteEntrypoint.get('/login', (req, res) => res.render('pages/auth/login.njk'))
siteEntrypoint.get('/register', (req, res) => res.render('pages/auth/register.njk'))

// Main app
siteEntrypoint.use('/app', appEntrypoint)

// Hello World Testing! =D
siteEntrypoint.get('/helloworld', (req, res) => res.render('pages/helloworld.njk'))

export default siteEntrypoint