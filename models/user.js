var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

module.exports = function(sequelize, dataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: dataTypes.STRING,
			notNULL: false,
			unique: true,
			validate: {
				len: [1, 250],
				isEmail: true,

			}
		},
		salt: {
			type: dataTypes.STRING
		},
		password_hash: {
			type: dataTypes.STRING
		},
		password: {
			type: dataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [6, 15]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hasedPassword = bcrypt.hashSync(value, salt);
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hasedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJson: function() {
				var obj = this.toJSON();
				return _.pick(obj, 'id', 'email', 'createdAt', 'updatedAt');

			}

		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email == 'string' && typeof body.password == 'string') {
						console.log('in userrr file' + body);

						user.findOne({
							where: {
								email: body.email
							}
						}).then(function(data) {
							console.log('in user file' + data);
							if (data && bcrypt.compareSync(body.password, data.get('password_hash'))) {

								resolve(data);
							} else if (!data || !bcrypt.compareSync(body.password, data.get('password_hash'))) {
								console.log('in user file reject');
								return reject({
									"error": "please valid username or password"
								});
							}
						}, function(e) {
							console.log('in user file reject');
							reject({
								"error": "OOPS nothing found"
							});
						})
					} else {
						console.log('in user file reject');
						return reject({
							"error": "please provide username or password"
						});
					}

				});

			}
		}
	});
	return user;
};