var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
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

			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}
				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});

					var genData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString();
					.
					var token = jwt.sign({
						token: genData
					}, 'vickey290');

					return token;
				} catch (e) {
					return undefined;
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email == 'string' && typeof body.password == 'string') {


						user.findOne({
							where: {
								email: body.email
							}
						}).then(function(data) {

							if (data && bcrypt.compareSync(body.password, data.get('password_hash'))) {

								resolve(data);
							} else if (!data || !bcrypt.compareSync(body.password, data.get('password_hash'))) {

								return reject({
									"error": "please valid username or password"
								});
							}
						}, function(e) {

							reject({
								"error": "OOPS nothing found"
							});
						})
					} else {

						return reject({
							"error": "please provide username or password"
						});
					}

				});

			},
			authenticateToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {

						var jwtDecoed = jwt.verify(token, 'vickey290');

						var cryptoDecoed = cryptojs.AES.decrypt(jwtDecoed.token, 'abc123!@#');

						var bytes = JSON.parse(cryptoDecoed.toString(cryptojs.enc.Utf8));

						user.findById(bytes.id).then(function(data) {
							if (data) {

								return resolve(data);
							} else {

								return reject();
							}

						}, function(e) {

							return reject();
						})
					} catch (e) {
						reject(e);
					}
				});


			}
		}
	});
	return user;
};