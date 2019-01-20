import jwt from  'jsonwebtoken'
import { secret } from './generateToken'

const getUserId = (request, requireAuth = true) => {
    const header = request.request ?
        request.request.headers.authorization :
        request.connection.context.Authorization

    if (header) { 
        const token = header.replace('Bearer ', '')
        const decoded = jwt.verify(token, String(secret))

        return decoded.id
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    } 

    return null
}

export { getUserId as default }