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
	console.log("se ha pedido quizes/index");
	var search = req.query.search || "";
	search = "%" + search.replace(/ /g, "%") + "%";
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
	function(quizes){
		console.log(quizes);
		res.render('quizes/index', { quizes : quizes});
	}).catch(function(error) {next(error);});
};

//GET	/quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', { quiz : req.quiz});
};

//GET	/quizes/:id/answer
exports.answer = function(req, res){
	var result = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		result = 'Correcto';
	}
	res.render('quizes/answer', { quiz : req.quiz, respuesta: result});
};