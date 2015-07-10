var models = require('../models/models.js');

//Autoload -factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
	function(quiz){
		if (quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error('No existe quizId =' + quizId));
		}
	}).catch(function(error) {next(error);});
};
//GET	/quizes/
exports.index = function(req, res){
	var search = req.query.search || "";
	var search_tema = req.query.search_tema || "%%";
	search = "%" + search.replace(/ /g, "%") + "%";
	models.Quiz.findAll({where: {
																pregunta: {like: search},
																tema: {like :search_tema}}})
	.then(
	function(quizes){
		res.render('quizes/index', { quizes : quizes, temas: models.temas, errors: []});
	}).catch(function(error) {next(error);});
};

//GET	/quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', { quiz : req.quiz, errors: []});
};

//GET	/quizes/:id/answer
exports.answer = function(req, res){
	var result = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		result = 'Correcto';
	}
	res.render('quizes/answer', { quiz : req.quiz, respuesta: result, errors: []});
};

//GET	/quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
	{pregunta:"Pregunta", respuesta:"Respuesta", tema: ""}
	);
	res.render('quizes/new', { quiz : quiz, temas: models.temas, errors: []});
};

//POST	/quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	var errors = quiz.validate();
	if(errors){
		var i=0; var errores=new Array();
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/new', {quiz: quiz, errors:errores});
	}else{
		quiz.save({fields:["pregunta", "respuesta", "tema"]})
				.then(function(){res.redirect('/quizes');});
	}
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, temas: models.temas, errors: []});
};

//PUT /quizes/:id/
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	var errors = req.quiz.validate();
	if(errors){
		var i=0; var errores=new Array();
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/edit', {quiz: req.quiz, errors:errores});
	}else{
		req.quiz.save({fields:["pregunta", "respuesta", "tema"]})
				.then(function(){res.redirect('/quizes');});
	}

};

//DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};
