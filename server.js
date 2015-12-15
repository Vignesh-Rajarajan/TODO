var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyparser = require('body-parser');
var todos = [];
var todoNextId = 1;
var _ = require('underscore');
var db = require('./db.js');



app.get('/', function(req, res) {
	res.send('Welcome to TO-DO api');
});
app.use(bodyparser.json());


app.get('/listall', function(req, res) {

	var copiedVal = {};
	var searchStr = req.query;
	if (searchStr.hasOwnProperty('completed') && searchStr.completed === 'true') {
		console.log('dcewwwwwwwcsdcww');
		copiedVal.completed = true;
	} else if (searchStr.hasOwnProperty('completed') && searchStr.completed === 'false') {
		copiedVal.completed = false;
	}
	if (searchStr.hasOwnProperty('q') && searchStr.q.length > 0) {
		copiedVal.description = {
			$like: '%' + searchStr.q + '%'
		};
	}

	db.todo.findAll({
		where: copiedVal
	}).then(function(data) {

		if (!!data) {
			console.log('dcewwwwwwwww');
			res.json(data);
		} else {
			res.status(404).json();
		}

	}, function(e) {
		res.status(500).json(e)
	});
});

app.get('/listall/:id', function(req, res) {
	var resp = '';
	var id = parseInt(req.params.id)
	var matchedTodo = {};


	db.todo.findById(id).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
	/*_.findWhere(todos, {
			id: id
		})*/
});


app.post('/todos', function(req, res) {
	var newTodobef = req.body;
	var newTodo = _.pick(newTodobef, 'description', 'completed')
	if (!_.isBoolean(newTodo.completed) || !_.isString(newTodo.description))



	{
		res.status(400).send();
	}

	/*    newTodo.id = todoNextId++;*/

	db.todo.create(newTodo).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});


});


app.delete('/listall/delete/:id', function(req, res) {
	var id = parseInt(req.params.id);
	console.log('sggrgrtg' + id);
	db.todo.destroy({
		where: {
			id: id
		}
	}).then(function(data) {
		console.log(data);
		if (data > 0) {
			res.status(200).json({
				"data": "successfully deleted"
			});
		} else {
			res.status(404).json({
				"data": "nothing found"
			})
		}

	}, function(e) {
		res.status(500).json();
	});

});


app.put('/listall/put/:id', function(req, res) {
	var beforUpdate = _.pick(req.body, 'description', 'completed');

	var updatedTodo = {};

	if (beforUpdate.hasOwnProperty('completed')) {
		updatedTodo.completed = beforUpdate.completed;
	}
	if (beforUpdate.hasOwnProperty('description')) {
		updatedTodo.description = beforUpdate.description;
	}
	var id = parseInt(req.params.id)
	db.todo.findById(id).then(function(data) {
		if(data){

		data.update(updatedTodo).then(function(todo) {
			if (!!todo) {
				res.json(todo.toJSON());
			} else {
				res.status(404).json();
			}
		}, function(e) {
			res.status(500).json(e);
		});
}else{
	res.status(404).json({"data":"nullll"})
}


	});

});

app.post('/users',function(req,res){
	var user=_.pick(req.body, 'email', 'password');
	console.log(user);
	if(!user){
		res.status(400).json();
	}
  db.user.create(user).then(function(user){
      if(user){
      	res.json(user);
      }
      else{
      	res.status(404).json();
      }
  }, function(e){
  	res.status(400).json(e);
  });

});


db.sequelize.sync().then(function() {
	app.listen(port, function() {
		console.log('listening on port' + port);
	});
});