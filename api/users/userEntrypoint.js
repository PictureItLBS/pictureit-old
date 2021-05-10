import { Router } from 'express'
import User from '../../models/User.js'
import verifyToken from '../../libs/verifyToken.js'
import pfpApi from "./profilePicture.js";

const userApi = Router()

userApi.use('/profilePicture', pfpApi)


export default userApi