import { Router } from 'express'
import User from '../../models/User.js'
import fileUpload from '../../libs/fileUpload.js'
import verifyToken from '../../libs/verifyToken.js'

const pfpApi = Router()

pfpApi.get('/get/string/:name', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ name: req.params.name })
    if (!user)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    const buffer = user.profilePicture.data
    const imageURL = buffer ? `data:${user.profilePicture.contentType};base64,${buffer.toString('base64')}` : '/assets/resources/logo.png'

    res.json({
        success: true,
        imageURL
    })
})

pfpApi.get('/get/render/:name', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action(res)

    const user = await User.findOne({ name: req.params.name })
    if (!user)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    const buffer = user.profilePicture.data
    const imageURL = buffer ? `data:${user.profilePicture.contentType};base64,${buffer.toString('base64')}` : '/assets/resources/logo.png'


    res.render('pages/app/viewImage.njk', { imageDataUrl: imageURL })
})


pfpApi.post(
    '/new',
    fileUpload.multer.single('image'),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken)
        if (decodedToken.invalid)
            return decodedToken.action(res)

        const fileValidation = fileUpload.validate(req.file)
        if (fileValidation.errors)
            return fileValidation.action(res)

        const image = req.file.buffer
        const user = await User.findOne({ _id: decodedToken._id })

        await user.updateOne({ 
            profilePicture: {
                data: image,
                contentType: req.file.mimetype
            }
        })

        res.redirect('back')
    }
)

export default pfpApi