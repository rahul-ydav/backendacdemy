const jwt = require('jsonwebtoken');
class AuthService {

	authenticateToken(req, res, next) {
		const token = req.cookies.jwt;
		if (!token) return res.sendStatus(401);
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) return res.sendStatus(403);
			// req.user = decoded;
			// decoded.password = 'abc';
			next();
		})
	}
}

module.exports = AuthService;