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
     if (searchStr.hasOwnProperty('completed') && searchStr.completed === 'true'){
     	console.log('dcewwwwwwwcsdcww');
     	copiedVal.completed=true;
     }else if (searchStr.hasOwnProperty('completed') && searchStr.completed === 'false'){
     	copiedVal.completed=false;
     }
      if (searchStr.hasOwnProperty('q') && searchStr.q.length>0){
     	copiedVal.description={
     		$like:'%'+searchStr.q+'%'
     	};
     }

db.todo.findAll({where:copiedVal}).then(function(data){
	
	if(!!data){
		console.log('dcewwwwwwwww');
		res.json(data);}
	else{res.status(404).json();}

},function(e){
	res.status(500).json(e)
});
});

app.get('/listall/:id', function(req, res) {
    var resp = '';
    var id = parseInt(req.params.id)
    var matchedTodo = {};


    db.todo.findById(id).then(function(todo) {
    	if(!!todo){
        res.json(todo.toJSON());
    }else{
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
db.todo.findById(id).then(function(todo) {
    	if(!!todo){
        res.json(todo.toJSON());
    }else{
    	res.status(404).send();
    }
    }, function(e) {
        res.status(500).send();
    });


   /* var matchedTodo = _.findWhere(todos, {
        id: id
    })
    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
    } else res.status(404).json({
        "error": "nothing found on that id"
    });
*/

    res.json(todos);

});


app.put('/listall/put/:id', function(req, res) {
    var beforUpdate = _.pick(req.body, 'description', 'completed');

    var updatedTodo = {};

    if (beforUpdate.hasOwnProperty('completed') && _.isBoolean(beforUpdate.completed)) {
        updatedTodo.completed = beforUpdate.completed;
    } else if (beforUpdate.hasOwnProperty('completed')) {
        res.status(400).send();
    } else {}
    if (beforUpdate.hasOwnProperty('description') && _.isString(beforUpdate.description) && beforUpdate.description.trim().length > 0) {
        updatedTodo.description = beforUpdate.description;
    } else if (beforUpdate.hasOwnProperty('description')) {
        res.status(400).send();
    } else {}
    var id = parseInt(req.params.id)
    var matchedTodo = _.findWhere(todos, {
        id: id
    })
    if (matchedTodo) {
        updatedTodo = _.extend(matchedTodo, updatedTodo);
        todos.push(updatedTodo);

    } else {
        res.status(400).json({
            "error": "requested component no more"
        });
    }
    res.json(todos);
});

db.sequelize.sync().then(function() {
    app.listen(port, function() {
        console.log('listening on port' + port);
    });
});
