// Import 3rd party packages/libs
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import njk from 'nunjucks'
import mongoose from 'mongoose'
import dotenv from 'dotenv'


// Import routes for API and the actual site.
import siteRoutes from './routes/siteEntrypoint.js'
import apiRoutes from './api/apiEntrypoint.js'


// Load environment veriables from the '.env' file.
dotenv.config()


// Create an app being an instance of express - the library that handles the backend server.
const App = express()


// Connect to the database and shit.
mongoose.connect(
    process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("Database connected.")
)


// Configure middlewares for express. (Basically addons/plugins; extra functionality.)
App.use(bodyParser.urlencoded({ extended: true }))
App.use(bodyParser.json())
App.use(cookieParser())


// Setup nunjucks. Nunjucks uses the 'views' directory.
// Nunjucks is a rendering engine that allows you to reuse HTML code. (And more.)
njk.configure(
    'views', 
    {
        autoescape: true,
        express: App
    }
)


// Setup the static file directory 'static'. It contains non-changing assets and so on.
App.use(express.static('static'))


// Setup the server to use the imported routes on said paths.
App.use('/', siteRoutes)
App.use('/api', apiRoutes) // In the longterm you should consider binding them to versions like: /api/v1, /api/v2, etc.


// Start the server on port 5500
App.listen(5500, () => {
    console.log("The server has started and is running on http://localhost:5500")
})