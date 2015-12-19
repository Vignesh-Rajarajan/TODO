module.exports = function(sequelize, dataTypes) {
	return sequelize.define('todo', {
		description: {
			type: dataTypes.STRING,
			notNULL: false,
			validate: {
				len: [1, 250]
			}
		},
		completed: {
			type: dataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false
		}
	});
};