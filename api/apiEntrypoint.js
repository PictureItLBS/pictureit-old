import { Router } from 'express'

import authApi from './auth/authEntrypoint.js'
import postApi from './posts/postEntrypoint.js'
import userApi from './users/userEntrypoint.js'

const apiEntryoint = Router()

apiEntryoint.use('/auth', authApi)
apiEntryoint.use('/posts', postApi)
apiEntryoint.use('/users', userApi)

export default apiEntryoint