import jwt from 'jsonwebtoken'

export default function verifyToken(token, requiredPermissionLevel=1) {
    if (!token)
        return {
            invalid: true,
            action: res => res.status(401).render('pages/errors/tokenError.njk', { reason: "du inte är inloggad eller att din inloggnings-session har runnit ut" })
        }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

        if (decodedToken.permissionLevel < requiredPermissionLevel)
            return {
                invalid: true,
                action: res => res.status(401).render('pages/errors/tokenError.njk', { reason: "inte har tillräckligt hög tillståndsnivå" })
            }

        return decodedToken
    } catch (err) {
        return {
            invalid: true,
            action: res => res.status(401).render('pages/errors/tokenError.njk', { reason: "ett okänt error" })
        }
    }
}