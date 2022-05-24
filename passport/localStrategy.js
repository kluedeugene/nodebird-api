const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email', //req.body.email
				passwordField: 'password' //req.body.password
			},
			async (email, password, done) => {
				try {
					const exUser = await User.findOne({ where: { email } });
					if (exUser) {
						const result = await bcrypt.compare(password, exUser.password); //비밀번호가 일치하는지 검사(해시화된비밀번호)
						if (result) {
							done(null, exUser); //done-> auth.js의 login 으로 간다.
						} else {
							done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
						}
					} else {
						done(null, false, { message: '가입되지 않은 회원입니다.' });
					}
				} catch (error) {
					console.error(error);
					done(error);
				}
			}
		)
	);
};
