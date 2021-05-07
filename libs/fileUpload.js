import multer from 'multer'

const storage = multer.memoryStorage()

export default multer({
    storage: storage,
    limits: {
        fileSize: 16 * 1024 * 1024
    }
})