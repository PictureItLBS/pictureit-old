import jwt from 'jsonwebtoken'

export default function verifyToken(token) {
    if (!token)
        return null

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

        if (!decodedToken.permissionLevel)
            return false

        return decodedToken
    } catch (err) {
        return false
    }
}