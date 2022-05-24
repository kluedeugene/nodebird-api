const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
	static init(sequelize) {
		return super.init(
			{
				host: {
					//등록할 도메인
					type: Sequelize.STRING(80),
					allowNull: false
				},
				type: {
					type: Sequelize.ENUM('free', 'premium'), //스트링 둘중 하나만 입력되도록
					allowNull: false
				},
				clientSecret: {
					//api key 발급
					type: Sequelize.STRING(36), //Sequelize.UUIDV4() 로할수도있으나 시퀄라이즈에선 UUID만 지원 , 지원하는 다른 db가있음.
					allowNull: false
				}
			},
			{
				sequelize,
				timestamps: true,
				paranoid: true,
				modelName: 'Domain',
				tableName: 'domains'
			}
		);
	}

	static associate(db) {
		db.Domain.belongsTo(db.User);
	}
};
