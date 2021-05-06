import jwt from 'jsonwebtoken'

export default function verifyToken(token) {
    if (!token)
        return null

    try {
        return jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (err) {
        return false
    }
}