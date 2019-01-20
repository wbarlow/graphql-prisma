import jwt from  'jsonwebtoken'

const secret = 'thisisawebsecret'

const generateToken = (userId) => {
    return jwt.sign({id: userId}, secret, { expiresIn: '7d' })
}

export { generateToken as default, secret }