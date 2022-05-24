const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next(); //다음 미들웨어로 next
	} else {
		res.status(403).send('로그인 필요'); //next없으니 여기서 끝
	}
};

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		const message = encodeURIComponent('로그인이 되어있습니다.');
		res.redirect('/?error=${message}');
	}
};

exports.verifyToken = (req, res, next) => {
	try {
		req.data.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
		return next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(419).json({
				code: 419,
				message: '토큰 만료'
			});
		}
		return res.status(401).json({
			code: 401,
			message: '유효하지 않은 토큰'
		});
	}
};
