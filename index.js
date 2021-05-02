const express = require('express')
const njk = require('nunjucks')

const App = express()

// Setup nunjucks. Nunjucks uses the 'views' directory.
njk.configure(
    'views', 
    {
        autoescape: true,
        express: App
    }
)

// Setup the static file directory 'static'. It contains non-changing assets and so on.
App.use(express.static('static'))

App.get('/', (req, res) => res.render('pages/helloworld.njk'))


App.listen(5500, () => {
    console.log("The server has started and is running on http://localhost:5500")
})