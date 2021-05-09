import { Router } from 'express'
import fs from 'fs'

const docsRouter = Router()

docsRouter.get('/article/:title', (req, res) => {
    const articleTitle = req.params.title

    if (fs.existsSync(`views/pages/docs/${articleTitle}.njk`))
        return res.render(`pages/docs/${articleTitle}.njk`)

    res.render('pages/docs/articleDoesNotExist.njk')
})

export default docsRouter