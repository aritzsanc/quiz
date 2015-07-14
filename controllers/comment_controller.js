var models = require('../models/models.js');


//GET /quizes/:quizId/comment/new
exports.new = function(req, res){
  models.Quiz.find(req.params.quizId).then(
  function(quiz){
    //res.render('comments/new.ejs', {quiz: req.params.quizId, errors: []});
    res.render('comments/new.ejs', {quiz: quiz, errors: []});
  });
};

//POST /quizes/:quizId/comments
exports.create = function(req, res){
  var comment = models.Comment.build(
    { texto: req.body.comment.texto,
      QuizId: req.params.quizId
    });
    var errors = comment.validate();
    if(errors){
      var i=0; var errores=new Array();
      for (var prop in errors) errores[i++]={message: errors[prop]};
      res.render('comments/new.ejs',
          {comment: comment, quizid: req.params.quizId, errors: erroress});
    }else{
      comment.save()
      .then(function(){res.redirect('/quizes/'+req.params.quizId)})
    }
  //.catch(function(error){next(error)});
};
