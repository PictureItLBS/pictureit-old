import multer from 'multer'
import allowedMimeTypes from './allowedMimeTypes.js'

const storage = multer.memoryStorage()

const fileUpload = multer({
    storage: storage,
    limits: {
        fileSize: 8 * 1024 * 1024
    }
})

function validate(file) {
    if (!file) 
        return {
            errors: true,
            action: res => res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "uppladdning av bild",
                    errorCode: "Missing Image File",
                    solution: "Det ser ut som att du glömde att ladda upp en bild.",
                    error: null
                }
            )
        }

    if (!allowedMimeTypes.includes(file.mimetype))
        return {
            errors: true,
            action: res => res.status(400).render(
                'pages/errors/genericError.njk',
                {
                    errorSource: "uppladdning av bild",
                    errorCode: "Invalid File Format",
                    solution: "Det ser ut som att du laddade upp en bild med ett icke-tillåtet format. Tillåtna format är: png, jpg/jpeg, gif",
                    error: null
                }
            )
        }

    return {
        errors: false
    }
}

export default { multer: fileUpload, validate }