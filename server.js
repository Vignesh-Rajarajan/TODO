var express=require('express');
var app = express();
var port =process.env.PORT || 3000;

var todos=[{
	id:1,
	description:'study cross browser hacks',
	complete:false
},
{
	id:2,
	description:'implement angular custom directives',
	complete:false
}];


app.get('/',function(req,res){
	res.send('Welcome to TO-DO api');
});

app.get('/listall',function(req,res){
	var resp='';
	for(var i=0;i<todos.length;i++){
resp+=JSON.stringify(todos[i])+'\n';
	}
	res.send('The todos are as follows \n'+resp);
});

app.get('/listall/:id',function(req,res){
	var resp='';
	console.log(req.params.id);
	todos.forEach(function(todo){
		console.log(todo);
		console.log(typeof todo.id);
		console.log(req.params.id==todo.id);
		if(req.params.id==todo.id){

			resp=todo;
		}
	})
	res.json(resp);
});

app.listen(port,function(){
	console.log('listening on port'+port);
});
