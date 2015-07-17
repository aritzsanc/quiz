var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var estadisticasController = require('../controllers/estadisticas_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});
router.get ('/author', function(req, res) {
  res.render('author', {errors: []});
});
//Autoload de comandos :quizId
router.param('quizId', quizController.load);//autoload:quizId
router.param('commentID', commentController.load);//autoload:commentId

//Definición de rutas de session
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

router.get ('/quizes', quizController.index);
//router.get ('/quizes/question', quizController.question);
//router.get ('/quizes/answer', quizController.answer);
router.get ('/quizes/:quizId(\\d+)', quizController.show);
router.get ('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get ('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);
//router.get('/quizes/create', quizController.create);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentID(\\d+)/publish', sessionController.loginRequired, commentController.publish);

router.get ('/estadisticas', estadisticasController.index);

module.exports = router;
