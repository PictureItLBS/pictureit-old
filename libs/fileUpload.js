import multer from 'multer'

const storage = multer.memoryStorage()

export default multer({
    storage: storage,
    limits: {
        fileSize: 8 * 1024 * 1024
    }
})