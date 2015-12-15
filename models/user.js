module.exports=function(sequelize,dataTypes){
return sequelize.define('user',{
	email:{
		type:dataTypes.STRING,
		notNULL:false,
		unique:true,
		validate:{
			len:[1,250],
			 isEmail: true,   

		}
	},
	password:{
		type:dataTypes.STRING,
		allowNull:false,
		validate:{
			len:[6,15]
		}
	}
});
};