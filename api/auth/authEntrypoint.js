import { Router } from 'express'

const authApi = Router()

authApi.post('/register', (req, res) => {
    // Read + validate the req body.

    // Check if the username already exists, if so, deny the request.

    // Add the user to the database:
    //  * Salt and hash the password
    //  * Redirect the user to the page that shows that they need to be confirmed by a teacher.
})

authApi.get('/signin', (req, res) => {
    // Read + validate req body.

    // Check if username exists.

    // Check if password hash matches.

    // Send back a cookie with a JWT.
})

export default authApi