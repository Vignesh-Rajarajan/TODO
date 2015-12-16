var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');

module.exports = function(sequelize, dataTypes) {
	return sequelize.define('user', {
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
			set:function(value){
				var salt=bcrypt.genSaltSync(10);
				var hasedPassword=bcrypt.hashSync(value,salt);
                this.setDataValue('password',value);
                this.setDataValue('salt',salt);
                this.setDataValue('password_hash',hasedPassword);
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
			toPublicJson:function(){
				var obj=this.toJSON();
				return _.pick(obj,'id','email','createdAt','updatedAt');
			
		}
	}
	});
};