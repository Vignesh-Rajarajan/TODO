module.exports=function(db){
	return {
		requireAuthentication:function(req,res,next){
            var token= req.get('Auth');
            console.log('\nrequireAuthentication\t'+token);
            db.user.authenticateToken(token).then(function(user){
                       req.user=user;
                       next();

            },function(e){
            	res.status(401).send();

            });
		}
	};
};