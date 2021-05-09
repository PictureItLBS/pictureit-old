import { Router } from 'express'
import User from '../../models/User.js'
import fileUpload from '../../libs/fileUpload.js'
import verifyToken from '../../libs/verifyToken.js'
import allowedMimeTypes from '../../libs/allowedMimeTypes.js'


const userApi = Router()

// ---
// Profile Pictures
// ---
userApi.get('/profilePicture/get/:name', async (req, res) => {
    const decodedToken = verifyToken(req.cookies.apiToken)
    if (decodedToken.invalid)
        return decodedToken.action()

    const user = await User.findOne({ name: req.params.name })
    if (!user)
        return res.status(400).json({
            success: false,
            error: "User doesn't exist."
        })

    const buffer = user.profilePicture.data
    const imageURL = `data:${user.profilePicture.contentType};base64,${buffer.toString('base64')}`

    res.render('pages/app/viewImage.njk', { imageDataUrl: imageURL })
})

userApi.post(
    '/profilePicture/new',
    fileUpload.single('image'),
    async (req, res) => {
        const decodedToken = verifyToken(req.cookies.apiToken)
        if (decodedToken.invalid)
            return decodedToken.action()

        if (!req.file)
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "uppladdning av profilbild",
                    errorCode: "Missing Image File",
                    solution: "Det ser ut som att du glömde att ladda upp en bild.",
                    error: null
                }
            )

        if (!allowedMimeTypes.includes(req.file.mimetype.split('/')[1]))
            return res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "uppladdning av profilbild",
                    errorCode: "Invalid File Format",
                    solution: "Det ser ut som att du laddade upp en bild med ett icke-tillåtet format. Tillåtna format är: png, jpg/jpeg, gif",
                    error: null
                }
            )

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

export default userApi