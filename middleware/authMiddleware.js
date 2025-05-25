const { verifyToken } = require('../utils/jwt')

// validate auth token 
const authMiddleware = async (req, res, next) => {
	try {
		let token = req.header('Authorization')
		
		if (!token) {
			return res.status(401).json({ message: 'Authorization token missing' })
		}
		
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length).trimLeft()
		}
		
		const verified = verifyToken(token)
		req.user = verified
		
		next()
	} catch (err) {
		res.status(401).json({ message: 'Unauthorized - Invalid token' })
	}
}

module.exports = authMiddleware