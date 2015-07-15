var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId){
  models.Comment.find({
    where:{id: Number(commentId)}
  }).then(function(comment){
    if(comment) {
      req.comment = comment;
      next();
    }else{
      next(new Error('No existe commentId=' + commentId))
    }
  }
  ).catch(function(error){next(error)});
};

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

//GET  /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
  req.comment.publicado = true;

  req.comment.save ()//si pongo solo el campo no va bien??? problema de versiones???
    .then(function(){res.redirect('/quizes/'+req.params.quizId);})
    .catch(function(error){next(error)});
};
