const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User } = require('../models');

const router = express.Router();

router.post('/token', async (req, res) => {
	const { clientSecret } = req.body;
	try {
		//도메인 등록 검사
		const domain = await Domain.findOne({
			where: { clientSecret },
			include: {
				model: User,
				attribute: ['nick', 'id']
			}
		});
		if (!domain) {
			return res.status(401).json({
				code: 401,
				message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요'
			});
		}
		const token = jwt.sign(
			//토큰 발급
			{
				id: domain.User.id,
				nick: domain.User.nick
			},
			process.env.JWT_SECRET,
			{
				expiresIn: '1m', // 1분
				issuer: 'nodebird'
			}
		);
		return res.json({
			code: 200,
			message: '토큰이 발급되었습니다',
			token
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			code: 500,
			message: '서버 에러'
		});
	}
});

router.get('/test', verifyToken, (req, res) => {
	// 토큰 검사
	res.json(req.decoded);
});

module.exports = router;
