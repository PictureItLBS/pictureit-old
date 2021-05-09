import { Router } from 'express'
import appEntrypoint from './app/appEntrypoint.js'
import docsEntrypoint from './docs/docsEntrypoint.js'

const siteEntrypoint = Router()

// Main site
siteEntrypoint.get('/', (req, res) => res.render('pages/landing.njk'))

// Register and signin
siteEntrypoint.get('/login', (req, res) => res.render('pages/auth/login.njk'))
siteEntrypoint.get('/register', (req, res) => res.render('pages/auth/register.njk'))

// Main app
siteEntrypoint.use('/app', appEntrypoint)

// Help pages and so on... (Will slowly be implemented I guess...)
siteEntrypoint.use('/docs', docsEntrypoint)

// Hello World Testing! =D
siteEntrypoint.get('/helloworld', (req, res) => res.render('pages/errors/tokenError.njk'))

export default siteEntrypoint